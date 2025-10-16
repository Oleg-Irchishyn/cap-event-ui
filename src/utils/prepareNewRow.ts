import { LineItemRow } from '@/app/new/LineItems/types';
import { LineItemTypes } from '@/app/new/LineItems/const';

let rowIdCounter = 0;

export const prepareNewRow = (level?: string): LineItemRow => {
  const levelSpecificColumns =
    level === LineItemTypes.entity ? { prDate: undefined, prFlag: '' } : {};

  return {
    id: `row-${++rowIdCounter}-${Date.now()}`,
    capitalCategory: '',
    callDistributionReason: '',
    defaultDescription: '',
    insideCommitment: '',
    investment: '',
    amount: 0,
    allocationBasis: '',
    ...levelSpecificColumns,
  };
};
