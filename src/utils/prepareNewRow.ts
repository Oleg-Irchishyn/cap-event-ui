import { LineItemRow } from '@/app/new/LineItems/types';

export const prepareNewRow = (): LineItemRow => {
  return {
    id: Date.now().toString(),
    capitalCategory: '',
    callDistributionReason: '',
    defaultDescription: '',
    insideCommitment: '',
    investment: '',
    amount: 0,
  };
};
