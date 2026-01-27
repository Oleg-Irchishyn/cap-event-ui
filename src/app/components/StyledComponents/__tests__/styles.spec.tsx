import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import { ItemCheckbox } from '../styles';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('StyledComponents styles', () => {
  describe('ItemCheckbox', () => {
    it('renders as a checkbox input with correct type attribute', () => {
      renderWithTheme(<ItemCheckbox data-testid="test-checkbox" />);

      const checkbox = screen.getByTestId('test-checkbox');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveAttribute('type', 'checkbox');
    });

    it('can be checked and unchecked', () => {
      renderWithTheme(
        <ItemCheckbox data-testid="test-checkbox-unchecked" defaultChecked={false} />,
      );

      const uncheckedCheckbox = screen.getByTestId('test-checkbox-unchecked') as HTMLInputElement;
      expect(uncheckedCheckbox.checked).toBe(false);

      renderWithTheme(<ItemCheckbox data-testid="test-checkbox-checked" defaultChecked={true} />);

      const checkedCheckbox = screen.getByTestId('test-checkbox-checked') as HTMLInputElement;
      expect(checkedCheckbox.checked).toBe(true);
    });

    it('can be disabled', () => {
      renderWithTheme(<ItemCheckbox data-testid="test-checkbox" disabled />);

      const checkbox = screen.getByTestId('test-checkbox') as HTMLInputElement;
      expect(checkbox).toBeDisabled();
    });

    it('applies correct base styles', () => {
      const { container } = renderWithTheme(<ItemCheckbox data-testid="test-checkbox" />);

      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toBeInTheDocument();
      expect(checkbox).toHaveStyle({
        display: 'flex',
        width: '18px',
        height: '18px',
        marginRight: '8px',
        borderRadius: '4px',
        border: '1px solid #666769',
        backgroundColor: '#ffffff',
        cursor: 'pointer',
      });
    });

    it('applies disabled styles when disabled', () => {
      const { container } = renderWithTheme(<ItemCheckbox data-testid="test-checkbox" disabled />);

      const checkbox = container.querySelector('input[type="checkbox"]');
      expect(checkbox).toHaveStyle({
        cursor: 'default',
        background: '#f0f1f1',
        border: '1px solid #b7b7b8',
      });
    });
  });
});
