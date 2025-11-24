import { formatAmount } from '@/utils/formatAmount';

describe('formatAmount', () => {
  it('should format positive integer with comas and two decimals', () => {
    expect(formatAmount(1234567)).toBe('1,234,567.00');
  });

  it('should format positive floats with comas and two decimals', () => {
    expect(formatAmount(1234567.89)).toBe('1,234,567.89');
  });

  it('should format negative integer with parentheses and two decimals', () => {
    expect(formatAmount(-1234567)).toBe('(1,234,567.00)');
  });

  it('should format positive floats with parentheses and two decimals', () => {
    expect(formatAmount(-1234567.89)).toBe('(1,234,567.89)');
  });

  it('should return "0.00" for zero', () => {
    expect(formatAmount(0)).toBe('0.00');
  });

  it('should return "-" for undefined, null, NaN', () => {
    expect(formatAmount(undefined as unknown as number)).toBe('-');
    expect(formatAmount(null as unknown as number)).toBe('-');
    expect(formatAmount(NaN)).toBe('-');
  });

  it('should format small numbers correctly', () => {
    expect(formatAmount(12.3)).toBe('12.30');
    expect(formatAmount(-12.3)).toBe('(12.30)');
  });
});
