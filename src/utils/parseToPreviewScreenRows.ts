import { PreviewScreenRow } from '@/app/preview-screen/types';
import { CapEventAggregatedLineItem, InvestorEntry } from '@/clients/CapEventPackage';

export const parseToPreviewScreenRows = (
  items: unknown,
  allocation: { entityId: string; lineItemId: string; response: InvestorEntry[] }[] = [],
): PreviewScreenRow[] => {
  const array = (Array.isArray(items) ? items : []) as CapEventAggregatedLineItem[];
  return array.flatMap((item, itemIndex) => {
    const entityId = item?.entity?.id ?? '';
    const entityName = item?.entity?.name ?? '';
    // Extract the investor entries array from the line item
    // Each line item contains multiple investor entries that need to be converted to rows
    const entries: InvestorEntry[] = Array.isArray(item && item.plInvestorEntries)
      ? (item.plInvestorEntries as InvestorEntry[])
      : [];
    return entries.flatMap((inv, idx: number) => {
      if (!inv.isAggregated) {
        return [];
      }

      const dataByEntity = allocation.find(
        (allocationItem) => allocationItem.entityId === entityId,
      );
      const lineItemId = dataByEntity?.lineItemId;
      const allocatedData = dataByEntity?.response.find((res) => res.customerId === inv.customerId);

      // Account and investment information is stored within each InvestorEntry
      // For aggregated entries, these fields are null
      const description = inv.account?.defaultDescription ?? '';
      const investmentTitle = inv.investment?.title ?? '';
      const investmentName = inv.investment?.name ?? '';

      return [
        {
          id: `${entityId}-${itemIndex}-${inv.customerId ?? ''}-${inv.investor ?? ''}-${idx}`,
          investor: inv.investor ?? '',
          investorId: inv.customerId ?? '',
          investorName: inv.customerName ?? '',
          classID: inv.classID ?? '',
          additionalInvestorType: inv.additionalInvestorType ?? '',
          entityId,
          entityName,
          description,
          investmentTitle,
          investmentName,
          dataPoints: inv.dataPoints,
          allocatedAmount: inv.allocatedAmount || 0,
          isAggregated: inv.isAggregated || false,
          commitment: inv?.commitment ?? 0,
          [`${lineItemId}-commitment`]: allocatedData?.commitment ?? '-',
          [`${lineItemId}-investedCapital`]: allocatedData?.investedCapital ?? '-',
          [`${lineItemId}-unfunded`]: allocatedData?.unfunded ?? '-',
          [`${lineItemId}-allocatedAmount`]: allocatedData?.allocatedAmount ?? '-',
          lineItemId,
        },
      ];
    });
  });
};
