import { ColDef } from 'ag-grid-community';
import SkeletonCellRenderer from '@/app/components/SkeletonCellRenderer';
import {
  ALLOCATED_AMOUNT_FIELD,
  ALLOCATED_AMOUNT_HEADER,
  COMMITMENT_FIELD,
  COMMITMENT_HEADER,
  INVESTOR_ID_FIELD,
  INVESTOR_ID_HEADER,
  INVESTOR_NAME_FIELD,
  INVESTOR_NAME_HEADER,
  INVESTOR_CLASS_ID_FIELD,
  INVESTOR_CLASS_ID_HEADER,
  INVESTOR_ADDITIONAL_TYPE_FIELD,
  INVESTOR_ADDITIONAL_TYPE_HEADER,
} from '@/const/allocationPreview';

export const getAllocationPreviewColumnDefs = (isLoading?: boolean): ColDef[] => [
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
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 50 } } : undefined,
  },
  {
    headerName: INVESTOR_NAME_HEADER,
    field: INVESTOR_NAME_FIELD,
    flex: 1.5,
    sortable: true,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 70 } } : undefined,
  },
  {
    headerName: INVESTOR_CLASS_ID_HEADER,
    field: INVESTOR_CLASS_ID_FIELD,
    flex: 2,
    sortable: false,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 85 } } : undefined,
  },
  {
    headerName: INVESTOR_ADDITIONAL_TYPE_HEADER,
    field: INVESTOR_ADDITIONAL_TYPE_FIELD,
    flex: 1.5,
    sortable: false,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 60 } } : undefined,
  },
  {
    headerName: COMMITMENT_HEADER,
    field: COMMITMENT_FIELD,
    flex: 1,
    sortable: true,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
  },
  {
    headerName: ALLOCATED_AMOUNT_HEADER,
    field: ALLOCATED_AMOUNT_FIELD,
    flex: 1.5,
    sortable: false,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 60 } } : undefined,
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
