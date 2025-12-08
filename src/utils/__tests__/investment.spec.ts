import {
  normalizeCategory,
  isInvestmentRequiredForCategory,
  isLineItemRowValid,
  isFundGroupRowValid,
} from '../investment';
import type { LineItemRow } from '@/app/new/LineItems/types';

describe('investment utils', () => {
  describe('normalizeCategory', () => {
    it('normalizes dashes, spaces, trims and lowercases', () => {
      expect(normalizeCategory(' Dist – ROC ')).toBe('dist - roc'); // en-dash -> hyphen
      expect(normalizeCategory('Cont  —  ROE')).toBe('cont - roe'); // em-dash and multiple spaces
      expect(normalizeCategory('Cont - Investments')).toBe('cont - investments');
      expect(normalizeCategory('')).toBe('');
      expect(normalizeCategory(undefined)).toBe('');
    });
  });

  describe('isInvestmentRequiredForCategory', () => {
    it('returns true for categories in mandatory list (normalized)', () => {
      expect(isInvestmentRequiredForCategory('Dist - ROC')).toBe(true); // normalized match
      expect(isInvestmentRequiredForCategory('Cont – ROC')).toBe(true); // en-dash variant
      expect(isInvestmentRequiredForCategory('Dist - Gain')).toBe(true);
      expect(isInvestmentRequiredForCategory('Cont - Investments')).toBe(true);
    });

    it('returns false for categories not in mandatory list', () => {
      expect(isInvestmentRequiredForCategory('Cont - Management fees')).toBe(false);
      expect(isInvestmentRequiredForCategory('Unknown Category')).toBe(false);
      expect(isInvestmentRequiredForCategory(undefined)).toBe(false);
    });
  });

  describe('isLineItemRowValid', () => {
    const baseRow: LineItemRow = {
      id: '1',
      capitalCategory: 'Dist - ROC',
      callDistributionReason: 'Permanent ROC',
      defaultDescription: 'Return of capital',
      insideCommitment: 'Yes',
      investment: { id: '123', name: 'Investment A' },
      allocationBasis: 'Commitment',
      amount: 100,
    } as unknown as LineItemRow;

    it('validates mandatory fields and amount', () => {
      expect(isLineItemRowValid(baseRow)).toBe(true);

      expect(
        isLineItemRowValid({
          ...baseRow,
          amount: 0,
        }),
      ).toBe(false);

      expect(
        isLineItemRowValid({
          ...baseRow,
          defaultDescription: '',
        }),
      ).toBe(false);
    });

    it('requires investment when category is in mandatory list', () => {
      expect(
        isLineItemRowValid({
          ...baseRow,
          investment: { id: '' },
        }),
      ).toBe(false);
    });

    it('does not require investment for non-mandatory categories', () => {
      const nonMandatoryRow: LineItemRow = {
        ...baseRow,
        capitalCategory: 'Cont - Management fees',
        investment: { id: '' },
      } as unknown as LineItemRow;
      expect(isLineItemRowValid(nonMandatoryRow)).toBe(true);
    });
  });

  describe('isFundGroupRowValid', () => {
    const USER_PROVIDED_OPTION = 'User-Provided';
    const baseRow: LineItemRow = {
      id: 'fg-1',
      capitalCategory: 'Dist - ROC',
      callDistributionReason: 'Permanent ROC',
      defaultDescription: 'Return of capital',
      insideCommitment: 'Yes',
      investment: { id: '123', name: 'Investment A' },
      allocationBasis: 'Commitment',
      amount: 100,
    } as unknown as LineItemRow;

    it('returns true for fully valid FG row', () => {
      expect(isFundGroupRowValid(baseRow, USER_PROVIDED_OPTION)).toBe(true);
    });

    it('returns false when amount is 0 and basis is not User-Provided', () => {
      const row = {
        ...baseRow,
        amount: 0,
        allocationBasis: 'Commitment',
      } as unknown as LineItemRow;
      expect(isFundGroupRowValid(row, USER_PROVIDED_OPTION)).toBe(false);
    });

    it('returns true when amount is 0 but basis is User-Provided', () => {
      const row = {
        ...baseRow,
        amount: 0,
        allocationBasis: USER_PROVIDED_OPTION,
      } as unknown as LineItemRow;
      expect(isFundGroupRowValid(row, USER_PROVIDED_OPTION)).toBe(true);
    });

    it('does not require investment for non-mandatory category', () => {
      const row = {
        ...baseRow,
        capitalCategory: 'Cont - Management fees',
        investment: '',
      } as unknown as LineItemRow;
      expect(isFundGroupRowValid(row, USER_PROVIDED_OPTION)).toBe(true);
    });

    it('requires investment for mandatory category', () => {
      const row = { ...baseRow, investment: '' } as unknown as LineItemRow;
      expect(isFundGroupRowValid(row, USER_PROVIDED_OPTION)).toBe(false);
    });

    it('returns false when any required base field is missing', () => {
      const row = { ...baseRow, defaultDescription: '' } as unknown as LineItemRow;
      expect(isFundGroupRowValid(row, USER_PROVIDED_OPTION)).toBe(false);
    });
  });
});
// EOF
