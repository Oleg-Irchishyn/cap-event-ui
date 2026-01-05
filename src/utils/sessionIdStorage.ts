const SESSION_ID_STORAGE_KEY = 'cap-event-session-id';

/**
 * Gets the stored sessionId from sessionStorage, with fallback to URL
 * This ensures that when navigating to a page with a new sessionId in the URL,
 * the new sessionId is returned even if initializeSessionId hasn't completed yet.
 * @returns sessionId string or undefined if not found
 */
export const getStoredSessionId = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  try {
    // First check URL for sessionId (takes priority when navigating with new sessionId)
    const params = new URLSearchParams(window.location.search);
    const urlSessionId = params.get('sess') ?? params.get('sessionId') ?? undefined;
    if (urlSessionId) {
      // Update sessionStorage with the URL sessionId if it's different
      const storedSessionId = sessionStorage.getItem(SESSION_ID_STORAGE_KEY);
      if (storedSessionId !== urlSessionId) {
        sessionStorage.setItem(SESSION_ID_STORAGE_KEY, urlSessionId);
      }
      return urlSessionId;
    }

    // Fallback to sessionStorage
    return sessionStorage.getItem(SESSION_ID_STORAGE_KEY) ?? undefined;
  } catch {
    return undefined;
  }
};

/**
 * Stores sessionId in sessionStorage
 * @param sessionId - The sessionId to store
 */
export const setStoredSessionId = (sessionId: string): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.setItem(SESSION_ID_STORAGE_KEY, sessionId);
  } catch (error) {
    console.error('Failed to store sessionId:', error);
  }
};

/**
 * Removes the stored sessionId from sessionStorage
 */
export const clearStoredSessionId = (): void => {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    sessionStorage.removeItem(SESSION_ID_STORAGE_KEY);
  } catch (error) {
    console.error('Failed to clear sessionId:', error);
  }
};

/**
 * Initializes sessionId with the following priority:
 * 1. From URL query parameters (if present)
 * 2. From sessionStorage (if already stored)
 *
 * Should be called once when the app first loads
 * @returns Promise that resolves to the sessionId if found, undefined otherwise
 */
export const initializeSessionId = async (): Promise<string | undefined> => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  const params = new URLSearchParams(window.location.search);
  const urlSessionId = params.get('sess') ?? params.get('sessionId') ?? undefined;
  if (urlSessionId) {
    setStoredSessionId(urlSessionId);
    return urlSessionId;
  }

  const storedSessionId = getStoredSessionId();
  if (storedSessionId) {
    return storedSessionId;
  }
};
