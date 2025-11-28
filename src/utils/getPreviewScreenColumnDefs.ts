import { ColDef, ICellRendererParams } from 'ag-grid-community';
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

export const getPreviewScreenColumnDefs = (isLoading?: boolean): ColDef[] => [
  // Entity ID
  {
    headerName: ENTITY_ID_HEADER,
    field: ENTITY_ID_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
    sort: 'asc',
    sortIndex: 0,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 30 } } : undefined,
  },
  // Entity Name
  {
    headerName: ENTITY_NAME_HEADER,
    field: ENTITY_NAME_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 60 } } : undefined,
  },
  // Investor ID
  {
    headerName: INVESTOR_ID_HEADER,
    field: INVESTOR_ID_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
    sort: 'asc',
    sortIndex: 1,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
  },
  // Investor Name
  {
    headerName: INVESTOR_NAME_HEADER,
    field: INVESTOR_NAME_FIELD,
    flex: 1.5,
    sortable: true,
    resizable: true,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 70 } } : undefined,
  },
  // Investor Type I
  {
    headerName: INVESTOR_TYPE_I_HEADER,
    field: INVESTOR_TYPE_I_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
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
    flex: 1.2,
    sortable: true,
    resizable: true,
    valueGetter: (params) => {
      const value = params.data[INVESTOR_TYPE_II_FIELD];
      return value && String(value).trim() ? value : EMPTY_INVESTOR_TYPE_TWO_VALUE;
    },
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 50 } } : undefined,
  },
  // Total Capital Commitment
  {
    headerName: TOTAL_CAPITAL_COMMITMENT_HEADER,
    field: COMMITMENT_FIELD,
    flex: 1.5,
    sortable: true,
    resizable: true,
    headerClass: 'ag-right-aligned-header',
    valueGetter: (params) => {
      return formatAmount(params.data.commitment);
    },
    cellStyle: { textAlign: 'right' },
    cellRendererSelector: () =>
      isLoading
        ? { component: SkeletonCellRenderer, params: { widthPercent: 40, textAlign: 'end' } }
        : undefined,
  },
  // Total Amount Due
  {
    headerName: TOTAL_AMOUNT_DUE_HEADER,
    field: AMOUNT_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
    headerClass: 'ag-right-aligned-header',
    valueGetter: (params) => {
      return formatAmount(params.data.allocatedAmount);
    },
    cellStyle: { textAlign: 'right' },
    cellRendererSelector: () =>
      isLoading
        ? { component: SkeletonCellRenderer, params: { widthPercent: 40, textAlign: 'end' } }
        : undefined,
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

export const getPreviewSubTotalColumnDefs = (isLoading?: boolean): ColDef[] => [
  // Entity Name - aligns with column 2 from first table
  {
    headerName: ENTITY_NAME_HEADER,
    field: ENTITY_NAME_FIELD,
    flex: 2,
    sortable: true,
    resizable: true,
    cellRendererSelector: (params: ICellRendererParams) =>
      nameCellRendererSelector(params, isLoading),
  },
  // Empty spacer column to align with Entity ID column from first table
  {
    headerName: '',
    flex: 1,
    sortable: false,
    resizable: false,
    suppressHeaderMenuButton: true,
    suppressMovable: true,
    suppressSizeToFit: true,
    cellStyle: { visibility: 'hidden' },
    headerClass: 'ag-hidden-header',
  },
  // Empty spacer column to align with Investor ID column from first table
  {
    headerName: '',
    flex: 1,
    sortable: false,
    resizable: false,
    suppressHeaderMenuButton: true,
    suppressMovable: true,
    suppressSizeToFit: true,
    cellStyle: { visibility: 'hidden' },
    headerClass: 'ag-hidden-header',
  },
  // Empty spacer column to align with Investor Name column from first table
  {
    headerName: '',
    flex: 1.5,
    sortable: false,
    resizable: false,
    suppressHeaderMenuButton: true,
    suppressMovable: true,
    suppressSizeToFit: true,
    cellStyle: { visibility: 'hidden' },
    headerClass: 'ag-hidden-header',
  },
  // Empty spacer column to align with Investor Type I column from first table
  {
    headerName: '',
    flex: 1,
    sortable: false,
    resizable: false,
    suppressHeaderMenuButton: true,
    suppressMovable: true,
    suppressSizeToFit: true,
    cellStyle: { visibility: 'hidden' },
    headerClass: 'ag-hidden-header',
  },
  // Empty spacer column to align with Investor Type II column from first table
  {
    headerName: '',
    flex: 1.2,
    sortable: false,
    resizable: false,
    suppressHeaderMenuButton: true,
    suppressMovable: true,
    suppressSizeToFit: true,
    cellStyle: { visibility: 'hidden' },
    headerClass: 'ag-hidden-header',
  },
  // Total Capital Commitment - aligns with column 7 from first table
  {
    headerName: TOTAL_CAPITAL_COMMITMENT_HEADER,
    field: COMMITMENT_FIELD,
    flex: 1.5,
    sortable: true,
    resizable: true,
    headerClass: 'ag-right-aligned-header',
    valueGetter: (params) => {
      return formatAmount(params.data.commitment);
    },
    cellStyle: { textAlign: 'right' },
    cellRendererSelector: (params) => amountCellRendererSelector(params, isLoading),
  },
  // Total Amount Due - aligns with column 8 from first table
  {
    headerName: TOTAL_AMOUNT_DUE_HEADER,
    field: AMOUNT_FIELD,
    flex: 1,
    sortable: true,
    resizable: true,
    headerClass: 'ag-right-aligned-header',
    valueGetter: (params) => {
      return formatAmount(params.data.allocatedAmount);
    },
    cellStyle: { textAlign: 'right' },
    cellRendererSelector: (params) => amountCellRendererSelector(params, isLoading),
  },
];
