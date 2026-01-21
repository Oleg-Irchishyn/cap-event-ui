import {
  storeToken,
  getStoredToken,
  getStoredRefreshToken,
  getStoredIdToken,
  isTokenExpired,
  getValidToken,
  clearTokens,
  getAccessTokenWithRefresh,
} from '../tokenStorage';
import { refreshAccessToken } from '../oneloginAuth';

jest.mock('../oneloginAuth', () => ({
  getOneLoginConfig: jest.fn(() => ({
    clientId: 'client-id',
    subdomain: 'subdomain',
    redirectUri: 'http://localhost/callback',
    scope: 'openid profile email',
    resource: 'resource',
    region: 'us',
  })),
  refreshAccessToken: jest.fn(),
}));

describe('tokenStorage', () => {
  const mockAccessToken = 'test-access-token-123';
  const mockRefreshToken = 'test-refresh-token-456';
  const mockIdToken = 'test-id-token-789';
  const expiresIn = 3600;
  const mockedRefresh = refreshAccessToken as jest.Mock;

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  it('should store and retrieve access token, refresh token, and ID token successfully', () => {
    storeToken(mockAccessToken, expiresIn, mockRefreshToken, mockIdToken);

    expect(getStoredToken()).toBe(mockAccessToken);
    expect(getStoredRefreshToken()).toBe(mockRefreshToken);
    expect(getStoredIdToken()).toBe(mockIdToken);
  });

  it('should throw error when storing invalid token or expiration time', () => {
    expect(() => {
      storeToken('', expiresIn);
    }).toThrow('Cannot store invalid access token');

    expect(() => {
      storeToken('   ', expiresIn);
    }).toThrow('Cannot store invalid access token');

    expect(() => {
      storeToken(mockAccessToken, 0);
    }).toThrow('Cannot store token with invalid expiration time');

    expect(() => {
      storeToken(mockAccessToken, -100);
    }).toThrow('Cannot store token with invalid expiration time');
  });

  it('should correctly identify expired tokens and return null for expired tokens', () => {
    // Store a token that expires in 1 second
    storeToken(mockAccessToken, 1);

    // Wait for token to expire
    jest.useFakeTimers();
    jest.advanceTimersByTime(6 * 60 * 1000); // Advance 6 minutes (past 5 min buffer)

    expect(isTokenExpired()).toBe(true);
    expect(getValidToken()).toBeNull();
    jest.useRealTimers();
  });

  it('should return valid token when token is not expired', () => {
    storeToken(mockAccessToken, expiresIn);

    expect(isTokenExpired()).toBe(false);
    expect(getValidToken()).toBe(mockAccessToken);
  });

  it('should clear all stored tokens successfully', () => {
    storeToken(mockAccessToken, expiresIn, mockRefreshToken, mockIdToken);

    clearTokens();

    expect(getStoredToken()).toBeNull();
    expect(getStoredRefreshToken()).toBeNull();
    expect(getStoredIdToken()).toBeNull();
  });

  it('getAccessTokenWithRefresh should return existing valid token without refreshing', async () => {
    storeToken(mockAccessToken, expiresIn, mockRefreshToken, mockIdToken);

    const token = await getAccessTokenWithRefresh();

    expect(token).toBe(mockAccessToken);
    expect(mockedRefresh).not.toHaveBeenCalled();
  });

  it('getAccessTokenWithRefresh should refresh when token is expired and store new tokens', async () => {
    // Store expiring token
    const realNow = Date.now();
    storeToken(mockAccessToken, 1, mockRefreshToken, mockIdToken);
    jest.spyOn(Date, 'now').mockImplementation(() => realNow + 6 * 60 * 1000);

    mockedRefresh.mockResolvedValue({
      access_token: 'new-access',
      expires_in: 7200,
      refresh_token: 'new-refresh',
      id_token: 'new-id',
      token_type: 'Bearer',
    });

    const token = await getAccessTokenWithRefresh();

    expect(token).toBe('new-access');
    expect(mockedRefresh).toHaveBeenCalledTimes(1);
    expect(getStoredToken()).toBe('new-access');
    expect(getStoredRefreshToken()).toBe('new-refresh');
    expect(getStoredIdToken()).toBe('new-id');
    jest.restoreAllMocks();
  });

  it('getAccessTokenWithRefresh should clear tokens and return null on refresh failure', async () => {
    const realNow = Date.now();
    storeToken(mockAccessToken, 1, mockRefreshToken, mockIdToken);
    jest.spyOn(Date, 'now').mockImplementation(() => realNow + 6 * 60 * 1000);
    mockedRefresh.mockRejectedValue(new Error('refresh failed'));

    const token = await getAccessTokenWithRefresh();

    expect(token).toBeNull();
    expect(getStoredToken()).toBeNull();
    expect(getStoredRefreshToken()).toBeNull();
    expect(getStoredIdToken()).toBeNull();
    jest.restoreAllMocks();
  });

  it('getAccessTokenWithRefresh should reuse in-flight refresh requests', async () => {
    const realNow = Date.now();
    storeToken(mockAccessToken, 1, mockRefreshToken, mockIdToken);
    jest.spyOn(Date, 'now').mockImplementation(() => realNow + 6 * 60 * 1000);

    mockedRefresh.mockResolvedValue({
      access_token: 'shared-token',
      expires_in: 7200,
      refresh_token: 'shared-refresh',
      id_token: 'shared-id',
      token_type: 'Bearer',
    });

    const [t1, t2] = await Promise.all([getAccessTokenWithRefresh(), getAccessTokenWithRefresh()]);

    expect(t1).toBe('shared-token');
    expect(t2).toBe('shared-token');
    expect(mockedRefresh).toHaveBeenCalledTimes(1);
    jest.restoreAllMocks();
  });
});
