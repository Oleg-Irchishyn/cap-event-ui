'use client';

import { FC, useMemo, useCallback } from 'react';
import { PostSortRowsParams } from 'ag-grid-community';
import '@/app/new/grid-styles.css';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { getPreviewSubTotalColumnDefs } from '@/utils/getPreviewScreenColumnDefs';

import { SubTotalTableRow } from './types';
import { AMOUNT_FIELD, COMMITMENT_FIELD, ENTITY_NAME_FIELD } from '@/const/previewScreen';

const TOTAL_ROW_ID = 'total-row';
const TOTAL_ROW_NAME = 'Grand Total';

type Props = {
  rows: SubTotalTableRow[];
  testId?: string;
  isLoading?: boolean;
};

const PreviewSubTotalTable: FC<Props> = ({
  rows,
  testId = 'preview-screen-table',
  isLoading = false,
}) => {
  const columnDefs = useMemo(() => getPreviewSubTotalColumnDefs(isLoading), [isLoading]);

  const addTotalRow = (rows: SubTotalTableRow[]) => {
    const commitmentAmount = rows.reduce((sum, row) => sum + (row.commitment || 0), 0);
    const allocatedAmount = rows.reduce((sum, row) => sum + (row.allocatedAmount || 0), 0);

    const totalRow = {
      id: TOTAL_ROW_ID,
      [ENTITY_NAME_FIELD]: TOTAL_ROW_NAME,
      [COMMITMENT_FIELD]: commitmentAmount,
      [AMOUNT_FIELD]: allocatedAmount,
      isTotalRow: true,
    } as const;

    return [...rows, totalRow];
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

  // Post-sort callback to move total row to the bottom
  const handlePostSortRows = useCallback((params: PostSortRowsParams) => {
    const { nodes } = params;
    const totalRowNode = nodes.find((node) => node.data?.isTotalRow);

    if (totalRowNode) {
      // Remove total row from its current position
      const totalRowIndex = nodes.indexOf(totalRowNode);
      nodes.splice(totalRowIndex, 1);

      // Add total row at the end
      nodes.push(totalRowNode);
    }
  }, []);

  return (
    <ConfigurationTable
      testId={prepareDataTestId('table', testId)}
      columnDefs={columnDefs}
      rowData={displayRows}
      isLoading={isLoading}
      noRowsText="No Data to display"
      postSortRows={handlePostSortRows}
    />
  );
};

export default PreviewSubTotalTable;
