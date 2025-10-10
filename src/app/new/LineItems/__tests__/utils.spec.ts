import { getReasons, getBySelectedCategoryAndReason } from '../utils';
import { Account } from '@/clients/ReferenceData';

describe('LineItems/utils', () => {
  const mockAccounts: Account[] = [
    {
      capitalCategory: 'Category A',
      callDistributionReason: 'Reason 1',
      defaultDescription: 'Description 1',
      insideCommitment: 'Inside 1',
    } as Account,
    {
      capitalCategory: 'Category A',
      callDistributionReason: 'Reason 2',
      defaultDescription: 'Description 2',
      insideCommitment: 'Inside 2',
    } as Account,
    {
      capitalCategory: 'Category B',
      callDistributionReason: 'Reason 1',
      defaultDescription: 'Description 3',
      insideCommitment: 'Inside 3',
    } as Account,
    {
      capitalCategory: 'Category A',
      callDistributionReason: 'Reason 1',
      defaultDescription: 'Description 4',
      insideCommitment: 'Inside 4',
    } as Account,
    {
      capitalCategory: 'Category A',
      callDistributionReason: '',
      defaultDescription: 'Description 5',
      insideCommitment: 'Inside 5',
    } as Account,
  ];

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
});
