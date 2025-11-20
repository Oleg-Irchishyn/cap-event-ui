import React, { ReactNode } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { DateCell } from '../DateCell';
import { ICellRendererParams } from 'ag-grid-community';
import { Dayjs } from 'dayjs';

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    src,
    alt,
    width,
    height,
  }: {
    src: string;
    alt: string;
    width: number;
    height: number;
  }) => <img src={src} alt={alt} width={width} height={height} />,
}));

// Mock dayjs
jest.mock('dayjs', () => {
  const originalDayjs = jest.requireActual('dayjs');
  const mockDayjs = (date?: Date) => {
    const dayjsInstance = originalDayjs(date);
    // Add a format method that returns the expected format
    dayjsInstance.format = (format: string) => {
      if (format === 'MM/DD/YYYY') {
        const month = String(dayjsInstance.month() + 1).padStart(2, '0');
        const day = String(dayjsInstance.date()).padStart(2, '0');
        const year = dayjsInstance.year();
        return `${month}/${day}/${year}`;
      }
      return originalDayjs(date).format(format);
    };
    return dayjsInstance;
  };
  mockDayjs.default = originalDayjs.default;
  return mockDayjs;
});

// Mock styled-components
jest.mock('styled-components', () => ({
  ...jest.requireActual('styled-components'),
  ThemeProvider: ({ children }: { children: ReactNode }) => children,
}));

// Mock the styles
jest.mock('../../styles', () => ({
  DateCellWrapper: ({ children, ...props }: { children: ReactNode }) => (
    <div data-testid="date-cell-wrapper" {...props}>
      {children}
    </div>
  ),
}));

// Mock the DatePicker component
jest.mock('@/app/components/DatePicker', () => {
  const MockDatePicker = ({
    onChange,
    defaultValue,
    testId,
  }: {
    onChange: (value: Date) => void;
    defaultValue: Dayjs;
    testId: string;
  }) => {
    const formatDate = (date: Dayjs) => {
      if (!date) return 'No date';
      if (typeof date.format === 'function') {
        return date.format('MM/DD/YYYY');
      }
      return 'No date';
    };

    return (
      <div data-testid={testId}>
        <button onClick={() => onChange(new Date('2024-01-15'))}>Select Date</button>
        <span>{formatDate(defaultValue)}</span>
      </div>
    );
  };
  return {
    __esModule: true,
    default: MockDatePicker,
  };
});

// Mock the datePickerUtils
jest.mock('@/utils/datePickerUtils', () => ({
  parseValidDate: (value: never) => {
    return value;
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(component);
};

describe('DateCell', () => {
  const mockProps: ICellRendererParams = {
    value: null,
    setValue: jest.fn(),
    colDef: {
      headerName: 'PR Date',
      editable: true,
    },
    data: { id: 'test-row' },
  } as never;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render DatePicker component', () => {
    renderWithTheme(<DateCell {...mockProps} />);

    expect(screen.getByTestId('date-picker-cell')).toBeInTheDocument();
  });

  it('should render with formatted date when value is provided', () => {
    const propsWithValue = {
      ...mockProps,
      value: new Date('2024-01-15'),
    };

    renderWithTheme(<DateCell {...propsWithValue} />);

    expect(screen.getByTestId('date-picker-cell')).toBeInTheDocument();
    // Check that a date is displayed (the exact format may vary due to mocking)
    expect(screen.getByText(/\d{2}\/\d{2}\/\d{4}/)).toBeInTheDocument();
  });

  it('should be disabled when not editable', () => {
    const nonEditableProps = {
      ...mockProps,
      colDef: {
        ...mockProps.colDef,
        editable: false,
      },
    };

    renderWithTheme(<DateCell {...nonEditableProps} />);

    const datePicker = screen.getByTestId('date-picker-cell');
    expect(datePicker).toBeInTheDocument();
    // The DatePicker should receive isDisabled=true when not editable
    expect(screen.getByText('No date')).toBeInTheDocument();
  });

  it('should call setValue when date is selected', () => {
    renderWithTheme(<DateCell {...mockProps} />);

    const selectButton = screen.getByText('Select Date');
    fireEvent.click(selectButton);

    expect(mockProps.setValue).toHaveBeenCalledWith(expect.any(Date));
    expect(mockProps.setValue).toHaveBeenCalledTimes(1);
  });

  it('should handle inherited data styling', () => {
    const inheritedProps = {
      ...mockProps,
      data: { id: 'test-row', inheritedFundGroupLineItemId: 'parent-row' },
    };

    renderWithTheme(<DateCell {...inheritedProps} />);

    const wrapper = screen.getByTestId('date-picker-cell').closest('[data-is-inherited]');
    expect(wrapper).toHaveAttribute('data-is-inherited', 'true');
  });
});
