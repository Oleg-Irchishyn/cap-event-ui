import { logout } from '../logout';
import { clearTokens, getStoredIdToken } from '../tokenStorage';
import { clearStoredSessionId } from '../sessionIdStorage';
import { getOneLoginConfig } from '../oneloginAuth';

jest.mock('../tokenStorage', () => ({
  clearTokens: jest.fn(),
  getStoredIdToken: jest.fn(),
}));

jest.mock('../sessionIdStorage', () => ({
  clearStoredSessionId: jest.fn(),
}));

jest.mock('../oneloginAuth', () => ({
  getOneLoginConfig: jest.fn(),
}));

describe('logout', () => {
  const mockGetStoredIdToken = getStoredIdToken as jest.MockedFunction<typeof getStoredIdToken>;
  const mockClearTokens = clearTokens as jest.MockedFunction<typeof clearTokens>;
  const mockClearStoredSessionId = clearStoredSessionId as jest.MockedFunction<
    typeof clearStoredSessionId
  >;
  const mockGetOneLoginConfig = getOneLoginConfig as jest.MockedFunction<typeof getOneLoginConfig>;

  const originalConsoleError = console.error;

  beforeEach(() => {
    jest.clearAllMocks();
    console.error = jest.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  it('clears tokens and sessionId', async () => {
    mockGetStoredIdToken.mockReturnValue(null);
    mockGetOneLoginConfig.mockReturnValue({
      clientId: 'test-client-id',
      subdomain: 'test',
      redirectUri: 'http://localhost/callback',
      scope: 'openid profile email',
      resource: 'resource',
      region: 'us',
    });

    await logout();

    expect(mockClearTokens).toHaveBeenCalledTimes(1);
    expect(mockClearStoredSessionId).toHaveBeenCalledTimes(1);
  });

  it('calls getOneLoginConfig', async () => {
    mockGetStoredIdToken.mockReturnValue(null);
    mockGetOneLoginConfig.mockReturnValue({
      clientId: 'test-client-id',
      subdomain: 'test',
      redirectUri: 'http://localhost/callback',
      scope: 'openid profile email',
      resource: 'resource',
      region: 'us',
    });

    await logout();

    expect(mockGetOneLoginConfig).toHaveBeenCalledTimes(1);
  });

  it('handles error when config fails', async () => {
    mockGetStoredIdToken.mockReturnValue(null);
    mockGetOneLoginConfig.mockImplementation(() => {
      throw new Error('Config error');
    });

    await logout();

    expect(console.error).toHaveBeenCalled();
  });
});
