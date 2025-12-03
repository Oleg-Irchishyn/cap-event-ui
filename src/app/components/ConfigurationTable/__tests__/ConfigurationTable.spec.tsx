/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ConfigurationTable from '..';
import '@testing-library/jest-dom';
import { ColDef } from 'ag-grid-community';
import * as AgGridReactModule from 'ag-grid-react';

jest.mock('ag-grid-react', () => {
  let latestProps: unknown;

  type MockGridProps = {
    columnDefs: ColDef[];
    rowData?: Array<Record<string, unknown>>;
    onGridReady?: (e: { api: { applyColumnState: (a: unknown) => void; getColumnState: () => unknown } }) => void;
    onSortChanged?: (e: { api: { getColumnState: () => unknown } }) => void;
    onFirstDataRendered?: () => void;
  };
  type WithHelper = ((props: MockGridProps) => React.ReactElement) & {
    __getLatestProps: () => MockGridProps;
  };
  const AgGridReact: WithHelper = (props: MockGridProps) => {
    latestProps = props;
    // Render a minimal static view of cells so text queries work
    const rows = Array.isArray(props.rowData) ? props.rowData : [];
    const cols = Array.isArray(props.columnDefs) ? props.columnDefs : [];
    const cells: React.ReactElement[] = [];
    rows.forEach((r, ri) => {
      cols.forEach((c, ci) => {
        const field = typeof c.field === 'string' ? c.field : undefined;
        if (field && r[field] !== undefined) {
          cells.push(
            React.createElement(
              'div',
              { key: `r${ri}c${ci}`, 'data-testid': 'cell' },
              String(r[field] as unknown as string),
            ),
          );
        }
      });
    });
    return React.createElement('div', { 'data-testid': 'ag-grid-react-mock' }, cells);
  };
  AgGridReact.__getLatestProps = () => latestProps as MockGridProps;
  return { AgGridReact };
});

