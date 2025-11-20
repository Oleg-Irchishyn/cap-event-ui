import { LineItemRow } from '@/app/new/LineItems/types';
import { prepareNewRow } from '../prepareNewRow';
import { UUID_V4_REGEX } from '@/const/regExps';

jest.mock('@/stores', () => ({
  entityDatesStore: {
    getEntityDueDate: jest.fn(() => new Date('2024-01-01')),
  },
}));

describe('prepareNewRow', () => {
  it('should return a LineItemRow with all required fields initialized', () => {
    const result = prepareNewRow();

    expect(result).toEqual({
      id: expect.stringMatching(UUID_V4_REGEX),
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
    expect(result.inheritedFundGroupLineItemId).toBeUndefined();
  });

  it('should include prFlag when level is entity', () => {
    const result = prepareNewRow('entity');

    expect(result.prFlag).toBe('');
  });

  it('should not include prDate and prFlag when level is not entity', () => {
    const result = prepareNewRow('group');

    expect(result.prDate).toBeUndefined();
    expect(result.prFlag).toBeUndefined();
  });
});
