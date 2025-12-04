import { LineItemRow } from '@/app/new/LineItems/types';

export const isRowEmpty = (data: LineItemRow) => {
  return (
    data.capitalCategory === '' &&
    data.callDistributionReason === '' &&
    data.defaultDescription === '' &&
    data.insideCommitment === '' &&
    data.investment.id === '' &&
    data.allocationBasis === '' &&
    data.amount === 0
  );
};
