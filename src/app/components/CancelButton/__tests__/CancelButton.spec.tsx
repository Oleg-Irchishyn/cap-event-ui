import { render, screen, fireEvent, waitFor } from '@testing-library/react';
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

    const button = screen.getByText('Cancel').closest('button') as HTMLElement;
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
  });

  it('disables the button when form is clean', () => {
    const onOpen = jest.fn();
    renderWithTheme(<CancelButton isFormClean={true} onOpenConfirmationModal={onOpen} />);

    const button = screen.getByText('Cancel').closest('button') as HTMLElement;
    expect(button).toBeDisabled();
  });

  it('enables the button when form has unsaved changes', () => {
    const onOpen = jest.fn();
    renderWithTheme(<CancelButton isFormClean={false} onOpenConfirmationModal={onOpen} />);

    const button = screen.getByText('Cancel').closest('button') as HTMLElement;
    expect(button).not.toBeDisabled();
  });

  it('calls onOpenConfirmationModal when enabled and clicked', () => {
    const onOpen = jest.fn();
    renderWithTheme(<CancelButton isFormClean={false} onOpenConfirmationModal={onOpen} />);

    const button = screen.getByText('Cancel').closest('button') as HTMLElement;
    fireEvent.click(button);
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it('shows tooltip on hover when there are unsaved changes', async () => {
    const onOpen = jest.fn();
    renderWithTheme(<CancelButton isFormClean={false} onOpenConfirmationModal={onOpen} />);

    fireEvent.mouseOver(screen.getByText('Cancel').closest('button') as HTMLElement);

    await waitFor(() =>
      expect(screen.getByRole('tooltip')).toHaveTextContent('Discard unsaved changes'),
    );
  });
});
