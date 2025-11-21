'use client';

import { FC, useMemo } from 'react';
import '@/app/new/grid-styles.css';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { getPreviewScreenColumnDefs } from '@/utils/getPreviewScreenColumnDefs';

import { PreviewScreenTableProps, PreviewScreenRow } from './types';

const PreviewScreenTable: FC<PreviewScreenTableProps> = ({
  rows,
  testId = 'distribution-table',
  isLoading = false,
  onRowClicked,
}) => {
  const columnDefs = useMemo(() => getPreviewScreenColumnDefs(isLoading), [isLoading]);

  const displayRows = useMemo(() => {
    if (!isLoading || (Array.isArray(rows) && rows.length > 0)) {
      // Only render aggregated rows
      return (rows ?? []).filter((r) => r.isAggregated);
    }
    const placeholderCount = 10;
    const placeholders: PreviewScreenRow[] = Array.from({ length: placeholderCount }).map(
      (_, index) => ({
        id: `skeleton-${index}`,
        investor: '',
        investorId: '',
        investorName: '',
        classID: '',
        additionalInvestorType: '',
        entityId: '',
        entityName: '',
        description: '',
        investmentTitle: '',
        investmentName: '',
        allocatedAmount: 0,
      }),
    );
    return placeholders;
  }, [isLoading, rows]);

  return (
    <ConfigurationTable
      testId={prepareDataTestId('table', testId)}
      columnDefs={columnDefs}
      rowData={displayRows}
      isLoading={isLoading}
      noRowsText="No Data to display"
      onRowClicked={onRowClicked}
      height="55dvh"
    />
  );
};

export default PreviewScreenTable;
