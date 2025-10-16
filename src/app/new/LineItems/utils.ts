import { Account } from '@/clients/ReferenceData';
import { LineItemRow } from '@/app/new/LineItems/types';

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

export const isRowEmpty = (data: LineItemRow) => {
  return (
    data.capitalCategory === '' &&
    data.callDistributionReason === '' &&
    data.defaultDescription === '' &&
    data.insideCommitment === '' &&
    data.investment === '' &&
    data.allocationBasis === '' &&
    data.amount === 0
  );
};
