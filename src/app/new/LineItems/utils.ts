import { Account } from '@/clients/ReferenceData';

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
