import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ICellRendererParams } from 'ag-grid-community';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';

import { TextInputCell } from '../TextInputCell';
import { TEXT_INPUT_MAX_LENGTH } from '../../const';

type TextInputCellTestProps = ICellRendererParams & {
  placeholder?: string;
  name?: string;
  maxLength?: number;
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('TextInputCell', () => {
  const baseProps = {
    value: '',
    setValue: jest.fn(),
    data: {},
    colDef: { editable: true },
  } as unknown as ICellRendererParams;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders input with placeholder and attributes', () => {
      renderWithTheme(<TextInputCell {...(baseProps as TextInputCellTestProps)} />);

      const input = screen.getByPlaceholderText('Enter Value');
      expect(input).toBeInTheDocument();
      expect(input).toHaveAttribute('name', 'text-input-cell');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('maxLength', String(TEXT_INPUT_MAX_LENGTH));
    });

    it('does not render for total rows', () => {
      const props = {
        ...baseProps,
        data: { isTotalRow: true },
      } as unknown as ICellRendererParams;

      const { container } = renderWithTheme(
        <TextInputCell {...(props as TextInputCellTestProps)} />,
      );
      expect(container.firstChild).toBeNull();
    });

    it('sets initial value from props and updates on prop change', () => {
      const { rerender } = renderWithTheme(
        <TextInputCell {...(baseProps as TextInputCellTestProps)} value={'Initial'} />,
      );

      expect(screen.getByRole('textbox')).toHaveValue('Initial');

      rerender(
        <ThemeProvider theme={theme}>
          <TextInputCell {...(baseProps as TextInputCellTestProps)} value={'Updated'} />
        </ThemeProvider>,
      );
      expect(screen.getByRole('textbox')).toHaveValue('Updated');
    });
  });

  describe('Editability', () => {
    it('is enabled when colDef.editable=true', () => {
      renderWithTheme(
        <TextInputCell
          {...({ ...baseProps, colDef: { editable: true } } as TextInputCellTestProps)}
        />,
      );
      expect(screen.getByRole('textbox')).toBeEnabled();
    });

    it('is disabled when colDef.editable=false', () => {
      renderWithTheme(
        <TextInputCell
          {...({ ...baseProps, colDef: { editable: false } } as TextInputCellTestProps)}
        />,
      );
      expect(screen.getByRole('textbox')).toBeDisabled();
    });

    it('resolves editability when colDef.editable is a function', () => {
      const editableFn = jest.fn(() => true);
      renderWithTheme(
        <TextInputCell
          {...({ ...baseProps, colDef: { editable: editableFn } } as TextInputCellTestProps)}
        />,
      );
      expect(editableFn).toHaveBeenCalled();
      expect(screen.getByRole('textbox')).toBeEnabled();

      const notEditableFn = jest.fn(() => false);
      renderWithTheme(
        <TextInputCell
          {...({ ...baseProps, colDef: { editable: notEditableFn } } as TextInputCellTestProps)}
        />,
      );
      expect(notEditableFn).toHaveBeenCalled();
      expect(screen.getAllByRole('textbox')[1]).toBeDisabled();
    });
  });

  describe('Input behavior', () => {
    it('trims leading and trailing spaces on each change', () => {
      renderWithTheme(<TextInputCell {...(baseProps as TextInputCellTestProps)} />);
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '  abc  ' } });
      expect(input).toHaveValue('abc');

      fireEvent.change(input, { target: { value: '   ' } });
      expect(input).toHaveValue('');
    });

    it('enforces max length on change', () => {
      renderWithTheme(<TextInputCell {...(baseProps as TextInputCellTestProps)} />);
      const input = screen.getByRole('textbox');
      const longValue = 'a'.repeat(TEXT_INPUT_MAX_LENGTH + 10);

      fireEvent.change(input, { target: { value: longValue } });
      expect(input).toHaveValue('a'.repeat(TEXT_INPUT_MAX_LENGTH));
    });

    it('calls setValue with trimmed and capped value on blur', () => {
      const setValue = jest.fn();
      renderWithTheme(
        <TextInputCell {...(baseProps as TextInputCellTestProps)} setValue={setValue} />,
      );
      const input = screen.getByRole('textbox');

      const valueWithSpaces = `  ${'x'.repeat(TEXT_INPUT_MAX_LENGTH + 5)}  `;
      fireEvent.change(input, { target: { value: valueWithSpaces } });
      fireEvent.blur(input);

      expect(setValue).toHaveBeenCalledTimes(1);
      expect(setValue).toHaveBeenCalledWith('x'.repeat(TEXT_INPUT_MAX_LENGTH));
      expect(input).toHaveValue('x'.repeat(TEXT_INPUT_MAX_LENGTH));
    });

    it('submits value on Enter key press', () => {
      const setValue = jest.fn();
      renderWithTheme(
        <TextInputCell {...(baseProps as TextInputCellTestProps)} setValue={setValue} />,
      );
      const input = screen.getByRole('textbox');

      fireEvent.change(input, { target: { value: '  Hello world  ' } });
      fireEvent.keyDown(input, { key: 'Enter' });

      expect(setValue).toHaveBeenCalledWith('Hello world');
    });

    it('does not bubble double click events to parent', () => {
      const parentDoubleClick = jest.fn();
      const Wrapper = (props: ICellRendererParams) => (
        <div onDoubleClick={parentDoubleClick}>
          <ThemeProvider theme={theme}>
            <TextInputCell {...(props as TextInputCellTestProps)} />
          </ThemeProvider>
        </div>
      );

      render(<Wrapper {...(baseProps as ICellRendererParams)} />);
      const input = screen.getByRole('textbox');
      fireEvent.doubleClick(input);
      expect(parentDoubleClick).not.toHaveBeenCalled();
    });
  });
});