beforeAll(() => {
  (global as unknown as { ResizeObserver: new () => ResizeObserver }).ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const basicColumns: ColDef[] = [{ headerName: 'Name', field: 'name' }];

describe('ConfigurationTable', () => {
  test('renders provided row data', async () => {
    render(
      <ConfigurationTable
        columnDefs={basicColumns}
        rowData={[{ id: '1', name: 'John Doe' }]}
        onCellValueChanged={jest.fn()}
        testId="ct"
      />,
    );

    expect(await screen.findByText('John Doe')).toBeInTheDocument();
  });

  test('does not show no rows overlay while loading with empty data', async () => {
    render(
      <ConfigurationTable
        columnDefs={basicColumns}
        rowData={[]}
        isLoading
        onCellValueChanged={jest.fn()}
        testId="ct-loading"
      />,
    );

    await waitFor(() => {
      expect(screen.queryByText('No Data to display')).not.toBeInTheDocument();
    });
  });

  test('applies wrapper data-testid using prepareDataTestId', async () => {
    render(
      <ConfigurationTable columnDefs={basicColumns} rowData={[]} testId="ct-wrapper" />,
    );

    const wrapper = await screen.findByTestId('table-wrapper-ct-wrapper');
    expect(wrapper).toBeInTheDocument();
  });

  test('adds disabled class when isDisabled is true', async () => {
    render(
      <ConfigurationTable columnDefs={basicColumns} rowData={[]} isDisabled testId="ct-disabled" />,
    );

    const wrapper = await screen.findByTestId('table-wrapper-ct-disabled');
    expect(wrapper.className).toContain('grid-disabled');
  });

  test('clones object rows to avoid mobx mutations (safeRowData)', async () => {
    const originalRow = { id: 'r1', name: 'Alice' } as { id: string; name: string; extra?: string };

    render(
      <ConfigurationTable
        columnDefs={basicColumns}
        rowData={[originalRow]}
        testId="ct-clone"
      />,
    );


    expect(await screen.findByText('Alice')).toBeInTheDocument();
    originalRow.name = 'Changed Outside';
    expect(screen.getByText('Alice')).toBeInTheDocument();
  });

  test('getRowId fallback generates a stable id when missing', async () => {
    const rows = [{ name: 'NoIdUser' }];
    render(
      <ConfigurationTable
        columnDefs={basicColumns}
        rowData={rows}
        testId="ct-fallback-id"
      />,
    );

    expect(await screen.findByText('NoIdUser')).toBeInTheDocument();
  });

  test('uses new rowSelection object API without crashing', async () => {
    render(
      <ConfigurationTable
        columnDefs={basicColumns}
        rowData={[{ id: '1', name: 'X' }]}
        testId="ct-row-selection"
      />,
    );

    expect(await screen.findByText('X')).toBeInTheDocument();
  });
});

describe('ConfigurationTable - sorting behaviour', () => {
  const sortedColumns: ColDef[] = [
    { headerName: 'A', field: 'a', sortable: true, sort: 'asc', sortIndex: 0 },
    { headerName: 'B', field: 'b', sortable: true, sort: 'asc', sortIndex: 1 },
  ];

  const rows = [
    { id: '1', a: 'x', b: 'y' },
    { id: '2', a: 'x2', b: 'y2' },
  ];

  type LatestProps = {
    columnDefs: ColDef[];
    onGridReady?: (e: { api: { applyColumnState: (a: unknown) => void; getColumnState: () => unknown } }) => void;
    onSortChanged?: (e: { api: { getColumnState: () => unknown } }) => void;
    onFirstDataRendered?: () => void;
  };
  const getLatestProps = (): LatestProps =>
    (AgGridReactModule as unknown as { AgGridReact: { __getLatestProps: () => LatestProps } }).AgGridReact.__getLatestProps();

  test('initial render preserves default sort when there is no saved sort', async () => {
    render(<ConfigurationTable columnDefs={sortedColumns} rowData={rows} testId="ct-sort-1" />);

    const latestProps = getLatestProps();

    expect(latestProps.columnDefs[0].sort).toBe('asc');
    expect(latestProps.columnDefs[0].sortIndex).toBe(0);
    expect(latestProps.columnDefs[1].sort).toBe('asc');
    expect(latestProps.columnDefs[1].sortIndex).toBe(1);
  });

  test('after a saved sort exists, default sorts from defs are stripped on re-render', async () => {
    const { rerender } = render(
      <ConfigurationTable columnDefs={sortedColumns} rowData={rows} testId="ct-sort-2" />,
    );

    const fakeApi = {
      applyColumnState: jest.fn(),
      getColumnState: jest.fn(),
      hideOverlay: jest.fn(),
      showNoRowsOverlay: jest.fn(),
    };

    let latestProps = getLatestProps();
    latestProps.onGridReady?.({ api: fakeApi });

    const savedState = [{ colId: 'commitment', sort: 'desc', sortIndex: 0 }];
    latestProps.onSortChanged?.({
      api: { getColumnState: () => savedState },
    });

    rerender(<ConfigurationTable columnDefs={[...sortedColumns]} rowData={rows} testId="ct-sort-2" />);

    latestProps = getLatestProps();

    expect(latestProps.columnDefs[0].sort).toBeUndefined();
    expect(latestProps.columnDefs[0].sortIndex).toBeUndefined();
    expect(latestProps.columnDefs[1].sort).toBeUndefined();
    expect(latestProps.columnDefs[1].sortIndex).toBeUndefined();

    latestProps.onFirstDataRendered?.();
    expect(fakeApi.applyColumnState).toHaveBeenCalled();
    const calls = (fakeApi.applyColumnState as jest.Mock).mock.calls;
    
    const hasClearCall = calls.some((args) => args[0]?.defaultState?.sort === null);
    const hasApplySavedCall = calls.some((args) => Array.isArray(args[0]?.state) && args[0].state.length);
    expect(hasClearCall).toBe(true);
    expect(hasApplySavedCall).toBe(true);
  });
});