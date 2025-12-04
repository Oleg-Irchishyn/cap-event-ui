import { LineItemRow } from '@/app/new/LineItems/types';
import { investmentMandatoryCategories } from '@/app/new/LineItems/const';
import { NORMALIZE_DASHES_REGEX, NORMALIZE_SPACES_REGEX } from '@/const/regExps';

export const normalizeCategory = (value?: string): string =>
  (value ?? '')
    .replace(NORMALIZE_DASHES_REGEX, '-')
    .replace(NORMALIZE_SPACES_REGEX, ' ')
    .trim()
    .toLowerCase();

export const isInvestmentRequiredForCategory = (category?: string): boolean => {
  const normalizedMandatory = investmentMandatoryCategories.map((c) => normalizeCategory(c));
  return normalizedMandatory.includes(normalizeCategory(category));
};

export const isLineItemRowValid = (row: LineItemRow): boolean => {
  const hasRequiredBaseFields =
    !!row.capitalCategory &&
    !!row.callDistributionReason &&
    !!row.defaultDescription &&
    !!row.insideCommitment &&
    !!row.allocationBasis;

  const hasValidAmount = row.amount !== null && row.amount !== undefined && row.amount !== 0;

  const isInvestmentRequired = isInvestmentRequiredForCategory(row.capitalCategory);
  const hasValidInvestment = !isInvestmentRequired || !!row.investment.id;

  return hasRequiredBaseFields && hasValidAmount && hasValidInvestment;
};

export const isFundGroupRowValid = (row: LineItemRow, userProvidedOptionLabel: string): boolean => {
  const hasRequiredBaseFields =
    !!row.capitalCategory &&
    !!row.callDistributionReason &&
    !!row.defaultDescription &&
    !!row.insideCommitment &&
    !!row.allocationBasis;

  // For FG rows, amount is optional when allocation basis is "User-Provided"
  const amountOptional = String(row.allocationBasis) === String(userProvidedOptionLabel);
  const hasValidAmount =
    amountOptional || (row.amount !== null && row.amount !== undefined && row.amount !== 0);

  const isInvestmentRequired = isInvestmentRequiredForCategory(row.capitalCategory);
  const hasValidInvestment = !isInvestmentRequired || !!row.investment.id;

  return hasRequiredBaseFields && hasValidAmount && hasValidInvestment;
};
