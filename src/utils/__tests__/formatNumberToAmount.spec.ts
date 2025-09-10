import { formatNumberToAmount } from '../formatNumberToAmount';

describe('formatNumberToAmount', () => {
  describe('Basic formatting', () => {
    it('should format positive integers with two decimal places', () => {
      expect(formatNumberToAmount(1000)).toBe('1,000.00');
      expect(formatNumberToAmount(100.25)).toBe('100.25');
      expect(formatNumberToAmount(-1000.5)).toBe('-1,000.50');
      expect(formatNumberToAmount(0)).toBe('0.00');
      expect(formatNumberToAmount(100.125)).toBe('100.13'); // Rounds up
      expect(formatNumberToAmount(100.1)).toBe('100.10');
      expect(formatNumberToAmount(100.99)).toBe('100.99');
      expect(formatNumberToAmount(1234567890)).toBe('1,234,567,890.00');
      expect(formatNumberToAmount(-1234567.89)).toBe('-1,234,567.89');
    });
  });

  describe('Edge cases', () => {
    it('should handle very small numbers', () => {
      expect(formatNumberToAmount(0.01)).toBe('0.01');
      expect(formatNumberToAmount(0.1)).toBe('0.10');
      expect(formatNumberToAmount(0.001)).toBe('0.00'); // Rounds to 0.00
    });

    it('should handle very large numbers', () => {
      expect(formatNumberToAmount(999999999.99)).toBe('999,999,999.99');
      expect(formatNumberToAmount(1000000000)).toBe('1,000,000,000.00');
    });

    it('should handle numbers with trailing zeros', () => {
      expect(formatNumberToAmount(100.0)).toBe('100.00');
      expect(formatNumberToAmount(100.1)).toBe('100.10');
    });
  });

  describe('Rounding behavior', () => {
    it('should round up when the third decimal is 5 or greater', () => {
      expect(formatNumberToAmount(100.125)).toBe('100.13');
      expect(formatNumberToAmount(100.126)).toBe('100.13');
      expect(formatNumberToAmount(100.999)).toBe('101.00');
    });

    it('should round down when the third decimal is less than 5', () => {
      expect(formatNumberToAmount(100.124)).toBe('100.12');
      expect(formatNumberToAmount(100.123)).toBe('100.12');
      expect(formatNumberToAmount(100.001)).toBe('100.00');
    });
  });
});
