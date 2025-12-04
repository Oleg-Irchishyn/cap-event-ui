import { LineItemRow } from '@/app/new/LineItems/types';
import { isRowEmpty } from '../isRowEmpty';

const mockedEmptyRow = {
  capitalCategory: '',
  callDistributionReason: '',
  defaultDescription: '',
  insideCommitment: '',
  investment: { id: '' },
  allocationBasis: '',
  amount: 0,
} as LineItemRow;

const mockedPartiallyRow = {
  capitalCategory: '',
  callDistributionReason: 'Value 1',
  defaultDescription: '',
  insideCommitment: '',
  investment: { id: '' },
  allocationBasis: '',
  amount: 0,
} as LineItemRow;

const mockedRowWithSpaces = {
  capitalCategory: ' ',
  callDistributionReason: ' ',
  defaultDescription: ' ',
  insideCommitment: ' ',
  investment: { id: ' ' },
  allocationBasis: ' ',
  amount: 0,
} as LineItemRow;

describe('isRowEmpty', () => {
  it('should return true for empty row', () => {
    const result = isRowEmpty(mockedEmptyRow);
    expect(result).toEqual(true);
  });

  it('should return false for not empty row', () => {
    const result = isRowEmpty(mockedPartiallyRow);
    expect(result).toEqual(false);
  });

  it('should treat whitespace-only strings as non-empty but amount 0 prevents "filled"', () => {
    expect(isRowEmpty(mockedRowWithSpaces)).toEqual(false);
  });
});
