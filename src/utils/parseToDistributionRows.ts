import { DistributionRow } from '@/app/new/allocation-distribution/types';
import { CapEventLineItemResponse, InvestorEntry } from '@/clients/CapEventPackage';

export const parseToDistributionRows = (items: unknown): DistributionRow[] => {
  const array = (Array.isArray(items) ? items : []) as CapEventLineItemResponse[];
  return array.flatMap((item, itemIndex) => {
    const entityId = item?.entity?.id ?? '';
    const entityName = item?.entity?.name ?? '';
    const description = item?.account?.description ?? '';
    const investmentTitle = item?.investment?.title ?? '';
    const investmentName = item?.investment?.name ?? '';
    const lineItemId = item?.capEventLineItemId ?? '';
    const entries: InvestorEntry[] = Array.isArray(item && item.plInvestorEntries)
      ? (item.plInvestorEntries as InvestorEntry[])
      : [];
    return entries.map((inv, idx: number) => ({
      id: `${lineItemId}-${itemIndex}-${inv.customerId ?? ''}-${inv.investor ?? ''}-${idx}`,
      investor: inv.investor || '',
      entityId,
      entityName,
      description,
      investmentTitle,
      investmentName,
      dataPoints: inv.dataPoints,
      allocatedAmount: inv.allocatedAmount || 0,
      isAggregated: inv.isAggregated || false,
    }));
  });
};
