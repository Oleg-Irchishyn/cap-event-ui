import { getStoredSessionId } from './sessionIdStorage';

/**
 * Gets sessionId synchronously with the following priority:
 * 1. Stored sessionId from sessionStorage (persists across navigation)
 * 2. sessionId from URL query parameters (for initial load)
 *
 * Note: This does NOT fetch from endpoint. Use initializeSessionId() for that.
 * This ensures sessionId persists even after navigation removes it from URL
 * @returns sessionId string or undefined if not found
 */
export const getSessionIdFromUrl = (): string | undefined => {
  if (typeof window === 'undefined') {
    return undefined;
  }

  // First check stored sessionId (persists across navigation)
  const storedSessionId = getStoredSessionId();
  if (storedSessionId) {
    return storedSessionId;
  }

  // Fallback to URL (for initial load)
  const params = new URLSearchParams(window.location.search);
  return params.get('sess') ?? params.get('sessionId') ?? undefined;
};
