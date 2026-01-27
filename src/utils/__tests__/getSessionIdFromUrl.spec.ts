import { getSessionIdFromUrl } from '../getSessionIdFromUrl';
import { getStoredSessionId } from '../sessionIdStorage';

jest.mock('../sessionIdStorage', () => ({
  getStoredSessionId: jest.fn(),
}));

describe('getSessionIdFromUrl', () => {
  const mockGetStoredSessionId = getStoredSessionId as jest.MockedFunction<
    typeof getStoredSessionId
  >;

  beforeEach(() => {
    jest.clearAllMocks();
    mockGetStoredSessionId.mockReturnValue(undefined);
  });

  it('returns stored sessionId when available', () => {
    mockGetStoredSessionId.mockReturnValue('stored-session-id');

    const result = getSessionIdFromUrl();

    expect(result).toBe('stored-session-id');
  });

  it('returns undefined when no sessionId is found', () => {
    mockGetStoredSessionId.mockReturnValue(undefined);

    const result = getSessionIdFromUrl();

    expect(result).toBeUndefined();
  });

  it('calls getStoredSessionId', () => {
    mockGetStoredSessionId.mockReturnValue(undefined);

    getSessionIdFromUrl();

    expect(mockGetStoredSessionId).toHaveBeenCalledTimes(1);
  });
});
