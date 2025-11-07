'use client';

import { FC, useMemo } from 'react';
import '@/app/new/grid-styles.css';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { getDistributionColumnDefs } from '@/utils/getDistributionColumnDefs';

import { DistributionTableProps, DistributionRow } from './types';

const DistributionTable: FC<DistributionTableProps> = ({
  rows,
  testId = 'distribution-table',
  isLoading = false,
  onRowClicked,
}) => {
  const columnDefs = useMemo(() => getDistributionColumnDefs(isLoading), [isLoading]);

  const displayRows = useMemo(() => {
    if (!isLoading || (Array.isArray(rows) && rows.length > 0)) {
      return rows;
    }
    const placeholderCount = 10;
    const placeholders: DistributionRow[] = Array.from({ length: placeholderCount }).map(
      (_, index) => ({
        id: `skeleton-${index}`,
        investor: '',
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
    />
  );
};

export default DistributionTable;
