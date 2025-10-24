import { useMemo } from 'react';
import { AccountFields, LineItemTypes } from '@/app/new/LineItems/const';
import { LineItemRow } from '@/app/new/LineItems/types';

const NET_CONTRIBUTIONS_LABEL = 'Net Contributions';
const NET_DISTRIBUTIONS_LABEL = 'Net Distributions';
const NET_ZERO_LABEL = 'Net Zero';
const TOTAL_ROW_ID = 'total-row';

const getTotalLabel = (total: number) => {
  if (total > 0) return NET_CONTRIBUTIONS_LABEL;
  if (total < 0) return NET_DISTRIBUTIONS_LABEL;
  return NET_ZERO_LABEL;
};

export const useAccountsTableRowData = (
  level: string | undefined,
  lineItems: LineItemRow[] = [],
) => {
  const tableData = useMemo(() => {
    if (level !== LineItemTypes.entity) return lineItems || [];

    const validRows = lineItems?.filter((row) => row.id !== TOTAL_ROW_ID) || [];
    const totalAmount = validRows.reduce((sum, row) => sum + (row.amount || 0), 0);
    const totalLabel = getTotalLabel(totalAmount);

    const totalRow = {
      id: TOTAL_ROW_ID,
      [AccountFields.capitalCategory]: totalLabel,
      [AccountFields.amount]: totalAmount,
      isTotalRow: true,
    } as const;

    return [...validRows, totalRow];
  }, [level, lineItems]);

  return tableData;
};

export default useAccountsTableRowData;
