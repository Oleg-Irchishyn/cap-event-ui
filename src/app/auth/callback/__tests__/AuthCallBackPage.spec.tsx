import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import AuthCallbackPage from '../page';
import { ROUTES } from '@/const/routes';

const mockPush = jest.fn();
const mockGet = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
  useSearchParams: () => ({
    get: mockGet,
  }),
}));

jest.mock('@/utils/oneloginAuth', () => ({
  getOneLoginConfig: jest.fn(() => ({ clientId: 'test-client-id' })),
  exchangeCodeForToken: jest.fn(),
}));

jest.mock('@/utils/tokenStorage', () => ({
  storeToken: jest.fn(),
  clearTokens: jest.fn(),
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AuthCallbackPage', () => {
  const { exchangeCodeForToken } = require('@/utils/oneloginAuth');
  const { storeToken, clearTokens } = require('@/utils/tokenStorage');

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
    Object.defineProperty(window, 'sessionStorage', {
      value: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
        clear: jest.fn(),
      },
      writable: true,
    });
  });

  it('renders loading message while processing authentication', () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'code') return 'auth-code';
      if (key === 'state') return 'state-value';
      return null;
    });
    (window.sessionStorage.getItem as jest.Mock).mockReturnValue('state-value');
    exchangeCodeForToken.mockResolvedValue({
      access_token: 'token',
      expires_in: 3600,
      refresh_token: 'refresh',
      id_token: 'id-token',
    });

    renderWithTheme(<AuthCallbackPage />);

    expect(screen.getByText('Completing authentication...')).toBeInTheDocument();
  });

  it('redirects to main page on successful authentication', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'code') return 'auth-code';
      if (key === 'state') return 'state-value';
      return null;
    });
    (window.sessionStorage.getItem as jest.Mock).mockReturnValue('state-value');
    exchangeCodeForToken.mockResolvedValue({
      access_token: 'token',
      expires_in: 3600,
      refresh_token: 'refresh',
      id_token: 'id-token',
    });

    renderWithTheme(<AuthCallbackPage />);

    await waitFor(() => {
      expect(storeToken).toHaveBeenCalledWith('token', 3600, 'refresh', 'id-token');
      expect(mockPush).toHaveBeenCalledWith(ROUTES.MAIN.path);
    });
  });

  it('displays error and shows try again button when error parameter is present', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'error') return 'access_denied';
      return null;
    });

    renderWithTheme(<AuthCallbackPage />);

    await waitFor(() => {
      expect(screen.getByText('Authentication failed: access_denied')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
      expect(clearTokens).toHaveBeenCalled();
    });
  });

  it('displays error when state parameter does not match sessionStorage', async () => {
    mockGet.mockImplementation((key: string) => {
      if (key === 'code') return 'auth-code';
      if (key === 'state') return 'wrong-state';
      return null;
    });
    (window.sessionStorage.getItem as jest.Mock).mockReturnValue('correct-state');

    renderWithTheme(<AuthCallbackPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Invalid state parameter. Please try logging in again.'),
      ).toBeInTheDocument();
      expect(clearTokens).toHaveBeenCalled();
    });
  });

  it('displays error and clears tokens when token exchange fails', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockGet.mockImplementation((key: string) => {
      if (key === 'code') return 'auth-code';
      if (key === 'state') return 'state-value';
      return null;
    });
    (window.sessionStorage.getItem as jest.Mock).mockReturnValue('state-value');
    exchangeCodeForToken.mockRejectedValue(new Error('Token exchange failed'));

    renderWithTheme(<AuthCallbackPage />);

    await waitFor(() => {
      expect(screen.getByText('Token exchange failed')).toBeInTheDocument();
      expect(clearTokens).toHaveBeenCalled();
      expect(consoleErrorSpy).toHaveBeenCalled();
    });

    consoleErrorSpy.mockRestore();
  });
});
