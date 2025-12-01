'use client';

import React, { FC, useMemo } from 'react';
import '@/app/new/grid-styles.css';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import {
  AllocatedAmountFieldTypes,
  AllocationPreviewTableProps,
  DynamicFieldType,
  ManagementFeeFieldType,
  PreviewModalTotalRow,
} from './types';
import { getAllocationPreviewColumnDefs } from '@/utils/getAllocationPreviewColumnDefs';
import { defineColumnForAllocationPreview } from '@/utils/definedColumnForAllocationPreview';
import { observer } from 'mobx-react-lite';
import { InvestorEntry } from '@/clients/CapEventPackage';
import { ALLOCATED_AMOUNT_FIELD, MANAGEMENT_FEE_FIELD } from '@/const/allocationPreview';

const AllocationPreviewTable: FC<AllocationPreviewTableProps> = ({
  rows,
  isLoading,
  allocationBasis,
  testId = 'allocation-preview-table',
}) => {
  const dynamicColumn: DynamicFieldType = defineColumnForAllocationPreview(allocationBasis);

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
    () => getAllocationPreviewColumnDefs(dynamicColumn, allocationBasis, isLoading),
    [isLoading, dynamicColumn, allocationBasis],
  );

  const calculateField = (
    rows: InvestorEntry[],
    field: DynamicFieldType | ManagementFeeFieldType | AllocatedAmountFieldTypes,
  ): number => {
    return rows.reduce((sum, row) => {
      let amount = row[field];
      if (amount === undefined) return sum;

      if (field === ALLOCATED_AMOUNT_FIELD) {
        if (row.trType === -1) {
          amount *= row.trType;
        }
      }
      return sum + amount;
    }, 0);
  };

  const pinnedBottomRowData: PreviewModalTotalRow[] = useMemo(
    () => [
      {
        customerId: 'Total',
        allocatedAmount: calculateField(displayRows, ALLOCATED_AMOUNT_FIELD),
        [dynamicColumn]: calculateField(displayRows, dynamicColumn),
        managementFee: calculateField(displayRows, MANAGEMENT_FEE_FIELD),
      },
    ],
    [displayRows, dynamicColumn],
  );

  return (
    <ConfigurationTable<PreviewModalTotalRow>
      testId={prepareDataTestId('table', testId)}
      columnDefs={columnDefs}
      rowData={displayRows}
      isLoading={isLoading}
      noRowsText="No Data to display"
      pinnedBottomRowData={displayRows.length ? pinnedBottomRowData : undefined}
    />
  );
};

export default observer(AllocationPreviewTable);
