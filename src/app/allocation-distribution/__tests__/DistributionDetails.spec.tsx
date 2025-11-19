import { render, screen, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DistributionDetails from '@/app/allocation-distribution/DistributionDetails';

const toast = { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() };
jest.mock('@/providers/ToastProvider', () => ({ useToast: () => toast }));

const processPayloadMock = jest.fn();
jest.mock('@/stores/AllocationDistributionStore', () => ({
  allocationDistributionStore: {
    processPayload: (...args: unknown[]) => processPayloadMock(...args),
    fetchDoc: jest.fn(),
    isLoading: false,
  },
}));

jest.mock('@/app/allocation-distribution/DistributionTable', () => ({
  __esModule: true,
  default: ({ rows }: { rows: unknown[] }) => (
    <div data-testid="rows-count">{Array.isArray(rows) ? rows.length : 'NA'}</div>
  ),
}));

const renderWithTheme = () =>
  render(
    <ThemeProvider theme={theme}>
      <DistributionDetails />
    </ThemeProvider>,
  );

describe('DistributionDetails', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders title and calls process on mount', async () => {
    processPayloadMock.mockResolvedValueOnce([]);
    renderWithTheme();

    expect(screen.getByText('Preview Screen')).toBeTruthy();
    await waitFor(() => expect(processPayloadMock).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('rows-count').textContent).toBe('0');
  });

  it('renders rows from store response', async () => {
    processPayloadMock.mockResolvedValueOnce([{}, {}]);
    renderWithTheme();

    await waitFor(() => expect(processPayloadMock).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('rows-count').textContent).toBe('2');
  });

  it('handles store returning empty rows gracefully', async () => {
    processPayloadMock.mockResolvedValueOnce([]);
    renderWithTheme();

    await waitFor(() => expect(processPayloadMock).toHaveBeenCalledTimes(1));
    expect(screen.getByTestId('rows-count').textContent).toBe('0');
  });
});
