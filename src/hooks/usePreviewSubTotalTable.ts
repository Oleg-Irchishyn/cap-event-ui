import type { SubTotalTableRow } from '@/app/preview-screen/types';
import { AMOUNT_FIELD, COMMITMENT_FIELD, ENTITY_NAME_FIELD } from '@/const/previewScreen';
import type { ColDef, PostSortRowsParams } from 'ag-grid-community';
import { useCallback, useMemo } from 'react';

const TOTAL_ROW_ID = 'total-row';
const TOTAL_ROW_NAME = 'Grand Total';

type UsePreviewSubTotalTableProps = {
  rows: SubTotalTableRow[];
  isLoading: boolean;
  columnDefs: ColDef[];
};

export const usePreviewSubTotalTable = ({
  rows,
  isLoading,
  columnDefs,
}: UsePreviewSubTotalTableProps) => {
  const addTotalRow = (rowsData: SubTotalTableRow[]) => {
    const totals = rowsData.reduce<Record<string, number>>(
      (acc, row) => {
        Object.entries(row).forEach(([key, value]) => {
          if (key === 'id' || key === ENTITY_NAME_FIELD) return;
          if (typeof value !== 'number' || Number.isNaN(value)) return;

          acc[key] = (acc[key] ?? 0) + value;
        });

        return acc;
      },
      {
        [COMMITMENT_FIELD]: 0,
        [AMOUNT_FIELD]: 0,
      },
    );

    const totalRow: SubTotalTableRow = {
      id: TOTAL_ROW_ID,
      [ENTITY_NAME_FIELD]: TOTAL_ROW_NAME,
      allocatedAmount: totals.allocatedAmount ?? 0,
      commitment: totals[COMMITMENT_FIELD] ?? 0,
      ...totals,
      isTotalRow: true,
    };

    return [...rowsData, totalRow];
  };

  const displayRows = useMemo(() => {
    if (!isLoading || (Array.isArray(rows) && rows.length > 0)) {
      return addTotalRow(rows) ?? [];
    }

    const placeholderCount = columnDefs.length;
    const placeholders: SubTotalTableRow[] = Array.from({ length: placeholderCount }).map(
      (_, index) =>
        ({
          id: `skeleton-${index}`,
        }) as SubTotalTableRow,
    );
    return placeholders;
  }, [columnDefs.length, isLoading, rows]);

  const handlePostSortRows = useCallback((params: PostSortRowsParams) => {
    const { nodes } = params;
    const totalRowNode = nodes.find((node) => node.data?.isTotalRow);

    if (totalRowNode) {
      const totalRowIndex = nodes.indexOf(totalRowNode);
      nodes.splice(totalRowIndex, 1);
      nodes.push(totalRowNode);
    }
  }, []);

  return {
    displayRows,
    handlePostSortRows,
  };
};
