import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DistributionDetails from '@/app/new/allocation-distribution/DistributionDetails';

const toast = { success: jest.fn(), error: jest.fn(), info: jest.fn(), warning: jest.fn() };
jest.mock('@/providers/ToastProvider', () => ({ useToast: () => toast }));

const processMock = jest.fn();
jest.mock('@/api', () => ({
  CapEventPackageApi: { default: { process: (...args: unknown[]) => processMock(...args) } },
}));

jest.mock('@/app/new/allocation-distribution/DistributionTable', () => ({
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

  it('renders title and disables upload when payload is empty', () => {
    renderWithTheme();

    expect(screen.getByText('Allocation Distribution')).toBeTruthy();

    const uploadBtn = screen.getByTestId(
      'button-upload-allocation-distribution',
    ) as HTMLButtonElement;
    expect(uploadBtn.disabled).toBe(true);
  });

  it('parses JSON and calls API on upload', async () => {
    processMock.mockResolvedValueOnce([{ capEventLineItemId: 'L1', plInvestorEntries: [{}, {}] }]);
    renderWithTheme();

    const textarea = screen.getByTestId(
      'textarea-json-parse-allocation-distribution',
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{"a":1}' } });

    const uploadBtn = screen.getByTestId(
      'button-upload-allocation-distribution',
    ) as HTMLButtonElement;
    expect(uploadBtn.disabled).toBe(false);
    fireEvent.click(uploadBtn);

    await waitFor(() => expect(processMock).toHaveBeenCalledTimes(1));
    expect(processMock).toHaveBeenCalledWith({ a: 1 });
    expect(screen.getByTestId('rows-count').textContent).toBe('2');
  });

  it('shows toast error and falls back to mocked response on API error', async () => {
    processMock.mockRejectedValueOnce(new Error('Boom'));
    renderWithTheme();

    const textarea = screen.getByTestId(
      'textarea-json-parse-allocation-distribution',
    ) as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{"a":1}' } });

    const uploadBtn = screen.getByTestId(
      'button-upload-allocation-distribution',
    ) as HTMLButtonElement;
    fireEvent.click(uploadBtn);

    await waitFor(() => expect(toast.error).toHaveBeenCalled());
    expect(Number(screen.getByTestId('rows-count').textContent || '0')).toBeGreaterThan(0);
  });
});
