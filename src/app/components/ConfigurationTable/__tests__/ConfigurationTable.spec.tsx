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
});