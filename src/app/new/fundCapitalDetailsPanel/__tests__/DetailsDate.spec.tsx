import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import dayjs, { Dayjs } from 'dayjs';
import DetailsDate from '../DetailsDate';
import { entityDatesStore } from '@/stores';

type DateType = 'notice' | 'due';

jest.mock('@/app/components/DatePicker', () => {
  type MockProps = {
    label?: string;
    defaultValue?: Dayjs | null;
    minDate?: Dayjs;
    maxDate?: Dayjs;
    onChange: (value: unknown) => void;
    testId: string;
  };
  const MockDatePicker = ({
    label,
    defaultValue,
    minDate,
    maxDate,
    onChange,
    testId,
  }: MockProps) => (
    <div>
      <div data-testid={`${testId}-DatePicker-Label`}>{label}</div>
      <div data-testid={`${testId}-DatePicker-Value`}>
        {defaultValue ? dayjs(defaultValue).format('YYYY-MM-DD') : 'null'}
      </div>
      <div data-testid={`${testId}-DatePicker-Min`}>
        {minDate ? dayjs(minDate).format('YYYY-MM-DD') : 'null'}
      </div>
      <div data-testid={`${testId}-DatePicker-Max`}>
        {maxDate ? dayjs(maxDate).format('YYYY-MM-DD') : 'null'}
      </div>
      <button onClick={() => onChange(dayjs('2025-01-02'))}>set-valid</button>
      <button onClick={() => onChange(null)}>set-null</button>
    </div>
  );
  MockDatePicker.displayName = 'MockDatePicker';
  return { __esModule: true, default: MockDatePicker };
});

jest.mock('@/stores', () => ({
  capEventSettingsStore: { fundEntities: [] },
  entityDatesStore: {
    getEntityNoticeDate: jest.fn(),
    getEntityDueDate: jest.fn(),
    setEntityNoticeDate: jest.fn(),
    calculateAndSetEntityDueDate: jest.fn(),
    setDifferentDatesState: jest.fn(),
    setEntityDueDateManually: jest.fn(),
    noticeDate: null,
  },
}));

const renderComponent = (props: Partial<React.ComponentProps<typeof DetailsDate>> = {}) => {
  return render(
    <DetailsDate
      entityLabel="Fund A"
      dateType={'notice' as DateType}
      testId="details-notice-date"
      {...props}
    />,
  );
};

describe('DetailsDate', () => {
  afterEach(() => {
    jest.clearAllMocks();
    entityDatesStore.noticeDate = null;
  });

  test('renders Notice Date label and default value from store', () => {
    const date = new Date(2025, 0, 1);
    (entityDatesStore.getEntityNoticeDate as jest.Mock).mockReturnValue(date);
    renderComponent({ dateType: 'notice', testId: 'details-notice-date' });
    expect(screen.getByTestId('details-notice-date-DatePicker-Label')).toHaveTextContent(
      'Notice Date',
    );
    expect(screen.getByTestId('details-notice-date-DatePicker-Value')).toHaveTextContent(
      '2025-01-01',
    );
  });

  test('renders Due Date label with minDate based on notice date', () => {
    const notice = new Date(2025, 0, 10);
    (entityDatesStore.getEntityNoticeDate as jest.Mock).mockReturnValue(notice);
    (entityDatesStore.getEntityDueDate as jest.Mock).mockReturnValue(null);
    renderComponent({ dateType: 'due', testId: 'details-due-date' });
    expect(screen.getByTestId('details-due-date-DatePicker-Label')).toHaveTextContent('Due Date');
    expect(screen.getByTestId('details-due-date-DatePicker-Min')).toHaveTextContent('2025-01-10');
  });

  test('sets maxDate when NOTICE type (not null)', () => {
    (entityDatesStore.getEntityNoticeDate as jest.Mock).mockReturnValue(null);
    renderComponent({ dateType: 'notice', testId: 'details-notice-date' });
    const max = screen.getByTestId('details-notice-date-DatePicker-Max').textContent as string;
    expect(max).not.toBe('null');
  });

  test('on valid change for NOTICE updates notice and due date, calls callback', () => {
    const onDateChange = jest.fn();
    (entityDatesStore.getEntityNoticeDate as jest.Mock).mockReturnValue(null);
    renderComponent({ dateType: 'notice', testId: 'details-notice-date', onDateChange });
    fireEvent.click(screen.getByText('set-valid'));
    expect(entityDatesStore.setEntityNoticeDate).toHaveBeenCalled();
    expect(entityDatesStore.calculateAndSetEntityDueDate).toHaveBeenCalled();
    expect(entityDatesStore.setDifferentDatesState).toHaveBeenCalled();
    expect(onDateChange).toHaveBeenCalledWith(expect.any(Date));
  });

  test('on null change for DUE clears manual due date and calls callback with null', () => {
    const onDateChange = jest.fn();
    (entityDatesStore.getEntityDueDate as jest.Mock).mockReturnValue(null);
    renderComponent({ dateType: 'due', testId: 'details-due-date', onDateChange });
    fireEvent.click(screen.getByText('set-null'));
    expect(entityDatesStore.setEntityDueDateManually).toHaveBeenCalledWith('Fund A', null);
    expect(onDateChange).toHaveBeenCalledWith(null);
  });
});
