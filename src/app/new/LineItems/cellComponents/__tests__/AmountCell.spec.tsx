import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import { AmountCell } from '../AmountCell';
import { ICellRendererParams } from 'ag-grid-community';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('AmountCell', () => {
  const defaultProps = {
    value: 0,
    setValue: jest.fn(),
    api: {},
    node: {},
    colDef: {
      cellRendererParams: jest.fn().mockReturnValue(true),
    },
  } as unknown as ICellRendererParams;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with placeholder text when value is 0', () => {
      renderWithTheme(<AmountCell {...defaultProps} value={0} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      expect(input).toBeInTheDocument();
      expect(input).toHaveValue('');
    });

    it('should render with formatted value when value is provided', () => {
      renderWithTheme(<AmountCell {...defaultProps} value={1234.56} />);

      const input = screen.getByDisplayValue('$1,234.56');
      expect(input).toBeInTheDocument();
    });

    it('should be disabled when cell is not editable', () => {
      const props = {
        ...defaultProps,
        colDef: {
          cellRendererParams: jest.fn().mockReturnValue(false),
        },
      };

      renderWithTheme(<AmountCell {...props} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      expect(input).toBeDisabled();
    });

    it('should be enabled when cell is editable', () => {
      renderWithTheme(<AmountCell {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      expect(input).not.toBeDisabled();
    });
  });

  describe('Value formatting', () => {
    it('should format positive numbers with currency symbol and commas', () => {
      renderWithTheme(<AmountCell {...defaultProps} value={1234567.89} />);

      const input = screen.getByDisplayValue('$1,234,567.89');
      expect(input).toBeInTheDocument();
    });

    it('should format zero as empty string', () => {
      renderWithTheme(<AmountCell {...defaultProps} value={0} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      expect(input).toHaveValue('');
    });

    it('should handle undefined value', () => {
      renderWithTheme(<AmountCell {...defaultProps} value={undefined} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      expect(input).toHaveValue('');
    });

    it('should handle null value', () => {
      renderWithTheme(<AmountCell {...defaultProps} value={null} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      expect(input).toHaveValue('');
    });
  });

  describe('User input handling', () => {
    it('should allow valid number input', () => {
      renderWithTheme(<AmountCell {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '123.45' } });

      expect(input).toHaveValue('123.45');
    });

    it('should allow negative sign input', () => {
      renderWithTheme(<AmountCell {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '-' } });

      expect(input).toHaveValue('-');
    });

    it('should allow decimal point input', () => {
      renderWithTheme(<AmountCell {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '123.' } });

      expect(input).toHaveValue('123.');
    });

    it('should reject invalid characters', () => {
      renderWithTheme(<AmountCell {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: 'abc123' } });

      expect(input).toHaveValue('');
    });

    it('should allow empty string', () => {
      renderWithTheme(<AmountCell {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '' } });

      expect(input).toHaveValue('');
    });
  });

  describe('Focus and blur behavior', () => {
    it('should convert formatted value to number string on focus', () => {
      renderWithTheme(<AmountCell {...defaultProps} value={1234.56} />);

      const input = screen.getByDisplayValue('$1,234.56');
      fireEvent.focus(input);

      expect(input).toHaveValue('1234.56');
    });

    it('should format value on blur', () => {
      renderWithTheme(<AmountCell {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '1234.56' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('$1,234.56');
    });

    it('should clear value on blur if input is empty or invalid', () => {
      renderWithTheme(<AmountCell {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('');
    });

    it('should clear value on blur if input is just a negative sign', () => {
      renderWithTheme(<AmountCell {...defaultProps} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '-' } });
      fireEvent.blur(input);

      expect(input).toHaveValue('');
    });
  });

  describe('Keyboard events', () => {
    it('should trigger blur on Enter key', () => {
      const setValue = jest.fn();
      renderWithTheme(<AmountCell {...defaultProps} setValue={setValue} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '123.45' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(input).toHaveValue('$123.45');
    });
  });

  describe('setValue callback', () => {
    it('should call setValue with numeric value on blur in editor mode', () => {
      const setValue = jest.fn();
      const props = {
        ...defaultProps,
        setValue,
        api: { mock: true },
        node: { mock: true },
      } as unknown as ICellRendererParams;

      renderWithTheme(<AmountCell {...props} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '123.45' } });
      fireEvent.blur(input);

      expect(setValue).toHaveBeenCalledWith(123.45);
    });

    it('should not call setValue when not in editor mode', () => {
      const setValue = jest.fn();
      const props = {
        ...defaultProps,
        setValue,
        api: null,
        node: null,
      } as unknown as ICellRendererParams;

      renderWithTheme(<AmountCell {...props} />);

      const input = screen.getByPlaceholderText('Enter Amount');
      fireEvent.change(input, { target: { value: '123.45' } });
      fireEvent.blur(input);

      expect(setValue).not.toHaveBeenCalled();
    });
  });
});
