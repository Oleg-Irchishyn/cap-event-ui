'use client';

import { FC, useMemo } from 'react';
import '@/app/new/grid-styles.css';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { getPreviewScreenColumnDefs } from '@/utils/getPreviewScreenColumnDefs';

import { PreviewScreenRow, PreviewScreenTableProps } from './types';

const PreviewScreenTable: FC<PreviewScreenTableProps> = ({
  rows,
  testId = 'preview-screen-table',
  isLoading = false,
  onRowClicked,
}) => {
  const columnDefs = useMemo(() => getPreviewScreenColumnDefs(isLoading), [isLoading]);

  const displayRows = useMemo(() => {
    if (!isLoading || (Array.isArray(rows) && rows.length > 0)) {
      // Only render aggregated rows
      return (rows ?? []).filter((r) => r.isAggregated);
    }

    const placeholderCount = columnDefs.length;
    const placeholders: PreviewScreenRow[] = Array.from({ length: placeholderCount }).map(
      (_, index) =>
        ({
          id: `skeleton-${index}`,
        }) as PreviewScreenRow,
    );
    return placeholders;
  }, [columnDefs.length, isLoading, rows]);

  return (
    <ConfigurationTable
      testId={prepareDataTestId('table', testId)}
      columnDefs={columnDefs}
      rowData={displayRows}
      isLoading={isLoading}
      noRowsText="No Data to display"
      onRowClicked={onRowClicked}
      height={displayRows.length > 10 ? '60vh' : undefined}
    />
  );
};

export default PreviewScreenTable;
