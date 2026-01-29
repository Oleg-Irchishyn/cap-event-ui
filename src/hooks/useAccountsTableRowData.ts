import { useMemo } from 'react';
import { AccountFields } from '@/app/new/LineItems/const';
import { LineItemRow } from '@/app/new/LineItems/types';

const NET_CONTRIBUTIONS_LABEL = 'Net Contributions';
const NET_DISTRIBUTIONS_LABEL = 'Net Distributions';
const NET_ZERO_LABEL = 'Net Zero';
const TOTAL_LABEL = 'Total';
const TOTAL_ROW_ID = 'total-row';

const AMOUNT_DECIMAL_PLACES = 2;

const roundToDecimalPlaces = (value: number, decimals: number): number =>
  Math.round(value * 10 ** decimals) / 10 ** decimals;

const getTotalLabel = (total: number | string) => {
  if (typeof total === 'string') return TOTAL_LABEL;
  if (total > 0) return NET_CONTRIBUTIONS_LABEL;
  if (total < 0) return NET_DISTRIBUTIONS_LABEL;
  return NET_ZERO_LABEL;
};

export const useAccountsTableRowData = (lineItems: LineItemRow[] = []) => {
  const tableData = useMemo(() => {
    const validRows = lineItems?.filter((row) => row.id !== TOTAL_ROW_ID) || [];
    const isAnyAmountFilled = validRows.some((row) => row.capitalCategory && row.amount);
    const rawTotal = isAnyAmountFilled
      ? validRows.reduce((sum, row) => sum + (row.amount || 0), 0)
      : '';
    const totalAmount =
      typeof rawTotal === 'number'
        ? roundToDecimalPlaces(rawTotal, AMOUNT_DECIMAL_PLACES)
        : rawTotal;

    const totalLabel = getTotalLabel(totalAmount);

    const totalRow = {
      id: TOTAL_ROW_ID,
      [AccountFields.capitalCategory]: totalLabel,
      [AccountFields.amount]: totalAmount ?? '',
      isTotalRow: true,
    } as const;

    return [...validRows, totalRow];
  }, [lineItems]);

  return tableData;
};

export default useAccountsTableRowData;
