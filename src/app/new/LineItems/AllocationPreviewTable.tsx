'use client';

import React, { FC, useMemo } from 'react';
import '@/app/new/grid-styles.css';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { AllocationPreviewTableProps } from './types';
import { getAllocationPreviewColumnDefs } from '@/utils/getAllocationPreviewColumnDefs';
import { defineColumnForAllocationPreview } from '@/utils/definedColumnForAllocationPreview';
import { observer } from 'mobx-react-lite';
import { InvestorEntry } from '@/clients/CapEventPackage';

const AllocationPreviewTable: FC<AllocationPreviewTableProps> = ({
  rows,
  isLoading,
  allocationBasis,
  testId = 'allocation-preview-table',
}) => {
  const fieldName = defineColumnForAllocationPreview(allocationBasis);

  const displayRows = useMemo(() => {
    if (!isLoading || (Array.isArray(rows) && rows.length > 0)) {
      return rows;
    }
    const placeholderCount = 5;
    const placeholders: InvestorEntry[] = Array.from({ length: placeholderCount }).map(
      (_, index) => ({
        id: `skeleton-${index}`,
        optOut: false,
        readOnly: false,
        rounded: false,
        investor: '',
        classID: '',
        additionalInvestorType: '',
        customerId: '',
        customerName: '',
        department: '',
        commitment: 0,
        investedCapital: 0,
        unfunded: 0,
        managementFee: 0,
        managementFeePercentage: 0,
        amount: 0,
        originalAmount: 0,
        allocatedAmount: 0,
        allocatedAmountNotRounded: 0,
        isTransferEntry: false,
        trType: 0,
        hasZeroCtb: false,
        investorToRound: false,
        location: '',
        dataPoints: '',
        isAggregated: false,
        lineItemAmount: 0,
      }),
    );
    return placeholders;
  }, [isLoading, rows]);

  const columnDefs = useMemo(
    () => getAllocationPreviewColumnDefs(fieldName, allocationBasis, isLoading),
    [isLoading, fieldName, allocationBasis],
  );

  return (
    <ConfigurationTable
      testId={prepareDataTestId('table', testId)}
      columnDefs={columnDefs}
      rowData={displayRows}
      isLoading={isLoading}
      noRowsText="No Data to display"
    />
  );
};

export default observer(AllocationPreviewTable);
