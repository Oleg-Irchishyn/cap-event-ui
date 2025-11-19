import { ColDef } from 'ag-grid-community';
import SkeletonCellRenderer from '@/app/components/SkeletonCellRenderer';
import {
  ENTITY_ID_HEADER,
  ENTITY_NAME_HEADER,
  INVESTOR_ID_HEADER,
  INVESTOR_NAME_HEADER,
  INVESTOR_TYPE_I_HEADER,
  INVESTOR_TYPE_II_HEADER,
  TOTAL_CAPITAL_CMNT_HEADER,
  ENTITY_ID_FIELD,
  ENTITY_NAME_FIELD,
  INVESTOR_ID_FIELD,
  INVESTOR_NAME_FIELD,
  INVESTOR_TYPE_I_FIELD,
  INVESTOR_TYPE_II_FIELD,
  AMOUNT_FIELD,
} from '@/const/allocationDistribution';

export const getDistributionColumnDefs = (isLoading?: boolean): ColDef[] => [
  // Entity ID
  {
    headerName: ENTITY_ID_HEADER,
    field: ENTITY_ID_FIELD,
    flex: 1,
    sortable: true,
    sort: 'asc',
    sortIndex: 0,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 30 } } : undefined,
  },
  // Entity Name
  {
    headerName: ENTITY_NAME_HEADER,
    field: ENTITY_NAME_FIELD,
    flex: 1.5,
    sortable: true,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 60 } } : undefined,
  },
  // Investor ID
  {
    headerName: INVESTOR_ID_HEADER,
    field: INVESTOR_ID_FIELD,
    flex: 1,
    sortable: true,
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
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 70 } } : undefined,
  },
  // Investor Type I
  {
    headerName: INVESTOR_TYPE_I_HEADER,
    field: INVESTOR_TYPE_I_FIELD,
    flex: 1,
    sortable: true,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
  },
  // Investor Type II
  {
    headerName: INVESTOR_TYPE_II_HEADER,
    field: INVESTOR_TYPE_II_FIELD,
    flex: 1.2,
    sortable: true,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 50 } } : undefined,
  },
  // Total Capital CMNT
  {
    headerName: TOTAL_CAPITAL_CMNT_HEADER,
    field: AMOUNT_FIELD,
    flex: 1,
    sortable: true,
    valueFormatter: (params) => {
      const value = params.value as number | undefined;
      if (typeof value !== 'number') return '';
      return value.toLocaleString('en-US');
    },
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
  },
];
