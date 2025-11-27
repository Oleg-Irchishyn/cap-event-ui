import {
  getStoredSessionId,
  setStoredSessionId,
  clearStoredSessionId,
  fetchSessionIdFromEndpoint,
  initializeSessionId,
} from '../sessionIdStorage';
import { _ReferenceDataServer } from '@/api';

// Mock the API
jest.mock('@/api', () => ({
  _ReferenceDataServer: {
    get: jest.fn(),
  },
}));

const mockGet = _ReferenceDataServer.get as jest.Mock;

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

  describe('fetchSessionIdFromEndpoint', () => {
    it('should fetch sessionId from endpoint and store it successfully', async () => {
      const fetchedSessionId = 'fetched-session-id-456';
      mockGet.mockResolvedValue({ data: fetchedSessionId });

      const result = await fetchSessionIdFromEndpoint();

      expect(result).toBe(fetchedSessionId);
      expect(sessionStorage.getItem(SESSION_ID_STORAGE_KEY)).toBe(fetchedSessionId);
      expect(mockGet).toHaveBeenCalledWith('/session', { params: undefined });
    });

    it('should handle API errors gracefully and return undefined', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockGet.mockRejectedValue(new Error('Network error'));

      const result = await fetchSessionIdFromEndpoint();

      expect(result).toBeUndefined();
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to fetch sessionId from endpoint:',
        expect.any(Error),
      );
      consoleErrorSpy.mockRestore();
    });
  });

  describe('initializeSessionId', () => {
    it('should use stored sessionId when URL is empty', async () => {
      sessionStorage.setItem(SESSION_ID_STORAGE_KEY, mockSessionId);
      window.location.search = '';
      const result = await initializeSessionId();

      expect(result).toBe(mockSessionId);
      expect(mockGet).not.toHaveBeenCalled();
    });

    it('should fetch from endpoint when neither URL nor storage has sessionId', async () => {
      window.location.search = '';
      const fetchedSessionId = 'endpoint-session-id-456';
      mockGet.mockResolvedValue({ data: fetchedSessionId });

      const result = await initializeSessionId();

      expect(result).toBe(fetchedSessionId);
      expect(sessionStorage.getItem(SESSION_ID_STORAGE_KEY)).toBe(fetchedSessionId);
      expect(mockGet).toHaveBeenCalledWith('/session', { params: undefined });
    });
  });
});
