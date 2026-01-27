import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import LoginPage from '../page';
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

jest.mock('@/utils/tokenStorage', () => ({
  getAccessTokenWithRefresh: jest.fn(),
}));

jest.mock('@/utils/oneloginAuth', () => ({
  getOneLoginConfig: jest.fn(() => ({ clientId: 'test-client-id' })),
  getOneLoginAuthUrl: jest.fn(() => Promise.resolve('https://onelogin.example.com/auth')),
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('LoginPage', () => {
  const { getAccessTokenWithRefresh } = require('@/utils/tokenStorage');
  const { getOneLoginAuthUrl } = require('@/utils/oneloginAuth');

  beforeEach(() => {
    jest.clearAllMocks();
    mockGet.mockReturnValue(null);
  });

  it('renders loader component', () => {
    getAccessTokenWithRefresh.mockResolvedValue(null);

    const { container } = renderWithTheme(<LoginPage />);

    const loaderContainer = container.querySelector('div');
    expect(loaderContainer).toBeInTheDocument();
    expect(loaderContainer).toHaveStyle({
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      flexDirection: 'column',
      gap: '1rem',
    });
  });

  it('redirects to main page when token exists', async () => {
    getAccessTokenWithRefresh.mockResolvedValue('valid-token');

    renderWithTheme(<LoginPage />);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(ROUTES.MAIN.path);
    });
  });

  it('redirects to OneLogin when no token exists', async () => {
    getAccessTokenWithRefresh.mockResolvedValue(null);

    renderWithTheme(<LoginPage />);

    await waitFor(() => {
      expect(getOneLoginAuthUrl).toHaveBeenCalledWith({ clientId: 'test-client-id' }, false);
      expect(getOneLoginAuthUrl).toHaveBeenCalledTimes(1);
    });
  });

  it('passes prompt_login=true to OneLogin when query param is present', async () => {
    getAccessTokenWithRefresh.mockResolvedValue(null);
    mockGet.mockImplementation((key: string) => {
      if (key === 'prompt_login') return 'true';
      return null;
    });

    renderWithTheme(<LoginPage />);

    await waitFor(() => {
      expect(getOneLoginAuthUrl).toHaveBeenCalledWith({ clientId: 'test-client-id' }, true);
    });
  });

  it('handles OneLogin authentication errors gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    getAccessTokenWithRefresh.mockResolvedValue(null);
    getOneLoginAuthUrl.mockRejectedValue(new Error('OneLogin error'));

    renderWithTheme(<LoginPage />);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        'Failed to initiate OneLogin authentication:',
        expect.any(Error),
      );
    });

    consoleErrorSpy.mockRestore();
  });
});
