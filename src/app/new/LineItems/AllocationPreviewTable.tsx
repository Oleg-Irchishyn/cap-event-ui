'use client';

import React, { FC, useMemo } from 'react';
import '@/app/new/grid-styles.css';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { AllocationPreviewTableProps } from './types';
import { getAllocationPreviewColumnDefs } from '@/utils/getAllocationPreviewColumnDefs';
import { defineColumnForAllocationPreview } from '@/utils/definedColumnForAllocationPreview';
import { capEventSettingsStore } from '@/stores';

const AllocationPreviewTable: FC<AllocationPreviewTableProps> = ({
  rows,
  testId = 'allocation-preview-table',
  isLoading = false,
}) => {
  const fieldName = defineColumnForAllocationPreview(
    capEventSettingsStore.allocationPreviewModalAllocationBasis,
  );
  const columnDefs = useMemo(
    () =>
      getAllocationPreviewColumnDefs(
        fieldName,
        capEventSettingsStore.allocationPreviewModalAllocationBasis,
        isLoading,
      ),
    [isLoading, fieldName],
  );

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
