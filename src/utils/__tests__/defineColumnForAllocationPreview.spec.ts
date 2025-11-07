import { defineColumnForAllocationPreview } from '@/utils/definedColumnForAllocationPreview';

describe('defineColumnForAllocationPreview', () => {
  it('should return "unfunded" when allocation is "unfunded"', () => {
    expect(defineColumnForAllocationPreview('unfunded')).toBe('unfunded');
  });

  it('should return "unfunded" when case differs', () => {
    expect(defineColumnForAllocationPreview('unFUNDed')).toBe('unfunded');
  });

  it('should return "investedCapital" when allocation includes "contribution"', () => {
    expect(defineColumnForAllocationPreview('Capital Contribution Deal')).toBe('investedCapital');
  });

  it('should return "investedCapital" when allocation is "contribution"', () => {
    expect(defineColumnForAllocationPreview('contribution')).toBe('investedCapital');
  });

  it('should return "commitment" for other values', () => {
    expect(defineColumnForAllocationPreview('random value')).toBe('commitment');
  });
});
