import { ColDef, ICellRendererParams, IHeaderParams } from 'ag-grid-community';
import SkeletonCellRenderer from '@/app/components/SkeletonCellRenderer';
import {
  ENTITY_ID_HEADER,
  ENTITY_NAME_HEADER,
  INVESTOR_ID_HEADER,
  INVESTOR_NAME_HEADER,
  INVESTOR_TYPE_I_HEADER,
  INVESTOR_TYPE_II_HEADER,
  TOTAL_AMOUNT_DUE_HEADER,
  TOTAL_CAPITAL_COMMITMENT_HEADER,
  ENTITY_ID_FIELD,
  ENTITY_NAME_FIELD,
  INVESTOR_ID_FIELD,
  INVESTOR_NAME_FIELD,
  INVESTOR_TYPE_I_FIELD,
  INVESTOR_TYPE_II_FIELD,
  AMOUNT_FIELD,
  COMMITMENT_FIELD,
  EMPTY_INVESTOR_TYPE_ONE_VALUE,
  EMPTY_INVESTOR_TYPE_TWO_VALUE,
} from '@/const/previewScreen';
import { formatAmount } from '@/utils/formatAmount';
import { TotalCell } from '@/app/preview-screen/TotalCell';
import { LineItemRow } from '@/app/new/LineItems/types';
import { defineColumnForAllocationPreview } from '@/utils/definedColumnForAllocationPreview';
import React, { FC } from 'react';
import { ColumnHeaderWrapper, DynamicColumnsHeader } from '@/app/preview-screen/styles';

export const getPreviewScreenColumnDefs = (isLoading?: boolean): ColDef[] => [
  // Entity ID
  {
    headerName: ENTITY_ID_HEADER,
    field: ENTITY_ID_FIELD,
    colId: ENTITY_ID_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
    sort: 'asc',
    sortIndex: 0,
    minWidth: 100,
    initialWidth: 100,
    pinned: 'left',
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 30 } } : undefined,
  },
  // Entity Name
  {
    headerName: ENTITY_NAME_HEADER,
    field: ENTITY_NAME_FIELD,
    colId: ENTITY_NAME_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
    minWidth: 100,
    initialWidth: 100,
    pinned: 'left',
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 60 } } : undefined,
  },
  // Investor ID
  {
    headerName: INVESTOR_ID_HEADER,
    field: INVESTOR_ID_FIELD,
    colId: INVESTOR_ID_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
    sort: 'asc',
    sortIndex: 1,
    minWidth: 100,
    initialWidth: 100,
    pinned: 'left',
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
  },
  // Investor Name
  {
    headerName: INVESTOR_NAME_HEADER,
    field: INVESTOR_NAME_FIELD,
    colId: INVESTOR_NAME_FIELD,
    flex: 1.5,
    sortable: true,
    resizable: true,
    minWidth: 100,
    initialWidth: 150,
    pinned: 'left',
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 70 } } : undefined,
  },
  // Investor Type I
  {
    headerName: INVESTOR_TYPE_I_HEADER,
    field: INVESTOR_TYPE_I_FIELD,
    colId: INVESTOR_TYPE_I_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
    minWidth: 100,
    pinned: 'left',
    initialWidth: 100,
    valueGetter: (params) => {
      const value = params.data[INVESTOR_TYPE_I_FIELD];
      return value && String(value).trim() ? value : EMPTY_INVESTOR_TYPE_ONE_VALUE;
    },
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
  },
  // Investor Type II
  {
    headerName: INVESTOR_TYPE_II_HEADER,
    field: INVESTOR_TYPE_II_FIELD,
    colId: INVESTOR_TYPE_II_FIELD,
    flex: 1.2,
    sortable: true,
    resizable: true,
    minWidth: 100,
    pinned: 'left',
    initialWidth: 100,
    valueGetter: (params) => {
      const value = params.data[INVESTOR_TYPE_II_FIELD];
      return value && String(value).trim() ? value : EMPTY_INVESTOR_TYPE_TWO_VALUE;
    },
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 50 } } : undefined,
  },
];

const amountCellRendererSelector = (params: ICellRendererParams, isLoading?: boolean) => {
  if (isLoading)
    return { component: SkeletonCellRenderer, params: { widthPercent: 40, textAlign: 'end' } };
  if (params.data?.isTotalRow) return { component: TotalCell };
  return undefined;
};

const nameCellRendererSelector = (params: ICellRendererParams, isLoading?: boolean) => {
  if (isLoading) return { component: SkeletonCellRenderer, params: { widthPercent: 60 } };
  if (params.data?.isTotalRow)
    return { component: TotalCell, params: { ...params, textAlign: 'left' } };
  return undefined;
};

export const getPreviewSubTotalColumnDefs = (width: number, isLoading?: boolean): ColDef[] => [
  // Entity Name - aligns with column 2 from first table
  {
    headerName: ENTITY_NAME_HEADER,
    field: ENTITY_NAME_FIELD,
    flex: 1,
    width: width,
    sortable: true,
    resizable: true,
    pinned: 'left',
    cellRendererSelector: (params: ICellRendererParams) =>
      nameCellRendererSelector(params, isLoading),
  },
];

