import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import Button from '../Button';
import { BUTTON_THEMES } from '../styles';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Button', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders button with children and calls onClick when clicked', () => {
    renderWithTheme(
      <Button onClick={mockOnClick} buttonTheme={BUTTON_THEMES.primary} testId="test-button">
        Click Me
      </Button>,
    );

    const button = screen.getByTestId('test-button');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Click Me')).toBeInTheDocument();

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('prevents onClick when button is disabled', () => {
    renderWithTheme(
      <Button
        onClick={mockOnClick}
        buttonTheme={BUTTON_THEMES.primary}
        testId="test-button"
        disabled={true}
      >
        Disabled Button
      </Button>,
    );

    const button = screen.getByTestId('test-button');
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  it('shows tooltip when disabled and disabledTooltipText is provided', () => {
    renderWithTheme(
      <Button
        onClick={mockOnClick}
        buttonTheme={BUTTON_THEMES.primary}
        testId="test-button"
        disabled={true}
        disabledTooltipText="This button is disabled"
      >
        Disabled Button
      </Button>,
    );

    const button = screen.getByTestId('test-button');
    expect(screen.queryByText('This button is disabled')).not.toBeInTheDocument();

    fireEvent.mouseEnter(button);
    expect(screen.getByText('This button is disabled')).toBeInTheDocument();

    fireEvent.mouseLeave(button);
    expect(screen.queryByText('This button is disabled')).not.toBeInTheDocument();
  });

  it('applies correct button theme', () => {
    const { rerender } = renderWithTheme(
      <Button onClick={mockOnClick} buttonTheme={BUTTON_THEMES.primary} testId="test-button">
        Primary
      </Button>,
    );

    let button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('data-theme', BUTTON_THEMES.primary);

    rerender(
      <ThemeProvider theme={theme}>
        <Button onClick={mockOnClick} buttonTheme={BUTTON_THEMES.secondary} testId="test-button">
          Secondary
        </Button>
      </ThemeProvider>,
    );

    button = screen.getByTestId('test-button');
    expect(button).toHaveAttribute('data-theme', BUTTON_THEMES.secondary);
  });

  it('applies custom width and style props', () => {
    renderWithTheme(
      <Button
        onClick={mockOnClick}
        buttonTheme={BUTTON_THEMES.primary}
        testId="test-button"
        width="300px"
        style={{ display: 'block' }}
      >
        Custom Button
      </Button>,
    );

    const button = screen.getByTestId('test-button');
    expect(button).toHaveStyle({ width: '300px' });
  });
});
