import { ColDef } from 'ag-grid-community';
import SkeletonCellRenderer from '@/app/components/SkeletonCellRenderer';
import {
  AMOUNT_FIELD,
  AMOUNT_HEADER,
  DESCRIPTION_FIELD,
  DESCRIPTION_HEADER,
  ENTITY_FIELD,
  ENTITY_NAME_HEADER,
  INVESTMENT_FIELD,
  INVESTMENT_HEADER,
  INVESTOR_FIELD,
  INVESTOR_NAME_HEADER,
} from '@/const/allocationDistribution';

export const getDistributionColumnDefs = (isLoading?: boolean): ColDef[] => [
  {
    headerName: INVESTOR_NAME_HEADER,
    field: INVESTOR_FIELD,
    flex: 1,
    sortable: true,
    sort: 'asc',
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 50 } } : undefined,
  },
  {
    headerName: ENTITY_NAME_HEADER,
    field: ENTITY_FIELD,
    valueGetter: (params) => {
      const id = params.data?.entityId ?? '';
      const name = params.data?.entityName ?? '';
      return `${id} - ${name}`;
    },
    flex: 1.5,
    sortable: true,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 70 } } : undefined,
  },
  {
    headerName: DESCRIPTION_HEADER,
    field: DESCRIPTION_FIELD,
    flex: 2,
    sortable: false,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 85 } } : undefined,
  },
  {
    headerName: INVESTMENT_HEADER,
    field: INVESTMENT_FIELD,
    valueGetter: (params) => {
      const title = params.data?.investmentTitle ?? '';
      const name = params.data?.investmentName ?? '';
      return title || name;
    },
    flex: 1.5,
    sortable: false,
    cellRendererSelector: () =>
      isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 60 } } : undefined,
  },
  {
    headerName: AMOUNT_HEADER,
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
