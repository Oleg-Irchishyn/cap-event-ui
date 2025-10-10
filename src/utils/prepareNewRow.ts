import { LineItemRow } from '@/app/new/LineItems/types';
import { LineItemTypes, YesNoOptions } from '@/app/new/LineItems/const';
import { entityDatesStore } from '@/stores';

let rowIdCounter = 0;

export const prepareNewRow = (level?: string, entityKey?: string): LineItemRow => {
  const prDate = entityDatesStore.getEntityDueDate(entityKey ?? '') || undefined;
  const levelSpecificColumns =
    level === LineItemTypes.entity ? { prDate, prFlag: YesNoOptions[0] } : {};

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
