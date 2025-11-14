import { Account } from '@/clients/ReferenceData';
import { LineItemRow } from '@/app/new/LineItems/types';
import { formatNumberToAmount } from '@/utils/formatNumberToAmount';

export const getReasons = (selectedCategory: string, accounts: Account[]) => {
  return Array.from(
    new Set(
      accounts
        .filter(
          (account) =>
            account.capitalCategory === selectedCategory && account.callDistributionReason,
        )
        .map((account) => account.callDistributionReason),
    ),
  );
};

export const getBySelectedCategoryAndReason = (
  selectedCategory: string,
  selectedReason: string,
  keyValueToReturn: string,
  accounts: Account[],
) => {
  return Array.from(
    new Set(
      accounts
        .filter(
          (account) =>
            account.capitalCategory === selectedCategory &&
            account.callDistributionReason === selectedReason &&
            account[keyValueToReturn as keyof Account],
        )
        .map((account) => account[keyValueToReturn as keyof Account]),
    ),
  );
};

export const hasRequiredFieldsForPreview = (data: LineItemRow) => {
  return (
    data.capitalCategory !== '' &&
    data.callDistributionReason !== '' &&
    data.defaultDescription !== '' &&
    data.insideCommitment !== '' &&
    data.allocationBasis !== '' &&
    data.amount !== 0
  );
};

export const isOtherRowEmpty = (data: LineItemRow) =>
  data.accountName === '' &&
  data.defaultDescription === '' &&
  data.insideCommitment === '' &&
  data.investment === '';

export const formatValue = (value: number | string, isTotalRowAmount: boolean = false) => {
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(numValue)) return '';
  if (numValue === null) return '';
  if (numValue === 0 && isTotalRowAmount) return '0';
  if (numValue === 0) return '';

  const formValue = formatNumberToAmount(Math.abs(numValue));
  const isNegative = numValue < 0;

  return isNegative ? `($${formValue})` : `$${formValue}`;
};

export const getKeyValuesByAccountName = (
  accountName: string,
  keyValueToReturn: string,
  accounts: Account[],
) => {
  return Array.from(
    new Set(
      accounts
        .filter((account) => account.accountName === accountName)
        .map((account) => account[keyValueToReturn as keyof Account]),
    ),
  );
};
