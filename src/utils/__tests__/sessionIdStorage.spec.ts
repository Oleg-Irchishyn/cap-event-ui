import {
  getStoredSessionId,
  setStoredSessionId,
  clearStoredSessionId,
  initializeSessionId,
} from '../sessionIdStorage';

describe('sessionIdStorage', () => {
  const SESSION_ID_STORAGE_KEY = 'cap-event-session-id';
  const mockSessionId = 'test-session-id-123';

  beforeEach(() => {
    // Clear sessionStorage before each test
    sessionStorage.clear();
    jest.clearAllMocks();
  });

  describe('getStoredSessionId', () => {
    it('should return stored sessionId when it exists in sessionStorage', () => {
      sessionStorage.setItem(SESSION_ID_STORAGE_KEY, mockSessionId);
      expect(getStoredSessionId()).toBe(mockSessionId);
    });

    it('should return undefined when sessionId is not found', () => {
      expect(getStoredSessionId()).toBeUndefined();
    });
  });

  describe('setStoredSessionId', () => {
    it('should store sessionId in sessionStorage successfully', () => {
      setStoredSessionId(mockSessionId);
      expect(sessionStorage.getItem(SESSION_ID_STORAGE_KEY)).toBe(mockSessionId);
    });
  });

  describe('clearStoredSessionId', () => {
    it('should remove sessionId from sessionStorage successfully', () => {
      sessionStorage.setItem(SESSION_ID_STORAGE_KEY, mockSessionId);
      clearStoredSessionId();
      expect(sessionStorage.getItem(SESSION_ID_STORAGE_KEY)).toBeNull();
    });
  });

  describe('initializeSessionId', () => {
    it('should use stored sessionId when URL is empty', async () => {
      sessionStorage.setItem(SESSION_ID_STORAGE_KEY, mockSessionId);
      window.location.search = '';
      const result = await initializeSessionId();

      expect(result).toBe(mockSessionId);
    });
  });
});
