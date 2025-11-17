import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import AllocationDistributionPage from '@/app/allocation-distribution/page';
import useContinueButton from '@/hooks/useContinueButton';
import { ROUTES } from '@/const/routes';

const replaceMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useServerInsertedHTML: jest.fn(),
}));

jest.mock('@/hooks/useContinueButton', () => ({
  __esModule: true,
  default: jest.fn(() => ({ isContinueDisabled: true })),
}));

jest.mock('@/app/allocation-distribution/DistributionDetails', () => ({
  __esModule: true,
  default: () => <div data-testid="allocation-distribution-details">Details</div>,
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AllocationDistribution page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /new and renders nothing when continue is disabled', () => {
    (useContinueButton as jest.Mock).mockReturnValue({ isContinueDisabled: true });

    const { container } = renderWithTheme(<AllocationDistributionPage />);

    expect(replaceMock).toHaveBeenCalledWith(ROUTES.NEW_CAP_EVENT.path);
    expect(screen.queryByTestId('allocation-distribution-details')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('renders DistributionDetails when continue is enabled', () => {
    (useContinueButton as jest.Mock).mockReturnValue({ isContinueDisabled: false });

    renderWithTheme(<AllocationDistributionPage />);

    expect(screen.getByTestId('allocation-distribution-details')).toBeInTheDocument();
  });

  it('does not redirect when continue is enabled', () => {
    (useContinueButton as jest.Mock).mockReturnValue({ isContinueDisabled: false });

    renderWithTheme(<AllocationDistributionPage />);

    expect(replaceMock).not.toHaveBeenCalled();
  });
});
