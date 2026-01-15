'use client';

import React, { FC, useMemo, useRef, useCallback, useEffect } from 'react';
import '@/app/new/grid-styles.css';
import { AgGridReact } from 'ag-grid-react';
import {
  GridApi,
  GridReadyEvent,
  ColDef,
  ColumnState,
  ColumnResizedEvent,
  BodyScrollEvent,
  ICellRendererParams,
} from 'ag-grid-community';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import {
  getPreviewScreenColumnDefs,
  getDynamicColumnsDefs,
  getTopDynamicColumnDefs,
} from '@/utils/getPreviewScreenColumnDefs';
import { TableWrapper } from '@/app/components/ConfigurationTable/styles';

import { PreviewScreenRow, PreviewScreenTableProps } from './types';
import { capEventSettingsStore } from '@/stores';
import SkeletonCellRenderer from '@/app/components/SkeletonCellRenderer';
import {
  AMOUNT_FIELD,
  COMMITMENT_FIELD,
  TOTAL_AMOUNT_DUE_HEADER,
  TOTAL_CAPITAL_COMMITMENT_HEADER,
} from '@/const/previewScreen';

const LINE_ITEMS_FIELDS = 'lineItemsFields';
const GENERAL_INFO = 'generalInfo';

const AGAINST_COMMITMENT_TITLE = 'Against Commitment';
const PR_DATE_TITLE = 'PR Date';
const PR_FLAG__TITLE = 'PR Flag';

export const GeneralInfoCell: FC<ICellRendererParams> = ({ data }) => {
  if (!data) return null;

  return <div style={{ padding: '8px', lineHeight: '1.5' }}></div>;
};

export const CombinedTitleCell: FC<ICellRendererParams> = ({ node }) => {
  const rowIndex = node?.rowIndex ?? 0;

  let title = '';
  if (rowIndex === 0) {
    title = AGAINST_COMMITMENT_TITLE;
  } else if (rowIndex === 1) {
    title = PR_DATE_TITLE;
  } else if (rowIndex === 2) {
    title = PR_FLAG__TITLE;
  }

  return <div style={{ padding: '8px', color: '#0067A3' }}>{title}</div>;
};

