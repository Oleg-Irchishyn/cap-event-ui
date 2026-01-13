import { FC, useMemo } from 'react';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { ColDef } from 'ag-grid-community';
import { CAP_EVENT_COLLECTION_TABLE_CONFIG } from '@/app/components/CapEventCollectionTable/const';
import '@/app/new/grid-styles.css';
import { TableHeaderWithTooltip } from '../TableHeaderWithTooltip/TableHeaderWithTooltip';
import { CapEvent } from '@/clients/CapEventPackage';
import SkeletonCellRenderer from '@/app/components/SkeletonCellRenderer';
import { TruncatedTextCell } from './TruncatedTextCell';
import { formatAmount } from '@/utils/formatAmount';

const formatNamedObject = (value: unknown): string => {
  if (!value) return '-';
  if (typeof value === 'string') {
    const s = value.trim();
    return s ?? '-';
  }
  if (typeof value === 'object') {
    const { id, name } = value as { id?: string; name?: string };
    const idStr = String(id ?? '').trim();
    const nameStr = String(name ?? '').trim();
    return idStr && nameStr ? `${idStr} - ${nameStr}` : '-';
  }
  return '-';
};

type Props = {
  rows: CapEvent[];
  testId?: string;
  isLoading?: boolean;
};

const capEventTableColumnDefs = (): ColDef[] => [
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.CAPITAL_EVENT.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.CAPITAL_EVENT.key,
    flex: 1,
    sortable: true,
    resizable: true,
    minWidth: 190,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.name ?? '-';
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.STATUS.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.STATUS.key,
    flex: 1,
    sortable: true,
    resizable: true,
    maxWidth: 102,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.status ? data.status[0].toUpperCase() + data.status.slice(1).toLowerCase() : '-';
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.EVENT_TYPE.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.EVENT_TYPE.key,
    flex: 1,
    sortable: true,
    resizable: true,
    maxWidth: 120,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.capEventType?.abbreviation ?? '-';
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.SPONSOR.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.SPONSOR.key,
    flex: 1,
    sortable: true,
    resizable: true,
    minWidth: 190,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return formatNamedObject(data.sponsor as unknown);
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.FUND_GROUP.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.FUND_GROUP.key,
    flex: 1,
    sortable: true,
    resizable: true,
    minWidth: 190,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return formatNamedObject(data.fundGroup as unknown);
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.ENTITIES.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.ENTITIES.key,
    flex: 1,
    sortable: true,
    resizable: true,
    minWidth: 190,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      const items =
        (data.entities ?? [])
          .sort((a, b) =>
            String(a?.name ?? '')
              .toLowerCase()
              .localeCompare(String(b?.name ?? '').toLowerCase()),
          )
          .map((e) => {
            const id = String(e?.id ?? '').trim();
            const name = String(e?.name ?? '').trim();
            return id && name ? `${id} - ${name}` : '';
          })
          .filter(Boolean) ?? [];

      return items.length ? items.join(', ') : '-';
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.CREATED_AT.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.CREATED_AT.key,
    flex: 1,
    sort: 'desc',
    sortIndex: 0,
    sortable: true,
    resizable: true,
    minWidth: 190,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data?.createdAt ? new Date(data.createdAt).getTime() : null;
    },
    valueFormatter: (params) => {
      const data = params.data as CapEvent;
      return data?.createdAt ? new Date(data.createdAt).toLocaleDateString() : '-';
    },
    maxWidth: 120,
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.CREATED_BY.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.CREATED_BY.key,
    flex: 1,
    sortable: true,
    resizable: true,
    minWidth: 190,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.createdBy ?? '-';
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.TOTAL_AMOUNT.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.TOTAL_AMOUNT.key,
    flex: 1,
    sortable: true,
    resizable: true,
    pinned: 'right',
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.totalAmount ?? null;
    },
    valueFormatter: (params) => (params.value != null ? formatAmount(params.value as number) : '-'),
    headerComponentParams: {
      innerHeaderComponent: TableHeaderWithTooltip,
      innerHeaderComponentParams: {
        headerAlignment: 'flex-end',
      },
    },
    cellRendererParams: {
      textAlign: 'end',
    },
    maxWidth: 120,
  },
];

export const CapEventCollectionTable: FC<Props> = ({ rows, testId = '', isLoading }) => {
  const columnDefs = useMemo(
    () =>
      capEventTableColumnDefs().map((colDef) => ({
        ...colDef,
        cellRendererSelector: () =>
          isLoading
            ? {
                component: SkeletonCellRenderer,
                params: {
                  widthPercent: 50,
                  ...(typeof colDef.cellRendererParams === 'object'
                    ? colDef.cellRendererParams
                    : {}),
                },
              }
            : { component: TruncatedTextCell },
      })),
    [isLoading],
  );

  const displayRows = useMemo(() => {
    if (!isLoading || (Array.isArray(rows) && rows.length > 0)) {
      return rows;
    }
    // Create placeholder rows for skeleton loading state
    const placeholderCount = 10;
    const placeholders: CapEvent[] = Array.from({ length: placeholderCount }).map(
      (_, index) =>
        ({
          id: `skeleton-${index}`,
        }) as CapEvent,
    );
    return placeholders;
  }, [isLoading, rows]);

  return (
    <ConfigurationTable
      testId={prepareDataTestId('table', testId)}
      columnDefs={columnDefs}
      rowData={displayRows}
      isLoading={isLoading}
      height={'calc(100vh - 280px)'}
      noRowsText="No data available"
    />
  );
};
