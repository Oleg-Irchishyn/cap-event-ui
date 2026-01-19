'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  CellValueChangedEvent,
  ColDef,
  GridApi,
  GridReadyEvent,
  ModuleRegistry,
  provideGlobalGridOptions,
  RowClickedEvent,
  themeAlpine,
  DragStoppedEvent,
  ColumnState,
  ColumnResizedEvent,
  RowStyle,
  PostSortRowsParams,
  SortChangedEvent,
} from 'ag-grid-community';

import { Header, TableWrapper } from './styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: themeAlpine });

type Props<T> = {
  columnDefs: ColDef[];
  rowData: unknown[];
  onCellValueChanged?: (e: CellValueChangedEvent) => void;
  testId: string;
  isDisabled?: boolean;
  noRowsText?: string;
  isLoading?: boolean;
  onRowClicked?: (e: RowClickedEvent) => void;
  onDragStopped?: (e: DragStoppedEvent) => void;
  headerLabel?: string;
  height?: number | string; // when provided, grid will use internal scroll with fixed container height
  pinnedBottomRowData?: T[];
  postSortRows?: (params: PostSortRowsParams) => void;
  headerHeight?: number;
};

interface RowData {
  id?: string;
  value?: unknown;
  _index: number;
  [key: string]: unknown;
}

type GridRow = {
  [key: string]: unknown;
  _index: number;
};

