import axios from 'axios';
import type { ToastApi } from '@/providers/types';
import { ITEM_STATES } from '@/const/common';

const processMock = jest.fn();
const parseMock = jest.fn();
const axiosGetMock = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: { get: (...args: unknown[]) => axiosGetMock(...args) },
}));

jest.mock('@/api', () => ({
  CapEventPackageApi: {
    default: { process: (...args: unknown[]) => processMock(...args) },
  },
  BoxConnectorApi: {
    request: {
      config: { BASE: 'https://api.example.com', WITH_CREDENTIALS: true },
    },
  },
}));

jest.mock('@/utils/parseToPreviewScreenRows', () => ({
  parseToPreviewScreenRows: (...args: unknown[]) => parseMock(...args),
}));

// Mock stores used by PreviewScreenStore
const mockCapEventSettingsStore = {
  eventTypes: [
    { id: 'TYPE1', name: 'Distribution', abbreviation: 'Distr', state: ITEM_STATES.SELECTED },
  ],
  sponsors: [{ id: 'SP1', name: 'Golden image-Dev', state: ITEM_STATES.SELECTED }],
  fundGroups: [{ id: 'FG1', name: 'Gen 2 Demo Buyout Fund I', state: ITEM_STATES.SELECTED }],
  fundEntities: [
    {
      id: 'E1',
      name: 'Gen 2 Demo Buyout Fund I, L.P.',
      label: 'E1 - Gen 2 Demo Buyout Fund I, L.P.',
      state: ITEM_STATES.SELECTED,
    },
  ],
  accounts: [
    {
      accountNo: '0721',
      capitalCategory: 'Cont - Expense offsets',
      callDistributionReason: 'Test Reason 1',
      defaultDescription: 'Test Description 1',
      insideCommitment: 'Yes',
    },
  ],
  investments: [{ id: '2200', title: '', name: 'IDB DEVELOPMENT CORP LTD NPV', type: '' }],
  fundGroupsLineItem: [
    {
      id: 'row-temp-1', // not uuid -> store should generate uuid for payload
      capitalCategory: 'Cont - Expense offsets',
      callDistributionReason: 'Test Reason 1',
      defaultDescription: 'Test Description 1',
      insideCommitment: 'Yes',
      investment: '', // optional for this category
      allocationBasis: 'commitment',
      amount: 100000,
    },
  ],
  entitiesLineItem: new Map<string, Array<Record<string, unknown>>>([
    [
      'E1 - Gen 2 Demo Buyout Fund I, L.P.',
      [
        {
          capitalCategory: 'Cont - Expense offsets',
          callDistributionReason: 'Test Reason 1',
          defaultDescription: 'Test Description 1',
          insideCommitment: 'Yes',
          investment: '', // optional
          allocationBasis: 'commitment',
          amount: 100000,
          inheritedId: 'row-temp-1',
          prFlag: 'Yes',
          // prDate omitted -> will be taken from due date
        },
      ],
    ],
  ]),
};

const mockEntityDatesStore: {
  noticeDate: Date;
  getEntityNoticeDate: jest.Mock;
  getEntityDueDate: jest.Mock;
  getEntityDueDateInputValidity: jest.Mock;
  getEntityNoticeDateInputValidity: jest.Mock;
} = {
  noticeDate: new Date('2025-11-17'),
  getEntityNoticeDate: jest.fn(() => new Date('2025-11-17')),
  getEntityDueDate: jest.fn(() => new Date('2025-11-24')),
  getEntityDueDateInputValidity: jest.fn(() => true),
  getEntityNoticeDateInputValidity: jest.fn(() => true),
};

jest.mock('@/stores', () => ({
  capEventSettingsStore: mockCapEventSettingsStore,
  entityDatesStore: mockEntityDatesStore,
}));

