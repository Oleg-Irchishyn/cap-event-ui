import axios from 'axios';
import type { ToastApi } from '@/providers/types';
import { ITEM_STATES } from '@/const/common';
import type { PreviewScreenRow } from '@/app/preview-screen/types';
import RootStore from '@/stores/RootStore';
import PreviewScreenStore from '@/stores/PreviewScreenStore';

const processMock = jest.fn();
const parseMock = jest.fn();
const axiosPostMock = jest.fn();

jest.mock('axios', () => ({
  __esModule: true,
  default: { post: (...args: unknown[]) => axiosPostMock(...args) },
}));

jest.mock('@/api', () => ({
  CapEventPackageApi: {
    default: { process: (...args: unknown[]) => processMock(...args) },
    request: {
      config: { BASE: 'https://cap.example.com', WITH_CREDENTIALS: true },
    },
  },
}));

jest.mock('@/utils/parseToPreviewScreenRows', () => ({
  parseToPreviewScreenRows: (...args: unknown[]) => parseMock(...args),
}));

jest.mock('@/utils/sessionIdStorage', () => ({
  getStoredSessionId: jest.fn().mockReturnValue(''),
}));

const mockCapEventSettingsStore = {
  getAllocationBasisId: jest.fn(),
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
      id: 'row-temp-1',
      capitalCategory: 'Cont - Expense offsets',
      callDistributionReason: 'Test Reason 1',
      defaultDescription: 'Test Description 1',
      insideCommitment: 'Yes',
      investment: '',
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
          investment: '',
          allocationBasis: 'commitment',
          amount: 100000,
          fundGroupLineItemInheritanceId: 'row-temp-1',
          prFlag: 'Yes',
        },
      ],
    ],
  ]),
  comment: '',
};

const mockEntityDatesStore: {
  noticeDate: Date;
  getEntityNoticeDate: jest.Mock;
  getEntityDueDate: jest.Mock;
  getEntityDueDateInputValidity: jest.Mock;
  getEntityNoticeDateInputValidity: jest.Mock;
} = {
  // Create dates in local timezone to avoid timezone issues (month is 0-indexed: 10 = November)
  noticeDate: new Date(2025, 10, 17),
  getEntityNoticeDate: jest.fn(() => new Date(2025, 10, 17)),
  getEntityDueDate: jest.fn(() => new Date(2025, 10, 24)),
  getEntityDueDateInputValidity: jest.fn(() => true),
  getEntityNoticeDateInputValidity: jest.fn(() => true),
};

