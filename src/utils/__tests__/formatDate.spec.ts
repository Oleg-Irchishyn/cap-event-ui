import { formatDate } from '../formatDate';

describe('formatDate', () => {
  it('format a date into yyyy-mm-dd', () => {
    const date = new Date('2025-11-19T10:20:30Z');
    const result = formatDate(date);
    expect(result).toBe('2025-11-19');
  });

  it('pads month and day with zeros', () => {
    const date = new Date('2025-01-05T10:20:30Z');
    const result = formatDate(date);
    expect(result).toBe('2025-01-05');
  });

  it('handles single digit month/days correctly', () => {
    const date = new Date(2025, 0, 9);
    const result = formatDate(date);
    expect(result).toBe('2025-01-09');
  });

  it('returns empty string if undefined', () => {
    const date = undefined;
    const result = formatDate(date);
    expect(result).toBe('');
  });

  it('returns empty string if null', () => {
    const date = null;
    const result = formatDate(date);
    expect(result).toBe('');
  });
});
