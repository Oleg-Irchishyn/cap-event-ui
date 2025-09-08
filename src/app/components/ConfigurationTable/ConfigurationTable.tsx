'use client';

import React, { FC, useMemo } from 'react';
import { observer } from 'mobx-react-lite';
import { AgGridReact } from 'ag-grid-react';
import {
  AllCommunityModule,
  CellValueChangedEvent,
  ColDef,
  ModuleRegistry,
  provideGlobalGridOptions,
  themeAlpine,
} from 'ag-grid-community';

import { TableWrapper } from './styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

ModuleRegistry.registerModules([AllCommunityModule]);
provideGlobalGridOptions({ theme: themeAlpine });

type Props = {
  columnDefs: ColDef[];
  rowData: unknown[];
  onCellValueChanged: (e: CellValueChangedEvent) => void;
  testId: string;
};

const ConfigurationTable: FC<Props> = ({ columnDefs, rowData, onCellValueChanged, testId }) => {
  const defaultColDef = useMemo(
    () => ({
      resizable: false,
      sortable: false,
      filter: false,
      floatingFilter: false,
      suppressSizeToFit: false,
    }),
    [],
  );

  return (
    <TableWrapper
      data-testid={prepareDataTestId('table-wrapper', testId)}
      className="ag-theme-alpine"
    >
      <AgGridReact
        columnDefs={columnDefs}
        rowData={rowData}
        defaultColDef={defaultColDef}
        onCellValueChanged={onCellValueChanged}
        rowSelection="multiple"
        animateRows={true}
        pagination={false}
        suppressPaginationPanel={true}
        domLayout="autoHeight"
        suppressHorizontalScroll={false}
        suppressColumnVirtualisation={false}
        suppressRowVirtualisation={false}
        rowHeight={40}
        headerHeight={40}
      />
    </TableWrapper>
  );
};

export default observer(ConfigurationTable);
