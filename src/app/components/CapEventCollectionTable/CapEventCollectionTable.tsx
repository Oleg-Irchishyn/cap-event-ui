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
    sortable: false,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.name ?? '-';
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.STATUS.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.STATUS.key,
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.status ? data.status[0].toUpperCase() + data.status.slice(1).toLowerCase() : '-';
    },
    maxWidth: 102,
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.EVENT_TYPE.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.EVENT_TYPE.key,
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.capEventType?.abbreviation ?? '-';
    },
    maxWidth: 120,
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.SPONSOR.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.SPONSOR.key,
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.sponsor &&
        String(data.sponsor.id ?? '').trim() &&
        String(data.sponsor.name ?? '').trim()
        ? `${data.sponsor.id} - ${data.sponsor.name}`
        : '-';
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.FUND_GROUP.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.FUND_GROUP.key,
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.fundGroup &&
        String(data.fundGroup.id ?? '').trim() &&
        String(data.fundGroup.name ?? '').trim()
        ? `${data.fundGroup.id} - ${data.fundGroup.name}`
        : '-';
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.ENTITIES.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.ENTITIES.key,
    flex: 1,
    sortable: false,
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
    sortable: false,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.createdAt ? new Date(data.createdAt).toLocaleDateString() : '-';
    },
    maxWidth: 120,
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.CREATED_BY.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.CREATED_BY.key,
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.createdBy ?? '-';
    },
  },
  {
    headerName: CAP_EVENT_COLLECTION_TABLE_CONFIG.TOTAL_AMOUNT.title,
    field: CAP_EVENT_COLLECTION_TABLE_CONFIG.TOTAL_AMOUNT.key,
    flex: 1,
    sortable: false,
    valueGetter: (params) => {
      const data = params.data as CapEvent;
      return data.totalAmount != null ? formatAmount(data.totalAmount) : '-';
    },
    headerComponent: TableHeaderWithTooltip,
    headerComponentParams: {
      headerAlignment: 'flex-end',
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
      noRowsText="No data available"
    />
  );
};
