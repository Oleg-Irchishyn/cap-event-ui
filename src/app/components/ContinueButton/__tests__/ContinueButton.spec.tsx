import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import ContinueButton from '@/app/components/ContinueButton/ContinueButton';
import useContinueButton from '@/hooks/useContinueButton';

const pushMock = jest.fn();
jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushMock }),
  useServerInsertedHTML: jest.fn(),
}));

jest.mock('@/hooks/useContinueButton', () => ({
  __esModule: true,
  default: jest.fn(() => ({
    isContinueDisabled: true,
    tooltipMessage: 'Not all required fields are populated',
  })),
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ContinueButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders disabled state and shows tooltip on hover', () => {
    (useContinueButton as jest.Mock).mockReturnValue({
      isContinueDisabled: true,
      tooltipMessage: 'Not all required fields are populated',
    });

    renderWithTheme(<ContinueButton />);

    const btn = screen.getByTestId('preview-screen');
    expect(btn).toBeDisabled();

    const wrapper = btn.parentElement as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    expect(screen.getByTestId('tooltip-continue-button-tooltip')).toBeInTheDocument();
  });

  it('renders enabled state and navigates on click', () => {
    (useContinueButton as jest.Mock).mockReturnValue({
      isContinueDisabled: false,
      tooltipMessage: '',
    });

    renderWithTheme(<ContinueButton />);

    const btn = screen.getByTestId('preview-screen');
    expect(btn).not.toBeDisabled();

    fireEvent.click(btn);
    expect(pushMock).toHaveBeenCalledWith('/preview-screen');
  });

  it('does not show tooltip when enabled, even on hover', () => {
    (useContinueButton as jest.Mock).mockReturnValue({
      isContinueDisabled: false,
      tooltipMessage: 'Ignored',
    });

    renderWithTheme(<ContinueButton />);

    const btn = screen.getByTestId('preview-screen');
    const wrapper = btn.parentElement as HTMLElement;
    fireEvent.mouseEnter(wrapper);

    expect(screen.queryByTestId('tooltip-continue-button-tooltip')).not.toBeInTheDocument();
  });
});
