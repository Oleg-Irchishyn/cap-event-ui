import {
  storeToken,
  getStoredToken,
  getStoredRefreshToken,
  getStoredIdToken,
  isTokenExpired,
  getValidToken,
  clearTokens,
  isAuthenticated,
} from '../tokenStorage';

describe('tokenStorage', () => {
  const mockAccessToken = 'test-access-token-123';
  const mockRefreshToken = 'test-refresh-token-456';
  const mockIdToken = 'test-id-token-789';
  const expiresIn = 3600;

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
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
    expect(isAuthenticated()).toBe(false);

    jest.useRealTimers();
  });

  it('should return valid token when token is not expired', () => {
    storeToken(mockAccessToken, expiresIn);

    expect(isTokenExpired()).toBe(false);
    expect(getValidToken()).toBe(mockAccessToken);
    expect(isAuthenticated()).toBe(true);
  });

  it('should clear all stored tokens successfully', () => {
    storeToken(mockAccessToken, expiresIn, mockRefreshToken, mockIdToken);

    clearTokens();

    expect(getStoredToken()).toBeNull();
    expect(getStoredRefreshToken()).toBeNull();
    expect(getStoredIdToken()).toBeNull();
    expect(isAuthenticated()).toBe(false);
  });
});
