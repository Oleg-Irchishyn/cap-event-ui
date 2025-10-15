'use client';

import React, { FC, useEffect, useMemo, useState } from 'react';
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
} from 'ag-grid-community';

import { TableWrapper } from './styles';
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
}) => {
  const defaultColDef = useMemo(
    () => ({
      resizable: false,
      sortable: false,
      filter: false,
      floatingFilter: false,
      suppressSizeToFit: false,
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

  const safeRowData = useMemo(() => {
    if (!Array.isArray(rowData)) return [] as unknown[];
    // Avoid MobX strict-mode mutations by giving AG Grid cloned objects
    return rowData.map((r) => (r !== null && typeof r === 'object' ? { ...r } : r));
  }, [rowData]);

  return (
    <TableWrapper
      data-testid={prepareDataTestId('table-wrapper', testId)}
      className={`ag-theme-alpine  ${isDisabled ? 'grid-disabled' : ''}`}
    >
      <AgGridReact
        columnDefs={columnDefs}
        rowData={safeRowData}
        defaultColDef={defaultColDef}
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
        getRowId={(params) => {
          const data = params.data as { id?: string };
          return data.id || `row-${JSON.stringify(params.data).slice(0, 10)}`;
        }}
      />
    </TableWrapper>
  );
};

export default observer(ConfigurationTable);
