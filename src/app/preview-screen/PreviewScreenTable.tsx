'use client';

import React, { FC } from 'react';
import '@/app/new/grid-styles.css';
import { AgGridReact } from 'ag-grid-react';
import { ICellRendererParams } from 'ag-grid-community';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { TableWrapper } from '@/app/components/ConfigurationTable/styles';

import { PreviewScreenTableProps } from './types';
import { usePreviewScreenTable } from '@/hooks/usePreviewScreenTable';

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
  columnDefs,
  topGridColumnDefs,
  lineItems = [],
}) => {
  const {
    topGridRows,
    mainGridRows,
    safeTopGridRows,
    safeMainGridRows,
    localeText,
    topGridContainerRef,
    mainGridContainerRef,
    handleMainGridReady,
    handleTopGridReady,
    handleMainColumnResized,
    handleMainBodyScroll,
    handleMainFirstDataRendered,
  } = usePreviewScreenTable({ rows, lineItems, isLoading, columnDefs });

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
            className="preview-top-grid"
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
              const data = params.data as { id?: string; _index?: number };
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
          className="preview-main-grid"
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
            const data = params.data as { id?: string; _index?: number };
            return data.id ?? String(data._index ?? '');
          }}
        />
      </div>
    </TableWrapper>
  );
};

export default PreviewScreenTable;