const PreviewScreenTable: FC<PreviewScreenTableProps> = ({
  rows,
  testId = 'preview-screen-table',
  isLoading = false,
  onRowClicked,
}) => {
  const lineItems = useMemo(() => [...capEventSettingsStore.entitiesLineItem], []);

  const topGridApiRef = useRef<GridApi | null>(null);
  const mainGridApiRef = useRef<GridApi | null>(null);

  const topGridContainerRef = useRef<HTMLDivElement | null>(null);
  const mainGridContainerRef = useRef<HTMLDivElement | null>(null);

  const isSyncingRef = useRef(false);

  const staticColumns = useMemo(() => getPreviewScreenColumnDefs(isLoading), [isLoading]);
  const dynamicColumns = useMemo(
    () => getDynamicColumnsDefs(lineItems, isLoading),
    [isLoading, lineItems],
  );

  const topDynamicColumnDefs = useMemo(
    () => getTopDynamicColumnDefs(lineItems, isLoading),
    [isLoading, lineItems],
  );

  const columnDefs = useMemo(
    () => [...staticColumns, ...dynamicColumns],
    [staticColumns, dynamicColumns],
  );

  const topGridColumnDefs = useMemo(() => {
    const combinedGeneralInfoColumn: ColDef = {
      headerName: 'General Info',
      field: GENERAL_INFO,
      flex: 6.7,
      sortable: false,
      resizable: true,
      cellRenderer: isLoading ? SkeletonCellRenderer : GeneralInfoCell,
      cellRendererParams: isLoading ? { widthPercent: 100 } : undefined,
    };

    const combinedTitleColumn: ColDef = {
      headerName: 'Titles',
      field: LINE_ITEMS_FIELDS,
      flex: 2.5,
      sortable: false,
      resizable: true,
      cellStyle: { textAlign: 'right' },
      cellRenderer: isLoading ? SkeletonCellRenderer : CombinedTitleCell,
      cellRendererParams: isLoading ? { widthPercent: 100 } : undefined,
    };

    const totalCommitmentColumn: ColDef = {
      headerName: TOTAL_CAPITAL_COMMITMENT_HEADER,
      field: COMMITMENT_FIELD,
      flex: 1.5,
      sortable: false,
      resizable: true,
      minWidth: 100,
      headerClass: 'ag-right-aligned-header',
      cellStyle: { textAlign: 'right' },
      valueGetter: () => '',
      cellRendererSelector: () =>
        isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
    };

    const totalAmountDueColumn: ColDef = {
      headerName: TOTAL_AMOUNT_DUE_HEADER,
      field: AMOUNT_FIELD,
      flex: 1,
      sortable: false,
      resizable: true,
      minWidth: 100,
      headerClass: 'ag-right-aligned-header',
      cellStyle: { textAlign: 'right' },
      valueGetter: () => '',
      cellRendererSelector: () =>
        isLoading ? { component: SkeletonCellRenderer, params: { widthPercent: 40 } } : undefined,
    };

    return [
      combinedGeneralInfoColumn,
      combinedTitleColumn,
      ...topDynamicColumnDefs,
      totalCommitmentColumn,
      totalAmountDueColumn,
    ];
  }, [topDynamicColumnDefs, isLoading]);

  const topGridRows = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 3 }).map(
        (_, index) =>
          ({
            id: `top-skeleton-${index}`,
          }) as PreviewScreenRow,
      );
    }

    if (!Array.isArray(rows) || rows.length === 0) {
      return [];
    }

    const topRows: Array<Partial<PreviewScreenRow>> = [];

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const rowData: Partial<PreviewScreenRow> & Record<string, string | undefined> = {
        id: `top-row-${rowIndex}`,
      };

      lineItems.forEach(([, lineItemRows]) => {
        lineItemRows.forEach((lineItem) => {
          if (rowIndex === 0) {
            rowData[lineItem.id] = lineItem.insideCommitment;
          } else if (rowIndex === 1) {
            rowData[lineItem.id] = lineItem.prDate
              ? new Date(lineItem.prDate).toLocaleDateString()
              : '';
          } else if (rowIndex === 2) {
            rowData[lineItem.id] = lineItem.prFlag;
          }
        });
      });

      topRows.push(rowData);
    }

    return topRows;
  }, [isLoading, rows, lineItems]);

  const mainGridRows = useMemo(() => {
    if (!isLoading || (Array.isArray(rows) && rows.length > 0)) {
      return rows ?? [];
    }
    const placeholderCount = columnDefs.length;
    return Array.from({ length: placeholderCount }).map(
      (_, index) =>
        ({
          id: `skeleton-${index}`,
        }) as PreviewScreenRow,
    );
  }, [columnDefs.length, isLoading, rows]);

  const safeTopGridRows = useMemo(() => {
    return topGridRows.map((r, i) => {
      if (r !== null && typeof r === 'object') {
        return { ...r, _index: i } as PreviewScreenRow & { _index: number };
      }
      return { value: r, _index: i } as unknown as PreviewScreenRow & { _index: number };
    });
  }, [topGridRows]);

  const safeMainGridRows = useMemo(() => {
    return mainGridRows.map((r, i) => {
      if (r !== null && typeof r === 'object') {
        return { ...r, _index: i } as PreviewScreenRow & { _index: number };
      }
      return { value: r, _index: i } as unknown as PreviewScreenRow & { _index: number };
    });
  }, [mainGridRows]);

  // Synchronize column state from main grid to top grid
  // This ensures widths, order, pinning, and visibility stay aligned
  // Note: Top grid combines first 4 columns into General Info and columns 5-6 into Titles.
  const syncColumnStateToTopGrid = useCallback(() => {
    if (isSyncingRef.current || !mainGridApiRef.current || !topGridApiRef.current) return;

    isSyncingRef.current = true;
    try {
      const mainColumnState = mainGridApiRef.current.getColumnState();

      const topColumnState: ColumnState[] = [];

      const first4Columns = mainColumnState.slice(0, 4);
      const combinedWidth = first4Columns.reduce((sum, col) => {
        return sum + (col.width || 0);
      }, 0);

      if (combinedWidth > 0) {
        topColumnState.push({
          colId: GENERAL_INFO,
          width: combinedWidth,
          pinned: first4Columns[0]?.pinned || null,
          hide: first4Columns.some((col) => col.hide) || false,
        });
      }

      const columns5and6 = mainColumnState.slice(4, 6);
      const combinedTitleWidth = columns5and6.reduce((sum, col) => {
        return sum + (col.width || 0);
      }, 0);

      if (combinedTitleWidth > 0) {
        topColumnState.push({
          colId: LINE_ITEMS_FIELDS,
          width: combinedTitleWidth,
          pinned: columns5and6[0]?.pinned || null,
          hide: columns5and6.some((col) => col.hide) || false,
        });
      }

      const remainingColumns = mainColumnState.slice(6);
      topColumnState.push(...remainingColumns);

      topGridApiRef.current.applyColumnState({
        state: topColumnState,
        applyOrder: true,
      });
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const syncHorizontalScroll = useCallback((scrollLeft: number) => {
    if (isSyncingRef.current || !topGridContainerRef.current) return;

    isSyncingRef.current = true;
    try {
      const topCenterViewport = topGridContainerRef.current.querySelector(
        '.ag-center-cols-viewport',
      ) as HTMLElement;
      if (topCenterViewport) {
        topCenterViewport.scrollLeft = scrollLeft;
      }

      const scrollContainer = topGridContainerRef.current.querySelector(
        '.ag-body-horizontal-scroll-viewport',
      ) as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollLeft = scrollLeft;
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const handleMainGridReady = useCallback(
    (params: GridReadyEvent) => {
      mainGridApiRef.current = params.api;
      if (topGridApiRef.current) {
        setTimeout(() => syncColumnStateToTopGrid(), 0);
      }
    },
    [syncColumnStateToTopGrid],
  );

  const handleTopGridReady = useCallback(
    (params: GridReadyEvent) => {
      topGridApiRef.current = params.api;
      if (mainGridApiRef.current) {
        setTimeout(() => syncColumnStateToTopGrid(), 0);
      }
    },
    [syncColumnStateToTopGrid],
  );

  const handleMainColumnResized = useCallback(
    (e: ColumnResizedEvent) => {
      if (!e.finished || isSyncingRef.current) return;
      syncColumnStateToTopGrid();
      if (mainGridContainerRef.current) {
        const scrollContainer = mainGridContainerRef.current.querySelector(
          '.ag-body-horizontal-scroll-viewport',
        ) as HTMLElement;
        if (scrollContainer) {
          syncHorizontalScroll(scrollContainer.scrollLeft);
        }
      }
    },
    [syncColumnStateToTopGrid, syncHorizontalScroll],
  );

  const handleMainBodyScroll = useCallback(
    (e: BodyScrollEvent) => {
      if (isSyncingRef.current || e.direction !== 'horizontal') return;

      if (mainGridContainerRef.current) {
        const centerViewport = mainGridContainerRef.current.querySelector(
          '.ag-center-cols-viewport',
        ) as HTMLElement;
        if (centerViewport) {
          syncHorizontalScroll(centerViewport.scrollLeft);
        } else {
          syncHorizontalScroll(e.left);
        }
      } else {
        syncHorizontalScroll(e.left);
      }
    },
    [syncHorizontalScroll],
  );

  const handleMainFirstDataRendered = useCallback(() => {
    if (isSyncingRef.current) return;
    syncColumnStateToTopGrid();
  }, [syncColumnStateToTopGrid]);

  useEffect(() => {
    if (mainGridApiRef.current && topGridApiRef.current) {
      setTimeout(() => syncColumnStateToTopGrid(), 0);
    }
  }, [columnDefs, syncColumnStateToTopGrid]);

  const localeText = useMemo(
    () => ({
      noRowsToShow: 'No Data to display',
    }),
    [],
  );

  return (
    <TableWrapper
      data-testid={prepareDataTestId('table-wrapper', testId)}
      className="ag-theme-alpine"
      style={{ display: 'flex', flexDirection: 'column', minWidth: '1200px' }}
    >
      {topGridRows.length > 0 && (
        <div
          ref={topGridContainerRef}
          style={{
            width: '100%',
            overflow: 'hidden',
          }}
          className="ag-theme-alpine preview-top-grid"
        >
          <AgGridReact
            columnDefs={topGridColumnDefs}
            rowData={safeTopGridRows}
            suppressClickEdit={true}
            localeText={localeText}
            rowSelection="multiple"
            pagination={false}
            suppressPaginationPanel={true}
            domLayout="autoHeight"
            suppressHorizontalScroll={true}
            suppressColumnVirtualisation={true}
            suppressRowVirtualisation={true}
            rowHeight={40}
            headerHeight={0}
            onGridReady={handleTopGridReady}
            getRowId={(params) => {
              const data = params.data as PreviewScreenRow & { id?: string; _index?: number };
              return data.id ?? String(data._index ?? '');
            }}
          />
        </div>
      )}

      <div
        ref={mainGridContainerRef}
        style={{
          width: '100%',
          height: mainGridRows.length > 10 ? '60vh' : undefined,
        }}
        className="ag-theme-alpine"
      >
        <AgGridReact
          columnDefs={columnDefs}
          rowData={safeMainGridRows}
          suppressClickEdit={true}
          onRowClicked={onRowClicked}
          rowClass={onRowClicked ? 'clickable-row' : ''}
          localeText={localeText}
          rowSelection="multiple"
          pagination={false}
          suppressPaginationPanel={true}
          domLayout={mainGridRows.length > 10 ? undefined : 'autoHeight'}
          suppressHorizontalScroll={false}
          suppressColumnVirtualisation={true}
          suppressRowVirtualisation={true}
          rowHeight={40}
          headerHeight={80}
          onGridReady={handleMainGridReady}
          onFirstDataRendered={handleMainFirstDataRendered}
          onColumnResized={handleMainColumnResized}
          onBodyScroll={handleMainBodyScroll}
          getRowId={(params) => {
            const data = params.data as PreviewScreenRow & { id?: string; _index?: number };
            return data.id ?? String(data._index ?? '');
          }}
        />
      </div>
    </TableWrapper>
  );
};

export default PreviewScreenTable;