describe('PreviewScreenStore', () => {
  const BlobCtor: new (...args: unknown[]) => unknown =
    (global as unknown as { Blob?: new (...args: unknown[]) => unknown }).Blob ??
    (class MockBlob {} as unknown as new (...args: unknown[]) => unknown);

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axiosGetMock.mockReset();
    (axios as unknown as { get: jest.Mock }).get = axiosGetMock as unknown as jest.Mock;
  });

  const importStore = async () => {
    const mod = await import('@/stores/PreviewScreenStore');
    return mod.previewScreenStore;
  };

  it('processPayload: when not enough data, shows toast and does not call API', async () => {
    // Temporarily make entities invalid (no selected entities)
    const prevEntities = mockCapEventSettingsStore.fundEntities;
    (mockCapEventSettingsStore as unknown as { fundEntities: unknown[] }).fundEntities = [];
    const store = await importStore();
    const toast = { error: jest.fn() } as unknown as ToastApi;

    const result = await store.processPayload(toast);

    expect(toast.error).toHaveBeenCalledWith('Not enough valid data');
    expect(processMock).not.toHaveBeenCalled();
    expect(parseMock).not.toHaveBeenCalled();
    expect(result).toEqual([]);

    // restore
    (mockCapEventSettingsStore as unknown as { fundEntities: unknown[] }).fundEntities =
      prevEntities;
  });

  it('processPayload success: builds payload from stores, calls API once, updates rows', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() } as unknown as ToastApi;
    const apiResponse = [{ any: 'response' }];
    processMock.mockResolvedValueOnce(apiResponse);
    parseMock.mockReturnValueOnce([{ id: 'r1' }, { id: 'r2' }]);

    const result = await store.processPayload(toast);

    // Assert API called with expected shape
    expect(processMock).toHaveBeenCalledTimes(1);
    const sentPayload = processMock.mock.calls[0][0];
    expect(sentPayload).toEqual(
      expect.objectContaining({
        sponsor: expect.objectContaining({ id: 'SP1' }),
        capEventType: expect.objectContaining({ id: 'TYPE1' }),
        fundGroup: expect.objectContaining({ id: 'FG1' }),
        entities: [expect.objectContaining({ id: 'E1' })],
        noticeDate: '2025-11-17',
        totalAmount: 100000,
      }),
    );

    // fund group line item id must be uuid v4 (not our "row-temp-1")
    const fg = (sentPayload.capEventFundGroupLineItems || [])[0];
    expect(fg.id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
    );
    expect(fg.account).toEqual(
      expect.objectContaining({
        accountNo: '0721',
        category: 'Cont - Expense offsets',
        reason: 'Test Reason 1',
        description: 'Test Description 1',
        insideCmnt: 'Yes',
      }),
    );

    // entity line item should link to fund group via fundGroupLineItemId and set pr fields
    const entityItem = sentPayload.capEventEntityLineItems[0];
    expect(entityItem.entity).toEqual(expect.objectContaining({ id: 'E1' }));
    expect(entityItem.noticeDate).toBe('2025-11-17');
    expect(entityItem.dueDate).toBe('2025-11-24');
    expect(entityItem.capEventLineItems[0]).toEqual(
      expect.objectContaining({
        allocationBasis: 'commitment',
        amount: 100000,
        prFlag: true,
        prDate: '2025-11-24',
        fundGroupLineItemId: fg.id,
      }),
    );

    // rows updated from parser
    expect(parseMock).toHaveBeenCalledWith(apiResponse);
    expect(result).toEqual([{ id: 'r1' }, { id: 'r2' }]);
    expect(store.rows).toEqual([{ id: 'r1' }, { id: 'r2' }]);
    expect(store.isLoading).toBe(false);
  });

  it('processPayload concurrent calls use in-flight guard and call API only once', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() } as unknown as ToastApi;
    processMock.mockResolvedValueOnce([{ any: 'response' }]);
    parseMock.mockReturnValue([{ id: 'r1' }]);

    const p1 = store.processPayload(toast);
    const p2 = store.processPayload(toast);
    const [r1, r2] = await Promise.all([p1, p2]);

    expect(processMock).toHaveBeenCalledTimes(1);
    expect(r1).toEqual([{ id: 'r1' }]);
    expect(r2).toEqual([{ id: 'r1' }]);
  });

  it('processPayload API error shows toast and clears rows', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() } as unknown as ToastApi;
    processMock.mockRejectedValueOnce(new Error('Boom'));

    const result = await store.processPayload(toast);

    expect(toast.error).toHaveBeenCalledWith('Boom');
    expect(result).toEqual([]);
    expect(store.rows).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('fetchDoc success returns blob and uses BoxConnectorApi config', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() } as unknown as ToastApi;
    // Use environment-agnostic Blob constructor
    const blob = new (BlobCtor as new (...args: unknown[]) => unknown)();
    axiosGetMock.mockResolvedValueOnce({ data: blob });

    const result = await store.fetchDoc('file-123', toast);

    expect(axiosGetMock).toHaveBeenCalledWith('https://api.example.com/files/file-123/content', {
      responseType: 'blob',
      headers: { Accept: 'application/octet-stream' },
      withCredentials: true,
    });
    expect(result).toBeInstanceOf(BlobCtor);
  });

  it('fetchDoc error shows toast and returns undefined', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() } as unknown as ToastApi;
    axiosGetMock.mockRejectedValueOnce(new Error('Oops'));

    const result = await store.fetchDoc('file-123', toast);

    expect(toast.error).toHaveBeenCalledWith('Failed to fetch Box file content');
    expect(result).toBeUndefined();
  });
});