const ConfigurationTable = <T,>({
  columnDefs,
  rowData,
  onCellValueChanged,
  testId,
  isDisabled,
  noRowsText,
  isLoading,
  onRowClicked,
  onDragStopped,
  headerLabel,
  height,
  pinnedBottomRowData,
  postSortRows,
  headerHeight,
}: Props<T>) => {
  const defaultColDef = useMemo(
    () => ({
      resizable: false,
      sortable: false,
      filter: false,
      floatingFilter: false,
      suppressSizeToFit: true,
      suppressMovable: true,
    }),
    [],
  );

  const localeText = useMemo(
    () => ({
      noRowsToShow: noRowsText ?? 'No Data to display',
    }),
    [noRowsText],
  );

  const [gridApi, setGridApi] = useState<GridApi | null>(null);
  const lastColumnStateRef = useRef<ColumnState[] | null>(null);
  const manuallyResizedColsRef = useRef<Set<string>>(new Set());
  // no-op state removed; rely on applySavedColumnState triggers

  const applyColumnStateFromDefsAndSaved = useCallback(() => {
    if (!gridApi) return;
    // Apply pinned state from columnDefs first
    const pinnedState: ColumnState[] = columnDefs
      .map((def): ColumnState | null => {
        const colId = def.colId ?? (typeof def.field === 'string' ? def.field : undefined);
        if (!colId || def.pinned === undefined || def.pinned === null) return null;
        return { colId, pinned: def.pinned };
      })
      .filter((s): s is ColumnState => s !== null);
    if (pinnedState.length) {
      gridApi.applyColumnState({
        defaultState: { pinned: null },
        state: pinnedState,
        applyOrder: false,
      });
    }
    const hasSavedSort =
      lastColumnStateRef.current?.some((s) => s.sort != null && s.sort !== undefined) ?? false;
    // Only clear sorts and reapply if we actually have saved sort state.
    if (hasSavedSort) {
      gridApi.applyColumnState({
        defaultState: { sort: null, sortIndex: null },
        state: [],
        applyOrder: false,
      });
      if (lastColumnStateRef.current?.length) {
        gridApi.applyColumnState({ state: lastColumnStateRef.current, applyOrder: false });
      }
    } else if (lastColumnStateRef.current?.length) {
      // Apply saved widths/order/etc without touching sorts
      gridApi.applyColumnState({ state: lastColumnStateRef.current, applyOrder: false });
    }
  }, [gridApi, columnDefs]);

  useEffect(() => {
    if (!gridApi) return;
    const isEmpty = !rowData || (Array.isArray(rowData) && rowData.length === 0);
    if (isEmpty) {
      if (isLoading) {
        gridApi.hideOverlay();
      } else {
        gridApi.showNoRowsOverlay();
      }
      return;
    }
    gridApi.hideOverlay();
  }, [gridApi, isLoading, rowData]);

  // Ensure pinned state and saved widths persist across re-renders/resizing
  useEffect(() => {
    applyColumnStateFromDefsAndSaved();
  }, [applyColumnStateFromDefsAndSaved]);

  const safeRowData: GridRow[] = useMemo(() => {
    if (!Array.isArray(rowData)) return [];
    // Avoid MobX strict-mode mutations by giving AG Grid cloned objects
    return rowData.map((r, i) =>
      r !== null && typeof r === 'object' ? { ...r, _index: i } : { value: r, _index: i },
    );
  }, [rowData]);

  const effectiveColumnDefs = Array.isArray(columnDefs)
    ? columnDefs.map((def) => {
        const colId = def.colId ?? (typeof def.field === 'string' ? def.field : undefined);
        if (!colId) return def;
        // If we have any saved sort state, strip default sort/sortIndex from defs
        // so AG Grid does not re-apply initial sorts on re-mount/re-render.
        const hasSavedSort =
          lastColumnStateRef.current?.some((s) => s.sort != null && s.sort !== undefined) ?? false;
        let derivedDef = def;
        if (hasSavedSort && derivedDef.sortable) {
          // remove default sort indicators coming from definitions
          derivedDef = { ...derivedDef, sort: undefined, sortIndex: undefined };
        }
        const saved = lastColumnStateRef.current?.find((s) => s.colId === colId);
        if (saved && manuallyResizedColsRef.current.has(colId) && saved.width) {
          return { ...derivedDef, width: saved.width, flex: undefined };
        }
        return derivedDef;
      })
    : columnDefs;

  const handleColumnResized = useCallback((e: ColumnResizedEvent) => {
    if (!e.finished || !e.api) return;
    lastColumnStateRef.current = e.api.getColumnState();
    if (e.source === 'uiColumnResized') {
      if (e.columns?.length) {
        e.columns.forEach((c) => manuallyResizedColsRef.current.add(c.getColId()));
      } else if (e.column) {
        manuallyResizedColsRef.current.add(e.column.getColId());
      }
    }
  }, []);

  return (
    <TableWrapper
      data-testid={prepareDataTestId('table-wrapper', testId)}
      className={`ag-theme-alpine  ${isDisabled ? 'grid-disabled' : ''}`}
      style={height ? { height } : undefined}
    >
      {headerLabel && <Header>{headerLabel}</Header>}
      <AgGridReact<RowData>
        columnDefs={effectiveColumnDefs}
        rowData={safeRowData}
        defaultColDef={defaultColDef}
        suppressClickEdit={true}
        onCellValueChanged={onCellValueChanged}
        onRowClicked={onRowClicked}
        rowClass={onRowClicked ? 'clickable-row' : ''}
        localeText={localeText}
        rowSelection="multiple"
        pagination={false}
        suppressPaginationPanel={true}
        domLayout={height ? undefined : 'autoHeight'}
        suppressHorizontalScroll={false}
        suppressColumnVirtualisation={true}
        suppressRowVirtualisation={true}
        rowDragManaged={true}
        animateRows={true}
        onDragStopped={onDragStopped}
        rowHeight={40}
        headerHeight={headerHeight ?? 40}
        onGridReady={(params: GridReadyEvent) => {
          setGridApi(params.api);
        }}
        onGridSizeChanged={() => {
          applyColumnStateFromDefsAndSaved();
        }}
        onFirstDataRendered={() => {
          applyColumnStateFromDefsAndSaved();
        }}
        onColumnResized={handleColumnResized}
        postSortRows={postSortRows}
        onSortChanged={(e: SortChangedEvent) => {
          lastColumnStateRef.current = e.api.getColumnState();
        }}
        getRowId={(params) => {
          const data = params.data as GridRow & { id?: string };
          return data.id ?? String(data._index);
        }}
        pinnedBottomRowData={pinnedBottomRowData}
        getRowStyle={(params): RowStyle | undefined => {
          if (params.node.rowPinned) {
            return { fontWeight: 'bold' };
          }
          return undefined;
        }}
      />
    </TableWrapper>
  );
};

export default observer(ConfigurationTable);
