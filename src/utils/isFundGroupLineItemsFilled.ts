import { LineItemRow } from '@/app/new/LineItems/types';

export const isCapEventLineItemsFilled = (lineItems: LineItemRow[]) => {
  return lineItems.every(
    (lineItem) =>
      lineItem.capitalCategory !== '' &&
      lineItem.callDistributionReason !== '' &&
      lineItem.defaultDescription !== '' &&
      lineItem.insideCommitment !== '' &&
      lineItem.allocationBasis !== '' &&
      lineItem.amount !== 0,
  );
};
