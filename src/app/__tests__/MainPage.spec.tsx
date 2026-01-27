import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import Page from '../page';
import { ROUTES } from '@/const/routes';
import { ApiError } from '@/clients/CapEventPackage';
import type { ApiResult } from '@/clients/CapEventPackage/core/ApiResult';

const mockPush = jest.fn();
const mockError = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({
    error: mockError,
  }),
}));

jest.mock('@/utils/sessionIdStorage', () => ({
  getStoredSessionId: jest.fn(() => 'test-session-id'),
}));

jest.mock('@/utils/logout', () => ({
  logout: jest.fn(),
}));

jest.mock('@/api', () => ({
  CapEventPackageApi: {
    default: {
      getCapEventList: jest.fn(),
    },
  },
}));

jest.mock('@/stores', () => {
  const { ITEM_STATES } = require('@/const/common');
  return {
    capEventSettingsStore: {
      sponsors: [{ id: 'sponsor-1', state: ITEM_STATES.SELECTED }],
    },
  };
});

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Page', () => {
  const { getCapEventList } = require('@/api').CapEventPackageApi.default;
  const { logout } = require('@/utils/logout');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders page title and buttons', async () => {
    getCapEventList.mockResolvedValue([]);

    renderWithTheme(<Page />);

    expect(screen.getByText('Capital Event')).toBeInTheDocument();
    expect(screen.getByText('Logout')).toBeInTheDocument();
    expect(screen.getByText('New Capital Event')).toBeInTheDocument();
  });

  it('navigates to new cap event page when button is clicked', async () => {
    getCapEventList.mockResolvedValue([]);

    renderWithTheme(<Page />);

    const newEventButton = screen.getByTestId('new-capital-event');
    fireEvent.click(newEventButton);

    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith(ROUTES.NEW_CAP_EVENT.path);
    });
  });

  it('fetches and displays cap events on mount', async () => {
    const mockEvents = [
      { id: '1', name: 'Event 1' },
      { id: '2', name: 'Event 2' },
    ];
    getCapEventList.mockResolvedValue(mockEvents);

    renderWithTheme(<Page />);

    await waitFor(() => {
      expect(getCapEventList).toHaveBeenCalledWith('sponsor-1', undefined, 'test-session-id');
    });
  });

  it('handles API errors and shows toast message', async () => {
    const apiResult: ApiResult = {
      url: '/api/events',
      status: 500,
      statusText: 'Internal Server Error',
      body: {} as Record<string, unknown>,
      ok: false,
    };
    const apiError = new ApiError({ method: 'GET', url: '/api/events' }, apiResult, 'API Error');
    getCapEventList.mockRejectedValue(apiError);

    renderWithTheme(<Page />);

    await waitFor(() => {
      expect(mockError).toHaveBeenCalledWith('API Error');
    });
  });

  it('calls logout when logout button is clicked', async () => {
    getCapEventList.mockResolvedValue([]);

    renderWithTheme(<Page />);

    const logoutButton = screen.getByTestId('logout');
    fireEvent.click(logoutButton);

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
    });
  });
});
