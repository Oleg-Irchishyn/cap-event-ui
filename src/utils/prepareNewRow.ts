import { LineItemRow } from '@/app/new/LineItems/types';

let rowIdCounter = 0;

export const prepareNewRow = (): LineItemRow => {
  return {
    id: `row-${++rowIdCounter}-${Date.now()}`,
    capitalCategory: '',
    callDistributionReason: '',
    defaultDescription: '',
    insideCommitment: '',
    investment: '',
    amount: 0,
    allocationBasis: '',
  };
};
