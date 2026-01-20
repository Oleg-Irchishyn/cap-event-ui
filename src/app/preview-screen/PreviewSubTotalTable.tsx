'use client';

import { FC } from 'react';
import { ColDef } from 'ag-grid-community';
import '@/app/new/grid-styles.css';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import { SubTotalTableRow } from './types';
import { usePreviewSubTotalTable } from '@/hooks/usePreviewSubTotalTable';

type Props = {
  rows: SubTotalTableRow[];
  testId?: string;
  isLoading?: boolean;
  columnDefs: ColDef[];
};

const PreviewSubTotalTable: FC<Props> = ({
  rows,
  testId = 'preview-screen-table',
  isLoading = false,
  columnDefs,
}) => {
  const { displayRows, handlePostSortRows } = usePreviewSubTotalTable({
    rows,
    isLoading,
    columnDefs,
  });

  return (
    <ConfigurationTable
      testId={prepareDataTestId('table', testId)}
      columnDefs={columnDefs}
      rowData={displayRows}
      isLoading={isLoading}
      headerHeight={80}
      noRowsText="No Data to display"
      postSortRows={handlePostSortRows}
    />
  );
};

export default PreviewSubTotalTable;
