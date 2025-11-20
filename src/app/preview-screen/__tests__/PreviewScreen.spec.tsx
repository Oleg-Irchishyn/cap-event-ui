import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import PreviewScreenPage from '@/app/preview-screen/page';
import useContinueButton from '@/hooks/useContinueButton';
import { ROUTES } from '@/const/routes';

const replaceMock = jest.fn();
const mockUsePathname = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ replace: replaceMock }),
  useServerInsertedHTML: jest.fn(),
  usePathname: () => mockUsePathname(),
}));

jest.mock('@/hooks/useContinueButton', () => ({
  __esModule: true,
  default: jest.fn(() => ({ isContinueDisabled: true })),
}));

jest.mock('@/app/preview-screen/PreviewScreenDetails', () => ({
  __esModule: true,
  default: () => <div data-testid="preview-screen-details">Details</div>,
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('PreviewScreen page', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('redirects to /new and renders nothing when continue is disabled', () => {
    (useContinueButton as jest.Mock).mockReturnValue({ isContinueDisabled: true });

    const { container } = renderWithTheme(<PreviewScreenPage />);

    expect(replaceMock).toHaveBeenCalledWith(ROUTES.NEW_CAP_EVENT.path);
    expect(screen.queryByTestId('preview-screen-details')).not.toBeInTheDocument();
    expect(container.firstChild).toBeNull();
  });

  it('renders PreviewScreenDetails when continue is enabled', () => {
    (useContinueButton as jest.Mock).mockReturnValue({ isContinueDisabled: false });

    renderWithTheme(<PreviewScreenPage />);

    expect(screen.getByTestId('preview-screen-details')).toBeInTheDocument();
  });

  it('does not redirect when continue is enabled', () => {
    (useContinueButton as jest.Mock).mockReturnValue({ isContinueDisabled: false });

    renderWithTheme(<PreviewScreenPage />);

    expect(replaceMock).not.toHaveBeenCalled();
  });
});