describe('PreviewScreenStore', () => {
  const BlobCtor: new (...args: unknown[]) => unknown =
    (global as unknown as { Blob?: new (...args: unknown[]) => unknown }).Blob ??
    (class MockBlob {} as unknown as new (...args: unknown[]) => unknown);

  let store: PreviewScreenStore;
  let rootStore: RootStore;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axiosPostMock.mockReset();
    (axios as unknown as { post: jest.Mock }).post = axiosPostMock as unknown as jest.Mock;

    mockEntityDatesStore.getEntityNoticeDate.mockReturnValue(new Date(2025, 10, 17));
    mockEntityDatesStore.getEntityDueDate.mockReturnValue(new Date(2025, 10, 24));
    mockEntityDatesStore.getEntityDueDateInputValidity.mockReturnValue(true);
    mockEntityDatesStore.getEntityNoticeDateInputValidity.mockReturnValue(true);

    rootStore = new RootStore();

    rootStore.capEventSettingsStore =
      mockCapEventSettingsStore as unknown as typeof rootStore.capEventSettingsStore;
    rootStore.entityDatesStore =
      mockEntityDatesStore as unknown as typeof rootStore.entityDatesStore;

    store = rootStore.previewScreenStore;
  });

  it('processPayload: when not enough data, shows toast and does not call API', async () => {
    const prevEntities = mockCapEventSettingsStore.fundEntities;
    (mockCapEventSettingsStore as unknown as { fundEntities: unknown[] }).fundEntities = [];
    const toast = { error: jest.fn() } as unknown as ToastApi;

    const result = await store.processPayload(toast);

    expect(toast.error).toHaveBeenCalledWith('Not enough valid data');
    expect(processMock).not.toHaveBeenCalled();
    expect(parseMock).not.toHaveBeenCalled();
    expect(result).toEqual([]);

    (mockCapEventSettingsStore as unknown as { fundEntities: unknown[] }).fundEntities =
      prevEntities;
  });

  it('processPayload success: builds payload from stores, calls API once, updates rows', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;
    const apiResponse = [{ data: 'response' }];
    processMock.mockResolvedValueOnce(apiResponse);
    parseMock.mockReturnValueOnce([{ id: 'r1' }, { id: 'r2' }]);

    const result = await store.processPayload(toast);

    expect(processMock).toHaveBeenCalledTimes(1);
    const sentPayload = processMock.mock.calls[0][0];
    expect(sentPayload.sponsor.id).toBe('SP1');
    expect(sentPayload.capEventType.id).toBe('TYPE1');
    expect(sentPayload.fundGroup.id).toBe('FG1');
    expect(sentPayload.entities).toHaveLength(1);
    expect(sentPayload.entities[0].id).toBe('E1');
    expect(sentPayload.noticeDate).toBe('2025-11-17');
    expect(sentPayload.totalAmount).toBe(100000);

    const fg = (sentPayload.capEventFundGroupLineItems || [])[0];
    expect(fg.account).toEqual(
      expect.objectContaining({
        accountNo: '0721',
        capitalCategory: 'Cont - Expense offsets',
        callDistributionReason: 'Test Reason 1',
        defaultDescription: 'Test Description 1',
        insideCommitment: 'yes',
      }),
    );
    expect(fg.inheritanceId).toBeUndefined();

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
        fundGroupLineItemInheritanceId: 'row-temp-1',
      }),
    );

    expect(parseMock).toHaveBeenCalledWith(apiResponse);
    expect(result).toEqual([{ id: 'r1' }, { id: 'r2' }]);
    expect(store.rows).toEqual([{ id: 'r1' }, { id: 'r2' }]);
    expect(store.isLoading).toBe(false);
  });

  it('buildFundGroupLineItems: sets inheritanceId only when explicit value exists', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;

    (mockCapEventSettingsStore.fundGroupsLineItem as Array<Record<string, unknown>>)[0] = {
      ...(mockCapEventSettingsStore.fundGroupsLineItem as Array<Record<string, unknown>>)[0],
      inheritanceId: 'FG-EXPLICIT-1',
    };

    processMock.mockResolvedValueOnce([{ data: 'response' }]);
    parseMock.mockReturnValueOnce([]);

    await store.processPayload(toast);

    const sentPayload = processMock.mock.calls[0][0];
    const fg = (sentPayload.capEventFundGroupLineItems || [])[0];
    expect(fg.inheritanceId).toBe('FG-EXPLICIT-1');
  });

  it('buildEntityLineItems: maps entity inheritance id via idMap when available (identity mapping)', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;

    (mockCapEventSettingsStore.fundGroupsLineItem as Array<Record<string, unknown>>)[0] = {
      ...(mockCapEventSettingsStore.fundGroupsLineItem as Array<Record<string, unknown>>)[0],
      inheritanceId: 'FG-EXPLICIT-2',
    };

    const entityRows = mockCapEventSettingsStore.entitiesLineItem.get(
      'E1 - Gen 2 Demo Buyout Fund I, L.P.',
    ) as Array<Record<string, unknown>>;
    entityRows[0] = {
      ...entityRows[0],
      fundGroupLineItemInheritanceId: 'FG-EXPLICIT-2',
    };

    processMock.mockResolvedValueOnce([{ data: 'response' }]);
    parseMock.mockReturnValueOnce([]);

    await store.processPayload(toast);

    const sentPayload = processMock.mock.calls[0][0];
    const entityItem = sentPayload.capEventEntityLineItems[0];
    expect(entityItem.capEventLineItems[0]).toEqual(
      expect.objectContaining({
        fundGroupLineItemInheritanceId: 'FG-EXPLICIT-2',
      }),
    );
  });

  it('buildEntityLineItems: omits fundGroupLineItemInheritanceId when source is missing', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;

    const entityRows = mockCapEventSettingsStore.entitiesLineItem.get(
      'E1 - Gen 2 Demo Buyout Fund I, L.P.',
    ) as Array<Record<string, unknown>>;
    delete entityRows[0].fundGroupLineItemInheritanceId;

    processMock.mockResolvedValueOnce([{ data: 'response' }]);
    parseMock.mockReturnValueOnce([]);

    await store.processPayload(toast);

    const sentPayload = processMock.mock.calls[0][0];
    const entityItem = sentPayload.capEventEntityLineItems[0];
    expect(entityItem.capEventLineItems[0].fundGroupLineItemInheritanceId).toBeUndefined();
  });

  it('calls getAllocationBasisId for fund group and entity line items', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;
    mockCapEventSettingsStore.getAllocationBasisId.mockReturnValue('DS-CMNT');
    processMock.mockResolvedValueOnce([{ data: 'response' }]);
    parseMock.mockReturnValueOnce([]);

    await store.processPayload(toast);

    expect(mockCapEventSettingsStore.getAllocationBasisId).toHaveBeenCalledWith('commitment');
    const sentPayload = processMock.mock.calls[0][0];
    expect(sentPayload.capEventFundGroupLineItems[0]).toHaveProperty(
      'allocationBasisId',
      'DS-CMNT',
    );
    expect(sentPayload.capEventEntityLineItems[0].capEventLineItems[0]).toHaveProperty(
      'allocationBasisId',
      'DS-CMNT',
    );
  });

  it('processPayload concurrent calls use in-flight guard and call API only once', async () => {
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
    const toast = { error: jest.fn() } as unknown as ToastApi;
    processMock.mockRejectedValueOnce(new Error('Boom'));

    const result = await store.processPayload(toast);

    expect(toast.error).toHaveBeenCalledWith('Boom');
    expect(result).toEqual([]);
    expect(store.rows).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('fetchDoc success posts to investor document endpoint and returns blob', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;

    const processResponse = [
      {
        entity: { id: 'E1', name: 'Entity 1' },
        plInvestorEntries: [
          { customerId: 'INV1', investor: 'INV1-Name' },
          { customerId: 'INV2', investor: 'INV2-Name' },
        ],
      },
    ];
    processMock.mockResolvedValueOnce(processResponse);
    parseMock.mockReturnValueOnce([]);
    await store.processPayload(toast);

    const blob = new (BlobCtor as new (...args: unknown[]) => unknown)(['x'], {
      type: 'application/octet-stream',
    } as unknown);
    axiosPostMock.mockResolvedValueOnce({
      data: blob,
      headers: { 'content-type': 'application/octet-stream' },
    });

    const result = await store.fetchDoc(
      {
        id: 'row1',
        investor: 'INV1-Name',
        investorId: 'INV1',
        entityId: 'E1',
        entityName: 'Entity 1',
        description: '',
        allocatedAmount: 0,
        isAggregated: true,
      } as unknown as PreviewScreenRow,
      toast,
    );

    expect(axiosPostMock).toHaveBeenCalledTimes(1);
    const [url, body, options] = axiosPostMock.mock.calls[0];
    expect(url).toBe('https://cap.example.com/cap-events/investors/document');
    expect(options).toEqual(
      expect.objectContaining({
        responseType: 'blob',
        withCredentials: true,
      }),
    );
    expect(options.headers).toEqual(
      expect.objectContaining({
        Accept: 'application/octet-stream, application/json',
        'Content-Type': 'application/json',
        'Session-Id': '',
      }),
    );
    expect(body).toEqual(
      expect.objectContaining({
        capEvent: expect.any(Object),
        lineItem: expect.objectContaining({
          entity: expect.objectContaining({ id: 'E1' }),
          plInvestorEntries: [expect.objectContaining({ customerId: 'INV1' })],
        }),
      }),
    );
    expect(result).toBeInstanceOf(BlobCtor);
  });

  it('fetchDoc json error surfaces toast and returns undefined', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;

    processMock.mockResolvedValueOnce([
      { entity: { id: 'E1', name: 'Entity 1' }, plInvestorEntries: [{ customerId: 'INV1' }] },
    ]);
    parseMock.mockReturnValueOnce([]);
    await store.processPayload(toast);

    const errorBody = { text: async () => JSON.stringify({ message: 'Bad request' }) };
    axiosPostMock.mockResolvedValueOnce({
      data: errorBody,
      headers: { 'content-type': 'application/json' },
    });

    const result = await store.fetchDoc(
      {
        id: 'row1',
        investor: 'INV1-Name',
        investorId: 'INV1',
        entityId: 'E1',
        entityName: 'Entity 1',
        description: '',
        allocatedAmount: 0,
        isAggregated: true,
      } as unknown as PreviewScreenRow,
      toast,
    );

    expect(toast.error).toHaveBeenCalledWith('Bad request');
    expect(result).toBeUndefined();
  });

  describe('aggregated line items helpers', () => {
    it('getAggregatedLineItems returns all entries and preserves entity/dueDate', () => {
      const response = [
        {
          id: 'li-1',
          entity: { id: 'E1', name: 'Entity 1' },
          dueDate: '2025-11-24',
          plInvestorEntries: [
            { customerId: 'INV1', isAggregated: true, any: 1 },
            { customerId: 'INV2', isAggregated: false, any: 2 },
          ],
        },
        {
          id: 'li-2',
          entity: { id: 'E2', name: 'Entity 2' },
          dueDate: '2025-11-25',
          plInvestorEntries: [
            { customerId: 'INV3', isAggregated: true },
            { customerId: 'INV4', isAggregated: true },
          ],
        },
      ];
      (store as unknown as { lastProcessResponse: unknown[] }).lastProcessResponse = response;

      const aggregated = store.getAggregatedLineItems();
      expect(aggregated).toHaveLength(2);
      expect(aggregated[0]).toEqual(
        expect.objectContaining({
          id: 'li-1',
          entity: expect.objectContaining({ id: 'E1' }),
          dueDate: '2025-11-24',
          plInvestorEntries: expect.arrayContaining([
            expect.objectContaining({ customerId: 'INV1' }),
            expect.objectContaining({ customerId: 'INV2' }),
          ]),
        }),
      );
      expect(aggregated[0].plInvestorEntries).toHaveLength(2);

      expect(aggregated[1]).toEqual(
        expect.objectContaining({
          id: 'li-2',
          entity: expect.objectContaining({ id: 'E2' }),
          dueDate: '2025-11-25',
        }),
      );
      expect(aggregated[1].plInvestorEntries).toHaveLength(2);
    });

    it('withAggregatedLineItems merges aggregated items into payload only when present', () => {
      // with aggregated present
      (store as unknown as { lastProcessResponse: unknown[] }).lastProcessResponse = [
        {
          id: 'x',
          entity: { id: 'E1' },
          dueDate: '2025-11-24',
          plInvestorEntries: [{ isAggregated: true, customerId: 'INV1' }],
        },
      ];
      const basePayload = { id: 'payload-1' } as unknown as Parameters<
        PreviewScreenStore['withAggregatedLineItems']
      >[0];

      const merged = store.withAggregatedLineItems(basePayload) as unknown as Record<
        string,
        unknown
      >;
      expect(merged).toEqual(
        expect.objectContaining({
          id: 'payload-1',
          capEventAggregatedLineItems: expect.any(Array),
        }),
      );
      expect((merged.capEventAggregatedLineItems as unknown[]).length).toBe(1);

      // when aggregated are empty -> returns original payload
      (store as unknown as { lastProcessResponse: unknown[] }).lastProcessResponse = [];
      const unchanged = store.withAggregatedLineItems(basePayload) as unknown as Record<
        string,
        unknown
      >;
      expect(unchanged).toEqual(basePayload as unknown as Record<string, unknown>);
    });

    it('hasAggregatedLineItems reflects presence of aggregated rows', () => {
      (store as unknown as { rows: unknown[] }).rows = [];
      expect(store.hasAggregatedLineItems()).toBe(false);

      (store as unknown as { rows: unknown[] }).rows = [{ isAggregated: false }];
      expect(store.hasAggregatedLineItems()).toBe(false);

      (store as unknown as { rows: unknown[] }).rows = [{ isAggregated: true }];
      expect(store.hasAggregatedLineItems()).toBe(true);
    });
  });

  it('buildPayload returns payload when isDraft=true even without selected entities', () => {
    const prevEntities = mockCapEventSettingsStore.fundEntities;
    (mockCapEventSettingsStore as unknown as { fundEntities: unknown[] }).fundEntities = [];

    const payload = store.buildPayload(true);

    expect(payload).not.toBeNull();
    expect(payload?.status).toBe('DRAFT');
    expect(Array.isArray(payload?.entities)).toBe(true);
    expect((payload?.entities || []).length).toBe(0);
    expect(Array.isArray(payload?.capEventEntityLineItems)).toBe(true);
    expect((payload?.capEventEntityLineItems || []).length).toBe(0);

    (mockCapEventSettingsStore as unknown as { fundEntities: unknown[] }).fundEntities =
      prevEntities;
  });

  it('fetchDoc rejects non-aggregated selection with a toast error', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;
    (store as unknown as { lastProcessResponse: unknown[] }).lastProcessResponse = [
      { entity: { id: 'E1', name: 'Entity 1' }, plInvestorEntries: [{ customerId: 'INV1' }] },
    ];

    const result = await store.fetchDoc(
      {
        id: 'row1',
        investorId: 'INV1',
        entityId: 'E1',
        isAggregated: false,
      } as unknown as PreviewScreenRow,
      toast,
    );

    expect(toast.error).toHaveBeenCalledWith(
      'Please select an aggregated investor row to generate a document',
    );
    expect(result).toBeUndefined();
  });

  it('fetchDoc shows error when entity not found in last process response', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;
    (store as unknown as { lastProcessResponse: unknown[] }).lastProcessResponse = [
      { entity: { id: 'E2', name: 'Entity 2' }, plInvestorEntries: [{ customerId: 'INV1' }] },
    ];

    const result = await store.fetchDoc(
      {
        id: 'row1',
        investorId: 'INV1',
        entityId: 'E1',
        isAggregated: true,
      } as unknown as PreviewScreenRow,
      toast,
    );

    expect(toast.error).toHaveBeenCalledWith(
      'No processed data found for selected entity. Please re-run preview.',
    );
    expect(result).toBeUndefined();
  });

  it('fetchDoc shows error when no investor entry matches selected investorId', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;
    (store as unknown as { lastProcessResponse: unknown[] }).lastProcessResponse = [
      {
        entity: { id: 'E1', name: 'Entity 1' },
        plInvestorEntries: [{ customerId: 'INV-ZZ' }],
      },
    ];

    const result = await store.fetchDoc(
      {
        id: 'row1',
        investorId: 'INV1',
        entityId: 'E1',
        isAggregated: true,
      } as unknown as PreviewScreenRow,
      toast,
    );

    expect(toast.error).toHaveBeenCalledWith('No investor entries found for the selected investor');
    expect(result).toBeUndefined();
  });

  it('fetchDoc JSON parse failure shows generic error and returns undefined', async () => {
    const toast = { error: jest.fn() } as unknown as ToastApi;
    (store as unknown as { lastProcessResponse: unknown[] }).lastProcessResponse = [
      { entity: { id: 'E1', name: 'Entity 1' }, plInvestorEntries: [{ customerId: 'INV1' }] },
    ];

    const errorBody = {
      text: async () => {
        throw new Error('reader failed');
      },
    };
    axiosPostMock.mockResolvedValueOnce({
      data: errorBody,
      headers: { 'content-type': 'application/json' },
    });

    const result = await store.fetchDoc(
      {
        id: 'row1',
        investorId: 'INV1',
        entityId: 'E1',
        isAggregated: true,
      } as unknown as PreviewScreenRow,
      toast,
    );

    expect(toast.error).toHaveBeenCalledWith('Failed to generate investor document');
    expect(result).toBeUndefined();
  });
});
