import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import { DropdownSearchCell } from '../DropdownSearchCell';
import { ICellRendererParams } from 'ag-grid-community';

jest.mock('@/hooks/useExternalElementClick', () => ({
  useExternalElementClick: jest.fn(),
}));

jest.mock('@/stores', () => ({
  entityDatesStore: {
    getEntityDueDate: jest.fn(() => {}),
    getEntityNoticeDate: jest.fn(),
  },
  capEventSettingsStore: {
    getUserInputs: jest.fn(() => []),
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('DropdownSearchCell', () => {
  const defaultProps = {
    value: '',
    setValue: jest.fn(),
    colDef: {
      headerName: 'Test Field',
      editable: true,
      cellEditorParams: {
        options: ['Option 1', 'Option 2', 'Option 3'],
      },
    },
    api: {},
    node: {},
  } as unknown as ICellRendererParams;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render with placeholder text when no value is selected', () => {
      renderWithTheme(<DropdownSearchCell {...defaultProps} />);

      expect(screen.getByText('Select Test Field')).toBeInTheDocument();
    });

    it('should render with selected value when value is provided', () => {
      renderWithTheme(<DropdownSearchCell {...defaultProps} value="Option 1" />);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
    });

    it('should not show chevron icon when cell is not editable', () => {
      const props = {
        ...defaultProps,
        colDef: {
          ...defaultProps.colDef,
          editable: false,
        },
      };

      renderWithTheme(<DropdownSearchCell {...props} />);

      expect(screen.queryByTestId('chevron-icon')).not.toBeInTheDocument();
    });
  });

  describe('Dropdown functionality', () => {
    it('should open dropdown when clicked and cell is editable', () => {
      renderWithTheme(<DropdownSearchCell {...defaultProps} />);

      const trigger = screen.getByText('Select Test Field');
      fireEvent.click(trigger);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.getByText('Option 2')).toBeInTheDocument();
      expect(screen.getByText('Option 3')).toBeInTheDocument();
    });

    it('should not open dropdown when clicked and cell is not editable', () => {
      const props = {
        ...defaultProps,
        colDef: {
          ...defaultProps.colDef,
          editable: false,
        },
      };

      renderWithTheme(<DropdownSearchCell {...props} />);

      const trigger = screen.getByText('Select Test Field');
      fireEvent.click(trigger);

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });

    it('should close dropdown when option is selected', () => {
      renderWithTheme(<DropdownSearchCell {...defaultProps} />);

      const trigger = screen.getByText('Select Test Field');
      fireEvent.click(trigger);

      const option = screen.getByText('Option 1');
      fireEvent.click(option);

      expect(screen.queryByText('Option 2')).not.toBeInTheDocument();
    });

    it('should call setValue when option is selected', () => {
      const setValue = jest.fn();
      renderWithTheme(<DropdownSearchCell {...defaultProps} setValue={setValue} />);

      const trigger = screen.getByText('Select Test Field');
      fireEvent.click(trigger);

      const option = screen.getByText('Option 1');
      fireEvent.click(option);

      expect(setValue).toHaveBeenCalledWith('Option 1');
    });

    it('should update selected value when option is selected', () => {
      renderWithTheme(<DropdownSearchCell {...defaultProps} />);

      const trigger = screen.getByText('Select Test Field');
      fireEvent.click(trigger);

      const option = screen.getByText('Option 1');
      fireEvent.click(option);

      expect(screen.getByText('Option 1')).toBeInTheDocument();
      expect(screen.queryByText('Select Test Field')).not.toBeInTheDocument();
    });
  });

  describe('Search functionality', () => {
    it('should not show search box when there are 3 or fewer options', () => {
      const props = {
        ...defaultProps,
        colDef: {
          ...defaultProps.colDef,
          cellEditorParams: {
            options: ['Option 1', 'Option 2'],
          },
        },
      };

      renderWithTheme(<DropdownSearchCell {...props} />);

      const trigger = screen.getByText('Select Test Field');
      fireEvent.click(trigger);

      expect(screen.queryByTestId('search')).not.toBeInTheDocument();
    });
  });

  describe('Dynamic cell editor params', () => {
    it('should use function-based cellEditorParams', () => {
      const mockParamsFunction = jest.fn().mockReturnValue({
        options: ['Dynamic Option 1', 'Dynamic Option 2'],
      });

      const props = {
        ...defaultProps,
        colDef: {
          ...defaultProps.colDef,
          cellEditorParams: mockParamsFunction,
        },
      };

      renderWithTheme(<DropdownSearchCell {...props} />);

      const trigger = screen.getByText('Select Test Field');
      fireEvent.click(trigger);

      expect(mockParamsFunction).toHaveBeenCalledWith(props);
      expect(screen.getByText('Dynamic Option 1')).toBeInTheDocument();
      expect(screen.getByText('Dynamic Option 2')).toBeInTheDocument();
    });
  });

  describe('Editable state', () => {
    it('should use function-based editable check', () => {
      const mockEditableFunction = jest.fn().mockReturnValue(false);

      const props = {
        ...defaultProps,
        colDef: {
          ...defaultProps.colDef,
          editable: mockEditableFunction,
        },
      };

      renderWithTheme(<DropdownSearchCell {...props} />);

      expect(mockEditableFunction).toHaveBeenCalledWith(props);
    });

    it('should use boolean editable value', () => {
      const props = {
        ...defaultProps,
        colDef: {
          ...defaultProps.colDef,
          editable: false,
        },
      };

      renderWithTheme(<DropdownSearchCell {...props} />);

      const trigger = screen.getByText('Select Test Field');
      fireEvent.click(trigger);

      expect(screen.queryByText('Option 1')).not.toBeInTheDocument();
    });
  });
});
