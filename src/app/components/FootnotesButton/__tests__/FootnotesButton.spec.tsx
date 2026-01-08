import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import FootnotesButton from '../FootnotesButton';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('FootnotesButton', () => {
  it('renders with correct label', () => {
    renderWithTheme(
      <FootnotesButton isFootnotesButtonEnabled={true} onToggleFootnotesModal={jest.fn()} />,
    );
    const button = screen.getByTestId('footnotes');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Footnotes')).toBeInTheDocument();
  });

  it('is disabled and shows tooltip when not enabled', () => {
    renderWithTheme(
      <FootnotesButton isFootnotesButtonEnabled={false} onToggleFootnotesModal={jest.fn()} />,
    );
    const button = screen.getByTestId('footnotes');
    expect(button).toBeDisabled();

    fireEvent.mouseEnter(button);
    const tooltip = screen.getByTestId('tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('No Notice Line Description available');

    fireEvent.mouseLeave(button);
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });

  it('calls onToggleFootnotesModal when enabled and clicked', () => {
    const onToggle = jest.fn();
    renderWithTheme(
      <FootnotesButton isFootnotesButtonEnabled={true} onToggleFootnotesModal={onToggle} />,
    );
    const button = screen.getByTestId('footnotes');
    fireEvent.click(button);
    expect(onToggle).toHaveBeenCalledTimes(1);
  });
});
