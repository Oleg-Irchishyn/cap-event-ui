import { LineItemRow } from '@/app/new/LineItems/types';
import { isCapEventLineItemsFilled } from '../isFundGroupLineItemsFilled';

describe('isCapEventLineItemsFilled', () => {
  it('returns true when all lineitems are filled', () => {
    const items: LineItemRow[] = [
      {
        capitalCategory: 'A',
        callDistributionReason: 'Reason',
        defaultDescription: 'Desc',
        insideCommitment: 'comm',
        allocationBasis: 'commitment',
        amount: 123,
        id: 'id',
        investment: 'investment',
      },
      {
        capitalCategory: 'B',
        callDistributionReason: 'Reason 1',
        defaultDescription: 'Desc 1',
        insideCommitment: 'comm 1',
        allocationBasis: 'commitment 1',
        amount: 1234,
        id: 'id',
        investment: 'investment_1s',
      },
    ];

    expect(isCapEventLineItemsFilled(items)).toBe(true);
  });

  it('returns false when a string field is empty', () => {
    const items: LineItemRow[] = [
      {
        capitalCategory: '',
        callDistributionReason: 'Reason',
        defaultDescription: 'Desc',
        insideCommitment: 'comm',
        allocationBasis: 'commitment',
        amount: 123,
        id: 'id',
        investment: 'investment',
      },
    ];

    expect(isCapEventLineItemsFilled(items)).toBe(false);
  });

  it('returns false when all fields are empty', () => {
    const items: LineItemRow[] = [
      {
        capitalCategory: '',
        callDistributionReason: '',
        defaultDescription: '',
        insideCommitment: '',
        allocationBasis: '',
        amount: 0,
        id: '',
        investment: '',
      },
    ];

    expect(isCapEventLineItemsFilled(items)).toBe(false);
  });
});
