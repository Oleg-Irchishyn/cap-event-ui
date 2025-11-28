import { _ReferenceDataServer } from '@/api';

const SESSION_ID_STORAGE_KEY = 'cap-event-session-id';
let fetchPromise: Promise<string | undefined> | null = null;

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
 * Fetches sessionId from the /session endpoint and stores it
 * @param existingSessionId - Optional existing sessionId to pass as parameter
 * @returns The fetched sessionId or undefined if failed
 */
export const fetchSessionIdFromEndpoint = async (
  existingSessionId?: string,
): Promise<string | undefined> => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  // Prevent multiple concurrent requests
  if (fetchPromise) {
    return fetchPromise;
  }

  fetchPromise = (async () => {
    try {
      const response = await _ReferenceDataServer.get('/session', {
        params: existingSessionId ? { id: existingSessionId } : undefined,
      });
      const sessionId = response.data;
      if (sessionId) {
        setStoredSessionId(sessionId);
      }
      return sessionId || undefined;
    } catch (error) {
      console.error('Failed to fetch sessionId from endpoint:', error);
      return undefined;
    } finally {
      fetchPromise = null;
    }
  })();

  return fetchPromise;
};

/**
 * Initializes sessionId with the following priority:
 * 1. From URL query parameters (if present)
 * 2. From sessionStorage (if already stored)
 * 3. From /session endpoint (if neither URL nor storage has it)
 *
 * Should be called once when the app first loads
 * @returns Promise that resolves to the sessionId if found, undefined otherwise
 */
export const initializeSessionId = async (): Promise<string | undefined> => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  // 1. Check URL first
  const params = new URLSearchParams(window.location.search);
  const urlSessionId = params.get('sess') ?? params.get('sessionId') ?? undefined;
  if (urlSessionId) {
    setStoredSessionId(urlSessionId);
    return urlSessionId;
  }

  // 2. Check sessionStorage
  const storedSessionId = getStoredSessionId();
  if (storedSessionId) {
    return storedSessionId;
  }

  // 3. Fetch from endpoint
  return fetchSessionIdFromEndpoint();
};
