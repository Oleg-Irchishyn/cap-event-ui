import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import dayjs, { Dayjs } from 'dayjs';
import DatePicker from '../index';

jest.mock('@mui/x-date-pickers', () => {
  type MockSlots = { openPickerIcon?: () => React.ReactNode };
  type MockProps = {
    label?: string;
    value?: Dayjs | null;
    minDate?: Dayjs;
    maxDate?: Dayjs;
    disabled?: boolean;
    format?: string;
    slots?: MockSlots;
    onChange: (value: unknown) => void;
    onError: (error: unknown) => void;
  };
  const DesktopDatePicker = (props: MockProps) => (
    <div data-testid="desktop-date-picker">
      <div data-testid="dp-label">{props.label}</div>
      <div data-testid="dp-value">
        {props.value ? dayjs(props.value).format('YYYY-MM-DD') : 'null'}
      </div>
      <div data-testid="dp-min">
        {props.minDate ? dayjs(props.minDate).format('YYYY-MM-DD') : 'null'}
      </div>
      <div data-testid="dp-max">
        {props.maxDate ? dayjs(props.maxDate).format('YYYY-MM-DD') : 'null'}
      </div>
      <div data-testid="dp-disabled">{props.disabled ? 'true' : 'false'}</div>
      <div data-testid="dp-format">{props.format ?? 'undefined'}</div>
      <div data-testid="dp-icon">
        {props.slots?.openPickerIcon ? props.slots.openPickerIcon() : null}
      </div>
      <button onClick={() => props.onChange(dayjs('2025-03-04'))}>change</button>
      <button onClick={() => props.onError('invalid')}>error</button>
      <button onClick={() => props.onError(null)}>no-error</button>
    </div>
  );
  const LocalizationProvider = ({ children }: { children: React.ReactNode }) => (
    <div data-testid="localization-provider">{children}</div>
  );
  return { DesktopDatePicker, LocalizationProvider };
});

jest.mock('@mui/x-date-pickers/AdapterDayjs', () => ({
  AdapterDayjs: function AdapterDayjs() {
    return null;
  },
}));

describe('DatePicker', () => {
  test('renders label and wrapper/label test ids', () => {
    render(<DatePicker testId="my-id" label="Pick a date" onChange={() => {}} />);
    expect(screen.getByTestId('my-id-DatePicker-Wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('my-id-DatePicker-Label')).toHaveTextContent('Pick a date');
  });

  test('passes defaultValue through to picker', () => {
    render(
      <DatePicker
        testId="dp"
        label="Label"
        defaultValue={dayjs('2025-02-01')}
        onChange={() => {}}
      />,
    );
    expect(screen.getByTestId('dp-DatePicker-Label')).toHaveTextContent('Label');
    expect(screen.getByTestId('dp-DatePicker-Wrapper')).toBeInTheDocument();
    expect(screen.getByTestId('dp-value')).toHaveTextContent('2025-02-01');
  });

  test('fires onChange from underlying picker', () => {
    const onChange = jest.fn();
    render(<DatePicker testId="dp" label="L" onChange={onChange} />);
    fireEvent.click(screen.getByText('change'));
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  test('calls setIsValidDate based on onError', () => {
    const setIsValidDate = jest.fn();
    render(
      <DatePicker testId="dp" label="L" onChange={() => {}} setIsValidDate={setIsValidDate} />,
    );
    fireEvent.click(screen.getByText('error'));
    fireEvent.click(screen.getByText('no-error'));
    expect(setIsValidDate).toHaveBeenNthCalledWith(1, false);
    expect(setIsValidDate).toHaveBeenNthCalledWith(2, true);
  });

  test('respects min/max/disabled/format and renders custom pickerIcon', () => {
    const icon = () => <span data-testid="custom-icon">icon</span>;
    render(
      <DatePicker
        testId="dp"
        label="L"
        minDate={dayjs('2024-01-01')}
        maxDate={dayjs('2024-12-31')}
        isDisabled
        format="MM/DD/YYYY"
        pickerIcon={icon}
        onChange={() => {}}
      />,
    );
    expect(screen.getByTestId('dp-min')).toHaveTextContent('2024-01-01');
    expect(screen.getByTestId('dp-max')).toHaveTextContent('2024-12-31');
    expect(screen.getByTestId('dp-disabled')).toHaveTextContent('true');
    expect(screen.getByTestId('dp-format')).toHaveTextContent('MM/DD/YYYY');
    expect(screen.getByTestId('custom-icon')).toBeInTheDocument();
  });
});
