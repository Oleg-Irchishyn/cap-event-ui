import { LineItemRow } from '@/app/new/LineItems/types';
import { LineItemTypes } from '@/app/new/LineItems/const';
import { uuidv4 } from '@/utils/uuid';

export const prepareNewRow = (level?: string): LineItemRow => {
  const levelSpecificColumns =
    level === LineItemTypes.entity ? { prDate: undefined, prFlag: '', accountName: '' } : {};

  return {
    id: uuidv4(),
    capitalCategory: '',
    callDistributionReason: '',
    defaultDescription: '',
    insideCommitment: '',
    investment: '',
    amount: 0,
    allocationBasis: '',
    accountNo: '',
    ...levelSpecificColumns,
  };
};
