'use client';

import React, { FC, useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
} from 'ag-grid-community';

import { Header, TableWrapper } from './styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: themeAlpine });

type Props = {
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
};

const ConfigurationTable: FC<Props> = ({
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
}) => {
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
    // Then apply any saved widths/order/etc
    if (lastColumnStateRef.current?.length) {
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

  const safeRowData = useMemo(() => {
    if (!Array.isArray(rowData)) return [] as unknown[];
    // Avoid MobX strict-mode mutations by giving AG Grid cloned objects
    return rowData.map((r) => (r !== null && typeof r === 'object' ? { ...r } : r));
  }, [rowData]);

  const effectiveColumnDefs = Array.isArray(columnDefs)
    ? columnDefs.map((def) => {
        const colId = def.colId ?? (typeof def.field === 'string' ? def.field : undefined);
        if (!colId) return def;
        const saved = lastColumnStateRef.current?.find((s) => s.colId === colId);
        if (saved && manuallyResizedColsRef.current.has(colId) && saved.width) {
          return { ...def, width: saved.width, flex: undefined };
        }
        return def;
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
    >
      {headerLabel && <Header>{headerLabel}</Header>}
      <AgGridReact
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
        domLayout="autoHeight"
        suppressHorizontalScroll={false}
        suppressColumnVirtualisation={true}
        suppressRowVirtualisation={true}
        rowDragManaged={true}
        animateRows={true}
        onDragStopped={onDragStopped}
        rowHeight={40}
        headerHeight={40}
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
        getRowId={(params) => {
          const data = params.data as { id?: string };
          return data.id || `row-${JSON.stringify(params.data).slice(0, 10)}`;
        }}
      />
    </TableWrapper>
  );
};

export default observer(ConfigurationTable);
