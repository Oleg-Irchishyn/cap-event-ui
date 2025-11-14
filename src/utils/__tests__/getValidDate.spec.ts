import { getValidDate } from '../getValidDate';

describe('getValidDate', () => {
  it('returns the same Date instance when value is a valid Date', () => {
    const d = new Date('2024-01-15');
    const res = getValidDate(d);
    expect(res).toBeInstanceOf(Date);
    expect(res?.getTime()).toBe(d.getTime());
  });

  it('returns null for invalid Date instance', () => {
    const invalidDate = new Date('invalid-date');
    const res = getValidDate(invalidDate);
    expect(res).toBeNull();
  });

  it('parses and returns Date for valid date string', () => {
    const res = getValidDate('2025-02-01');
    expect(res).toBeInstanceOf(Date);
    expect(res?.getFullYear()).toBe(2025);
    expect((res as Date).getMonth()).toBe(1);
    expect((res as Date).getDate()).toBe(1);
  });

  it('returns null for non-parsable string', () => {
    const res = getValidDate('MM/DD/YYYY');
    expect(res).toBeNull();
  });

  it('returns null for null/undefined/other types', () => {
    expect(getValidDate(null as unknown as Date)).toBeNull();
    expect(getValidDate(undefined as unknown as Date)).toBeNull();
    expect(getValidDate(123 as unknown as Date)).toBeNull();
  });
});
