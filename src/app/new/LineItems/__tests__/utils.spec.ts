import {
  getReasons,
  getBySelectedCategoryAndReason,
  isRowEmpty,
  formatValue,
  getKeyValuesByAccountName,
} from '../utils';
import { Account } from '@/clients/ReferenceData';
import { LineItemRow } from '@/app/new/LineItems/types';
import { OtherAccountFields } from '@/app/new/LineItems/const';

describe('LineItems/utils', () => {
  const mockAccounts: Account[] = [
    {
      capitalCategory: 'Category A',
      callDistributionReason: 'Reason 1',
      defaultDescription: 'Description 1',
      insideCommitment: 'Inside 1',
      accountName: 'Account 1',
    },
    {
      capitalCategory: 'Category A',
      callDistributionReason: 'Reason 2',
      defaultDescription: 'Description 2',
      insideCommitment: 'Inside 2',
      accountName: 'Account 1',
    },
    {
      capitalCategory: 'Category B',
      callDistributionReason: 'Reason 1',
      defaultDescription: 'Description 3',
      insideCommitment: 'Inside 3',
      accountName: 'Account 2',
    },
    {
      capitalCategory: 'Category A',
      callDistributionReason: 'Reason 1',
      defaultDescription: 'Description 4',
      insideCommitment: 'Inside 4',
      accountName: 'Account 1',
    },
    {
      capitalCategory: 'Category A',
      callDistributionReason: '',
      defaultDescription: 'Description 5',
      insideCommitment: 'Inside 5',
      accountName: 'Account 1',
    },
  ];

  const mockedEmptyRow = {
    capitalCategory: '',
    callDistributionReason: '',
    defaultDescription: '',
    insideCommitment: '',
    investment: '',
    allocationBasis: '',
    amount: 0,
  } as LineItemRow;

  const mockedPartiallyRow = {
    capitalCategory: '',
    callDistributionReason: 'Value 1',
    defaultDescription: '',
    insideCommitment: '',
    investment: '',
    allocationBasis: '',
    amount: 0,
  } as LineItemRow;

  const mockedRowWithSpaces = {
    capitalCategory: ' ',
    callDistributionReason: ' ',
    defaultDescription: ' ',
    insideCommitment: ' ',
    investment: ' ',
    allocationBasis: ' ',
    amount: 0,
  } as LineItemRow;

  describe('getReasons', () => {
    it('should return unique reasons for a specific category', () => {
      const result = getReasons('Category A', mockAccounts);

      expect(result).toEqual(['Reason 1', 'Reason 2']);
    });

    it('should return empty array when no accounts match the category', () => {
      const result = getReasons('Non-existent Category', mockAccounts);

      expect(result).toEqual([]);
    });

    it('should filter out accounts with empty callDistributionReason', () => {
      const result = getReasons('Category A', mockAccounts);

      expect(result).not.toContain('');
      expect(result).toHaveLength(2);
    });
  });

  describe('getBySelectedCategoryAndReason', () => {
    it('should return unique values for a specific category and reason combination', () => {
      const result = getBySelectedCategoryAndReason(
        'Category A',
        'Reason 1',
        'defaultDescription',
        mockAccounts,
      );

      expect(result).toEqual(['Description 1', 'Description 4']);
    });

    it('should return empty array when no accounts match the criteria', () => {
      const result = getBySelectedCategoryAndReason(
        'Category A',
        'Non-existent Reason',
        'defaultDescription',
        mockAccounts,
      );

      expect(result).toEqual([]);
    });

    it('should work with different key values', () => {
      const result = getBySelectedCategoryAndReason(
        'Category A',
        'Reason 1',
        'insideCommitment',
        mockAccounts,
      );

      expect(result).toEqual(['Inside 1', 'Inside 4']);
    });
  });

  describe('isRowEmpty', () => {
    it('should return true for empty row', () => {
      const result = isRowEmpty(mockedEmptyRow);
      expect(result).toEqual(true);
    });

    it('should return false for not empty row', () => {
      const result = isRowEmpty(mockedPartiallyRow);
      expect(result).toEqual(false);
    });
  });

  describe('extra cases for isRowEmpty', () => {
    it('should treat whitespace-only strings as non-empty but amount 0 prevents "filled"', () => {
      expect(isRowEmpty(mockedRowWithSpaces)).toEqual(false);
    });
  });

  describe('formatValue', () => {
    it('should return empty string for non-numeric input', () => {
      expect(formatValue('not_a_number')).toEqual('');
    });
  });

  describe('getKeyValuesByAccountName', () => {
    it('should return accounts keys based on selected account name', () => {
      const accountName1 = 'Account 1';
      const accountName2 = 'Account 2';
      const keyValueToReturn = OtherAccountFields.defaultDescription;
      const result1 = getKeyValuesByAccountName(accountName1, keyValueToReturn, mockAccounts);
      const result2 = getKeyValuesByAccountName(accountName2, keyValueToReturn, mockAccounts);

      expect(result1).toHaveLength(4);
      expect(result2).toEqual(['Description 3']);
    });
  });
});
