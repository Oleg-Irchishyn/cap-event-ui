/**
 * Token Storage Utility
 *
 * Manages storage and retrieval of bearer tokens from OneLogin authentication.
 * Uses sessionStorage for security (tokens are cleared when browser session ends).
 */

const TOKEN_KEY = 'onelogin_access_token';
const REFRESH_TOKEN_KEY = 'onelogin_refresh_token';
const TOKEN_EXPIRY_KEY = 'onelogin_token_expiry';
const ID_TOKEN_KEY = 'onelogin_id_token';

/**
 * Stores the access token and optional refresh token and ID token
 * Validates input before storing to prevent storing invalid tokens
 */
export const storeToken = (
  accessToken: string,
  expiresIn: number,
  refreshToken?: string,
  idToken?: string,
): void => {
  if (typeof window === 'undefined') {
    return;
  }

  // Validate access token
  if (!accessToken || accessToken.trim().length === 0) {
    console.error('Invalid access token provided to storeToken');
    throw new Error('Cannot store invalid access token');
  }

  // Validate expiresIn
  if (!expiresIn || expiresIn <= 0) {
    console.error('Invalid expiresIn provided to storeToken:', expiresIn);
    throw new Error('Cannot store token with invalid expiration time');
  }

  const expiresAt = Date.now() + expiresIn * 1000; // Convert seconds to milliseconds

  try {
    sessionStorage.setItem(TOKEN_KEY, accessToken);
    sessionStorage.setItem(TOKEN_EXPIRY_KEY, expiresAt.toString());

    if (refreshToken) {
      if (refreshToken.trim().length === 0) {
        console.warn('Invalid refresh token provided, skipping storage');
      } else {
        sessionStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
      }
    }

    if (idToken) {
      if (idToken.trim().length === 0) {
        console.warn('Invalid ID token provided, skipping storage');
      } else {
        sessionStorage.setItem(ID_TOKEN_KEY, idToken);
      }
    }
  } catch (storageError) {
    console.error('Failed to store token in sessionStorage:', storageError);
    throw new Error('Failed to store authentication token');
  }
};

/**
 * Retrieves the stored access token
 */
export const getStoredToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return sessionStorage.getItem(TOKEN_KEY);
};

/**
 * Retrieves the stored refresh token
 */
export const getStoredRefreshToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return sessionStorage.getItem(REFRESH_TOKEN_KEY);
};

/**
 * Checks if the current token is expired or will expire soon (within 5 minutes)
 */
export const isTokenExpired = (): boolean => {
  if (typeof window === 'undefined') {
    return true;
  }

  const expiryStr = sessionStorage.getItem(TOKEN_EXPIRY_KEY);
  if (!expiryStr) {
    return true;
  }

  const expiresAt = parseInt(expiryStr, 10);
  const bufferTime = 5 * 60 * 1000; // 5 minutes in milliseconds
  return Date.now() >= expiresAt - bufferTime;
};

/**
 * Gets a valid token, checking expiry
 */
export const getValidToken = (): string | null => {
  const token = getStoredToken();
  if (!token || isTokenExpired()) {
    return null;
  }
  return token;
};

/**
 * Retrieves the stored ID token
 */
export const getStoredIdToken = (): string | null => {
  if (typeof window === 'undefined') {
    return null;
  }

  return sessionStorage.getItem(ID_TOKEN_KEY);
};

/**
 * Clears all stored tokens
 */
export const clearTokens = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  sessionStorage.removeItem(TOKEN_KEY);
  sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  sessionStorage.removeItem(TOKEN_EXPIRY_KEY);
  sessionStorage.removeItem(ID_TOKEN_KEY);
};

/**
 * Checks if user is authenticated (has a valid token)
 */
export const isAuthenticated = (): boolean => {
  return getValidToken() !== null;
};
