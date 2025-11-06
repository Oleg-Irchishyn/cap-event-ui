'use client';

import React, { FC, useMemo } from 'react';
import '@/app/new/grid-styles.css';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { AllocationPreviewTableProps } from './types';
import { getAllocationPreviewColumnDefs } from '@/utils/getAllocationPreviewColumnDefs';

const AllocationPreviewTable: FC<AllocationPreviewTableProps> = ({
  rows,
  testId = 'allocation-preview-table',
  isLoading = false,
}) => {
  const columnDefs = useMemo(() => getAllocationPreviewColumnDefs(isLoading), [isLoading]);

  return (
    <ConfigurationTable
      testId={prepareDataTestId('table', testId)}
      columnDefs={columnDefs}
      rowData={rows}
      isLoading={isLoading}
      noRowsText="No Data to display"
    />
  );
};

export default AllocationPreviewTable;
