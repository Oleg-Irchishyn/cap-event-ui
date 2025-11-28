import { ColDef } from 'ag-grid-community';
import SkeletonCellRenderer from '@/app/components/SkeletonCellRenderer';
import {
  ALLOCATED_AMOUNT_FIELD,
  ALLOCATED_AMOUNT_HEADER,
  INVESTOR_ID_FIELD,
  INVESTOR_ID_HEADER,
  INVESTOR_NAME_FIELD,
  INVESTOR_NAME_HEADER,
  INVESTOR_CLASS_ID_FIELD,
  INVESTOR_CLASS_ID_HEADER,
  INVESTOR_ADDITIONAL_TYPE_FIELD,
  INVESTOR_ADDITIONAL_TYPE_HEADER,
  MANAGEMENT_FEE_PERCENT_FIELD,
  MANAGEMENT_FEE_PERCENT_HEADER,
  MANAGEMENT_FEE_FIELD,
  MANAGEMENT_FEE_HEADER,
  COMMITMENT_HEADER,
} from '@/const/allocationPreview';
import { formatAmount } from '@/utils/formatAmount';

export const getAllocationPreviewColumnDefs = (
  fieldName: string,
  allocationBasis: string,
  isLoading?: boolean,
): ColDef[] => {
  const columns: ColDef[] = [
    // OptOut col is hidden due to lack of backend for this functionlity
    // {
    //   headerName: OPT_OUT,
    //   flex: 1,
    //   cellRenderer: ItemCheckbox,
    //   editable: false,
    //   field: 'optOut',
    // },
    {
      headerName: INVESTOR_ID_HEADER,
      field: INVESTOR_ID_FIELD,
      flex: 1,
      sortable: true,
      sort: 'asc',
      valueGetter: (params) => {
        return params.data.customerId ?? '-';
      },
      cellRendererSelector: () =>
        isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 50 } } : undefined,
    },
    {
      headerName: INVESTOR_NAME_HEADER,
      field: INVESTOR_NAME_FIELD,
      flex: 1.5,
      sortable: true,
      valueGetter: (params) => {
        return params.data.customerName ?? '-';
      },
      cellRendererSelector: () =>
        isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 70 } } : undefined,
    },
    {
      headerName: INVESTOR_CLASS_ID_HEADER,
      field: INVESTOR_CLASS_ID_FIELD,
      flex: 2,
      sortable: false,
      valueGetter: (params) => {
        return params.data.classID ?? 'LP';
      },
      cellRendererSelector: () =>
        isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 85 } } : undefined,
    },
    {
      headerName: INVESTOR_ADDITIONAL_TYPE_HEADER,
      field: INVESTOR_ADDITIONAL_TYPE_FIELD,
      flex: 1.5,
      sortable: false,
      valueGetter: (params) => {
        return params.data.additionalInvestorType ?? '-';
      },
      cellRendererSelector: () =>
        isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 60 } } : undefined,
    },
    {
      headerName: allocationBasis === MANAGEMENT_FEE_HEADER ? COMMITMENT_HEADER : allocationBasis,
      field: fieldName,
      flex: 1,
      sortable: true,
      headerClass: 'ag-right-aligned-header',
      valueGetter: (params) => {
        return formatAmount(params.data[fieldName]);
      },
      cellStyle: { textAlign: 'right' },
      cellRendererSelector: () =>
        isLoading
          ? { component: SkeletonCellRenderer, params: { widthPercent: 40, textAlign: 'end' } }
          : undefined,
    },
    {
      headerName: ALLOCATED_AMOUNT_HEADER,
      field: ALLOCATED_AMOUNT_FIELD,
      flex: 1.5,
      sortable: false,
      headerClass: 'ag-right-aligned-header',
      valueGetter: (params) => {
        return formatAmount(params.data.allocatedAmount);
      },
      cellStyle: { textAlign: 'right' },
      cellRendererSelector: () =>
        isLoading
          ? { component: SkeletonCellRenderer, params: { widthPercent: 60, textAlign: 'end' } }
          : undefined,
    },
    // ALLOCATED_AMOUNT_BASE column is temporarily hidden
    // {
    //   headerName: ALLOCATED_AMOUNT_BASE,
    //   field: 'allocatedAmount',
    //   flex: 1.5,
    //   sortable: false,
    //   cellRendererSelector: () =>
    //     isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 60 } } : undefined,
    //   cellStyle: (params) => {
    //     return params.data?.isAggregated ? { fontWeight: 'bold' } : null;
    //   },
    // },
  ];

  if (allocationBasis === MANAGEMENT_FEE_HEADER) {
    const extraColumns: ColDef[] = [
      {
        headerName: MANAGEMENT_FEE_PERCENT_HEADER,
        field: MANAGEMENT_FEE_PERCENT_FIELD,
        flex: 1.5,
        sortable: false,
        headerClass: 'ag-right-aligned-header',
        cellStyle: { textAlign: 'right' },
        valueGetter: (params) => {
          return params.data.managementFeePercentage ?? '-';
        },
        cellRendererSelector: () =>
          isLoading
            ? { component: SkeletonCellRenderer, params: { widthPercent: 60, textAlign: 'end' } }
            : undefined,
      },
      {
        headerName: MANAGEMENT_FEE_HEADER,
        field: MANAGEMENT_FEE_FIELD,
        flex: 1.5,
        sortable: false,
        headerClass: 'ag-right-aligned-header',
        cellStyle: { textAlign: 'right' },
        valueGetter: (params) => {
          return params.data.managementFee ?? '-';
        },
        cellRendererSelector: () =>
          isLoading
            ? { component: SkeletonCellRenderer, params: { widthPercent: 60, textAlign: 'end' } }
            : undefined,
      },
    ];

    const columnIndex = columns.findIndex((col) => col.field === fieldName);
    columns.splice(columnIndex + 1, 0, ...extraColumns);
  }

  return columns;
};
