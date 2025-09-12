import dayjs from 'dayjs';
import { parseValidDate } from '../datePickerUtils';
import { PickerValue } from '@mui/x-date-pickers/internals';

describe('parseValidDate', () => {
  test('returns null for null input', () => {
    expect(parseValidDate(null)).toBeNull();
  });

  test('returns null for invalid date string', () => {
    expect(parseValidDate('not-a-date' as unknown as PickerValue)).toBeNull();
  });

  test('parses Dayjs value into a Date', () => {
    const value = dayjs('2025-06-15');
    const result = parseValidDate(value);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe(value.toDate().getTime());
  });

  test('parses native Date value', () => {
    const native = new Date('2025-03-04T12:34:56.000Z') as unknown as PickerValue;
    const result = parseValidDate(native);
    expect(result).toBeInstanceOf(Date);
    expect(result?.getTime()).toBe((native as unknown as Date).getTime());
  });

  test('parses ISO string value', () => {
    const result = parseValidDate('2025-01-01' as unknown as PickerValue);
    expect(result).toBeInstanceOf(Date);
    expect(dayjs(result as Date).format('YYYY-MM-DD')).toBe('2025-01-01');
  });
});
