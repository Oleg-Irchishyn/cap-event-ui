import { PreviewScreenRow } from '@/app/preview-screen/types';
import { CapEventAggregatedLineItem, InvestorEntry } from '@/clients/CapEventPackage';

type AllocationItem = {
  entityId: string;
  lineItemId: string;
  response: InvestorEntry[];
  isMgmtFee?: boolean;
};

export const parseToPreviewScreenRows = (
  items: unknown,
  allocation: AllocationItem[] = [],
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

      const entityAllocations = allocation.filter(
        (allocationItem) => allocationItem.entityId === entityId,
      );
      const entityLineItemIds = entityAllocations
        .filter((item) => !item.isMgmtFee && item.lineItemId)
        .map((item) => item.lineItemId);

      const allocationFields = entityAllocations.reduce<
        Record<string, string | number | boolean | undefined>
      >((acc, allocationItem) => {
        const lineItemId = allocationItem.lineItemId;
        if (!lineItemId) return acc;

        const investorData = allocationItem.response.find(
          (res) => res.customerId === inv.customerId,
        );

        if (allocationItem.isMgmtFee) {
          acc[`${lineItemId}-mgmtFee`] = investorData?.managementFee ?? '-';
          acc[`${lineItemId}-mgmtFee-allocatedAmount`] = investorData?.allocatedAmount ?? '-';
          acc[`${lineItemId}-commitment`] = investorData?.commitment ?? '-';
          acc[`${lineItemId}-allocatedAmount`] = investorData?.allocatedAmount ?? '-';
          return acc;
        }

        acc[`${lineItemId}-commitment`] = investorData?.commitment ?? '-';
        acc[`${lineItemId}-investedCapital`] = investorData?.investedCapital ?? '-';
        acc[`${lineItemId}-unfunded`] = investorData?.unfunded ?? '-';
        acc[`${lineItemId}-allocatedAmount`] = investorData?.allocatedAmount ?? '-';
        return acc;
      }, {});

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
          ...allocationFields,
          lineItemIds: entityLineItemIds,
        },
      ];
    });
  });
};
