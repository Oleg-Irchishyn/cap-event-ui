import { LineItemRow, Investment } from '@/app/new/LineItems/types';

export const isRowEmpty = (data: LineItemRow) => {
  const inv = (data as { investment?: string | Investment }).investment;
  const isInvestmentEmpty =
    !inv || (typeof inv === 'string' ? inv.trim() === '' : String(inv?.id ?? '').trim() === '');
  return (
    data.capitalCategory === '' &&
    data.callDistributionReason === '' &&
    data.defaultDescription === '' &&
    data.insideCommitment === '' &&
    isInvestmentEmpty &&
    data.allocationBasis === '' &&
    data.amount === 0
  );
};
