import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import CancelButton from '../CancelButton';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('CancelButton', () => {
  it('renders cancel button with correct label', () => {
    const onOpen = jest.fn();
    renderWithTheme(<CancelButton isFormClean={false} onOpenConfirmationModal={onOpen} />);

    const button = screen.getByTestId('cancel');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('disables the button when form is clean', () => {
    const onOpen = jest.fn();
    renderWithTheme(<CancelButton isFormClean={true} onOpenConfirmationModal={onOpen} />);

    const button = screen.getByTestId('cancel');
    expect(button).toBeDisabled();
  });

  it('enables the button when form has unsaved changes', () => {
    const onOpen = jest.fn();
    renderWithTheme(<CancelButton isFormClean={false} onOpenConfirmationModal={onOpen} />);

    const button = screen.getByTestId('cancel');
    expect(button).not.toBeDisabled();
  });

  it('calls onOpenConfirmationModal when enabled and clicked', () => {
    const onOpen = jest.fn();
    renderWithTheme(<CancelButton isFormClean={false} onOpenConfirmationModal={onOpen} />);

    const button = screen.getByTestId('cancel');
    fireEvent.click(button);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('shows tooltip on hover when there are unsaved changes, and hides on mouse leave', () => {
    const onOpen = jest.fn();
    renderWithTheme(<CancelButton isFormClean={false} onOpenConfirmationModal={onOpen} />);

    expect(screen.queryByTestId('tooltip-cancel-button-tooltip')).not.toBeInTheDocument();

    const button = screen.getByTestId('cancel');
    fireEvent.mouseEnter(button);

    const tooltip = screen.getByTestId('tooltip-cancel-button-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Discard unsaved changes');

    fireEvent.mouseLeave(button);
    expect(screen.queryByTestId('tooltip-cancel-button-tooltip')).not.toBeInTheDocument();
  });
});
