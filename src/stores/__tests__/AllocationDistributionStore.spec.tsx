import axios from 'axios';

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

jest.mock('@/utils/parseToDistributionRows', () => ({
  parseToDistributionRows: (...args: unknown[]) => parseMock(...args),
}));

describe('AllocationDistributionStore', () => {
  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    axiosGetMock.mockReset();
    (axios as unknown as { get: jest.Mock }).get = axiosGetMock as unknown as jest.Mock;
  });

  const importStore = async () => {
    const mod = await import('@/stores/AllocationDistributionStore');
    return mod.allocationDistributionStore;
  };

  it('processPayload handles invalid JSON with toast and no API call', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() };

    const result = await store.processPayload('not-json', toast);

    expect(toast.error).toHaveBeenCalledWith('Invalid JSON');
    expect(processMock).not.toHaveBeenCalled();
    expect(parseMock).not.toHaveBeenCalled();
    expect(result).toEqual([]);
    expect(store.rows).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('processPayload success: calls API with parsed payload and updates rows', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() };
    processMock.mockResolvedValueOnce([{ any: 'response' }]);
    parseMock.mockReturnValueOnce([{ id: 'r1' }, { id: 'r2' }]);

    const result = await store.processPayload('{"a":1}', toast);

    expect(processMock).toHaveBeenCalledWith({ a: 1 });
    expect(parseMock).toHaveBeenCalled();
    expect(result).toEqual([{ id: 'r1' }, { id: 'r2' }]);
    expect(store.rows).toEqual([{ id: 'r1' }, { id: 'r2' }]);
    expect(store.isLoading).toBe(false);
  });

  it('processPayload API error shows toast and clears rows', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() };
    processMock.mockRejectedValueOnce(new Error('Boom'));

    const result = await store.processPayload('{"a":1}', toast);

    expect(toast.error).toHaveBeenCalledWith('Boom');
    expect(result).toEqual([]);
    expect(store.rows).toEqual([]);
    expect(store.isLoading).toBe(false);
  });

  it('fetchDoc success returns blob and uses BoxConnectorApi config', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() };
    const blob = new Blob(['abc'], { type: 'text/plain' });
    axiosGetMock.mockResolvedValueOnce({ data: blob });

    const result = await store.fetchDoc('file-123', toast);

    expect(axiosGetMock).toHaveBeenCalledWith('https://api.example.com/files/file-123/content', {
      responseType: 'blob',
      headers: { Accept: 'application/octet-stream' },
      withCredentials: true,
    });
    expect(result).toBeInstanceOf(Blob);
  });

  it('fetchDoc error shows toast and returns undefined', async () => {
    const store = await importStore();
    const toast = { error: jest.fn() };
    axiosGetMock.mockRejectedValueOnce(new Error('Oops'));

    const result = await store.fetchDoc('file-123', toast);

    expect(toast.error).toHaveBeenCalledWith('Failed to fetch Box file content');
    expect(result).toBeUndefined();
  });
});
