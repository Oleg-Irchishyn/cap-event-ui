import { prepareNewRow } from '../prepareNewRow';
import { LineItemRow } from '@/app/new/LineItems/types';

describe('prepareNewRow', () => {
  it('should return a LineItemRow with all required fields initialized', () => {
    const result = prepareNewRow();

    expect(result).toEqual({
      id: expect.stringMatching(/^row-\d+-\d+$/),
      capitalCategory: '',
      callDistributionReason: '',
      defaultDescription: '',
      insideCommitment: '',
      investment: '',
      amount: 0,
      allocationBasis: '',
    });
  });

  it('should generate unique IDs for consecutive calls', () => {
    const row1 = prepareNewRow();
    const row2 = prepareNewRow();
    const row3 = prepareNewRow();

    expect(row1.id).not.toBe(row2.id);
    expect(row2.id).not.toBe(row3.id);
    expect(row1.id).not.toBe(row3.id);
  });

  it('should return a valid LineItemRow type with correct data types', () => {
    const result: LineItemRow = prepareNewRow();

    expect(typeof result.id).toBe('string');
    expect(typeof result.capitalCategory).toBe('string');
    expect(typeof result.callDistributionReason).toBe('string');
    expect(typeof result.defaultDescription).toBe('string');
    expect(typeof result.insideCommitment).toBe('string');
    expect(typeof result.investment).toBe('string');
    expect(typeof result.amount).toBe('number');
    expect(typeof result.allocationBasis).toBe('string');
    expect(result.inheritedId).toBeUndefined();
  });
});
