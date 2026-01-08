import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DeleteButton from '../DeleteButton';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('DeleteButton', () => {
  it('renders with correct label', () => {
    renderWithTheme(<DeleteButton />);
    const button = screen.getByTestId('delete');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Delete Capital Event')).toBeInTheDocument();
  });

  it('is disabled by default', () => {
    renderWithTheme(<DeleteButton />);
    const button = screen.getByTestId('delete');
    expect(button).toBeDisabled();
  });

  it('click does not throw when disabled', () => {
    renderWithTheme(<DeleteButton />);
    const button = screen.getByTestId('delete');
    expect(() => fireEvent.click(button)).not.toThrow();
  });
});
