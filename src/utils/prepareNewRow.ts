import { LineItemRow } from '@/app/new/LineItems/types';
import { LineItemTypes } from '@/app/new/LineItems/const';
import { UUID_TEMPLATE_CHAR_REGEX, UUID_V4_TEMPLATE } from '@/const/regExps';

const uuidv4 = () =>
  UUID_V4_TEMPLATE.replace(UUID_TEMPLATE_CHAR_REGEX, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });

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
    ...levelSpecificColumns,
  };
};