export const TruncatedThreeLineHeader: FC<IHeaderParams> = ({ column }) => {
  const params = column?.getColDef().headerComponentParams as
    | {
        defaultDescription?: string;
        callDistributionReason?: string;
        investmentTitle?: string;
      }
    | undefined;

  const defaultDescription = params?.defaultDescription ?? '';
  const callDistributionReason = params?.callDistributionReason ?? '';
  const investmentTitle = params?.investmentTitle ?? '';

  return (
    <ColumnHeaderWrapper>
      <DynamicColumnsHeader title={defaultDescription}>{defaultDescription}</DynamicColumnsHeader>
      <DynamicColumnsHeader title={callDistributionReason}>
        {callDistributionReason}
      </DynamicColumnsHeader>
      <DynamicColumnsHeader title={investmentTitle}>{investmentTitle}</DynamicColumnsHeader>
    </ColumnHeaderWrapper>
  );
};

export const getDynamicColumnsDefs = (
  lineItems: [string, LineItemRow[]][],
  isLoading: boolean,
): ColDef[] => {
  const dynamicColDef: ColDef[] = lineItems.flatMap(([, lineItemRows]) =>
    lineItemRows.flatMap((row) => [
      {
        colId: `${row.id}-allocation`,
        headerName: `Allocation:\n${row.allocationBasis}`,
        field: 'allocationBasis',
        flex: 1.5,
        sortable: true,
        resizable: false,
        minWidth: 190,
        cellStyle: { textAlign: 'right', color: '#0067A3' },
        headerClass: 'dynamic-column-header',
        valueGetter: (params) => {
          const field = defineColumnForAllocationPreview(row.allocationBasis);
          return formatAmount(params.data[`${row.id}-${field}`]);
        },
        headerStyle: {
          whiteSpace: 'pre-line',
          lineHeight: '1.4',
        },
        cellRendererSelector: (params) => amountCellRendererSelector(params, isLoading),
      },
      {
        colId: `${row.id}-lineItem`,
        headerName: '',
        field: 'lineItem',
        flex: 1.5,
        sortable: true,
        resizable: false,
        minWidth: 190,
        cellStyle: { textAlign: 'right', color: '#666769' },
        headerClass: 'dynamic-column-header',
        headerComponent: TruncatedThreeLineHeader,
        valueGetter: (params) => {
          const amount = params.data[`${row.id}-allocatedAmount`];
          const calculatedAmount = params.data.trType === -1 ? amount * params.data.trType : amount;
          return formatAmount(calculatedAmount);
        },
        headerComponentParams: {
          defaultDescription: row.defaultDescription,
          callDistributionReason: row.callDistributionReason,
          investmentTitle:
            typeof row.investment === 'string' ? row.investment : row.investment?.name,
        },
        cellRendererSelector: (params) => amountCellRendererSelector(params, isLoading),
      },
    ]),
  );

  return [
    ...dynamicColDef,
    // Total Capital Commitment
    {
      headerName: TOTAL_CAPITAL_COMMITMENT_HEADER,
      field: COMMITMENT_FIELD,
      flex: 1.5,
      sortable: true,
      resizable: true,
      minWidth: 100,
      headerClass: 'ag-right-aligned-header',
      valueGetter: (params) => {
        return formatAmount(params.data.commitment);
      },
      cellStyle: { textAlign: 'right' },
      cellRendererSelector: (params) => amountCellRendererSelector(params, isLoading),
    },
    // Total Amount Due
    {
      headerName: TOTAL_AMOUNT_DUE_HEADER,
      field: AMOUNT_FIELD,
      flex: 1,
      sortable: true,
      resizable: true,
      minWidth: 100,
      headerClass: 'ag-right-aligned-header',
      valueGetter: (params) => {
        return formatAmount(params.data.allocatedAmount);
      },
      cellStyle: { textAlign: 'right' },
      cellRendererSelector: (params) => amountCellRendererSelector(params, isLoading),
    },
  ];
};

export const getTopDynamicColumnDefs = (
  lineItems: [string, LineItemRow[]][],
  isLoading: boolean,
) => {
  return lineItems.flatMap(([, lineItemRows]) =>
    lineItemRows.flatMap((row) => [
      {
        colId: `${row.id}-allocation`,
        flex: 1.5,
        field: `${row.id}-allocation`,
        sortable: false,
        resizable: true,
        minWidth: 190,
        cellStyle: { textAlign: 'right' },
        cellRendererSelector: () =>
          isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 70 } } : undefined,
      },
      {
        colId: `${row.id}-lineItem`,
        field: row.id,
        flex: 1.5,
        sortable: false,
        resizable: true,
        minWidth: 190,
        cellStyle: { textAlign: 'right' },
        headerComponent: TruncatedThreeLineHeader,
        headerComponentParams: {
          defaultDescription: row.defaultDescription,
          callDistributionReason: row.callDistributionReason,
          investmentTitle:
            typeof row.investment === 'string' ? row.investment : row.investment?.name,
        },
        cellRendererSelector: () =>
          isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 70 } } : undefined,
      },
    ]),
  );
};
