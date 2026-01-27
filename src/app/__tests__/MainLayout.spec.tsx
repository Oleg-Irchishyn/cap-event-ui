import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RootLayout from '../layout';
import { ROUTES } from '@/const/routes';

const mockPush = jest.fn();
const mockPathname = jest.fn(() => '/');

jest.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/utils/sessionIdStorage', () => ({
  initializeSessionId: jest.fn(),
}));

jest.mock('@/utils/tokenStorage', () => ({
  getAccessTokenWithRefresh: jest.fn(),
}));

jest.mock('@/lib/registry', () => {
  return function StyledComponentsRegistry({ children }: { children: React.ReactNode }) {
    return <>{children}</>;
  };
});

const renderLayout = (children: React.ReactNode) => {
  return render(<RootLayout>{children}</RootLayout>);
};

describe('RootLayout', () => {
  const { getAccessTokenWithRefresh } = require('@/utils/tokenStorage');
  const { initializeSessionId } = require('@/utils/sessionIdStorage');

  beforeEach(() => {
    jest.clearAllMocks();
    mockPathname.mockReturnValue('/');
  });

  it('initializes sessionId on mount', async () => {
    getAccessTokenWithRefresh.mockResolvedValue('valid-token');

    renderLayout(<div>Test Content</div>);

    await waitFor(() => {
      expect(initializeSessionId).toHaveBeenCalledTimes(1);
    });
  });

  it('renders children for authenticated users on protected routes', async () => {
    getAccessTokenWithRefresh.mockResolvedValue('valid-token');

    renderLayout(<div>Test Content</div>);

    await waitFor(() => {
      expect(screen.getByText('Test Content')).toBeInTheDocument();
    });
  });

  it('redirects to login when user is not authenticated on protected routes', async () => {
    getAccessTokenWithRefresh.mockResolvedValue(null);

    renderLayout(<div>Test Content</div>);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(ROUTES.LOGIN.path);
    });
  });

  it('renders children for public routes without authentication check', async () => {
    mockPathname.mockReturnValue('/login');
    getAccessTokenWithRefresh.mockResolvedValue(null);

    renderLayout(<div>Login Page</div>);

    await waitFor(() => {
      expect(screen.getByText('Login Page')).toBeInTheDocument();
      expect(getAccessTokenWithRefresh).not.toHaveBeenCalled();
    });
  });

  it('shows loader while checking authentication', () => {
    getAccessTokenWithRefresh.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve('token'), 100)),
    );

    renderLayout(<div>Test Content</div>);

    expect(screen.queryByText('Test Content')).not.toBeInTheDocument();
  });
});
