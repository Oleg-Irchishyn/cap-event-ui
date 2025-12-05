import { formatPercents } from '../formatPercents';

describe('formatPercents', () => {
  it('adds .00% to itegers', () => {
    expect(formatPercents(1)).toBe('1.00%');
    expect(formatPercents(2)).toBe('2.00%');
    expect(formatPercents(50)).toBe('50.00%');
  });

  it('adds zero when there is one decimal', () => {
    expect(formatPercents(1.5)).toBe('1.50%');
    expect(formatPercents(50.7)).toBe('50.70%');
  });

  it('keeps full precision when more than two decomals', () => {
    expect(formatPercents(1.5678)).toBe('1.5678%');
    expect(formatPercents(50.711)).toBe('50.711%');
  });

  it('handles numbers with two decimals', () => {
    expect(formatPercents(1.56)).toBe('1.56%');
    expect(formatPercents(50.71)).toBe('50.71%');
  });

  it('handles negative numbers', () => {
    expect(formatPercents(-1.56)).toBe('-1.56%');
    expect(formatPercents(-50.7)).toBe('-50.70%');
    expect(formatPercents(-2.777)).toBe('-2.777%');
  });
});
