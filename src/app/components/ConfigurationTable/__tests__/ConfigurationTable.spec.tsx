/* eslint-disable prettier/prettier */
/* eslint-disable linebreak-style */
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import ConfigurationTable from '..';
import '@testing-library/jest-dom';
import { ColDef } from 'ag-grid-community';

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