import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AllocationPreviewTable from '../AllocationPreviewTable';
import React from 'react';

jest.mock('@/app/components/ConfigurationTable', () => {
  return jest.fn(({ testId }) => <div data-testid={testId}>table</div>);
});

jest.mock('@/utils/prepareDataTestId', () => ({
  prepareDataTestId: (type: string, id: string) => `${type}-${id}`,
}));

jest.mock('@/utils/getAllocationPreviewColumnDefs', () => ({
  getAllocationPreviewColumnDefs: jest.fn(() => []),
}));

jest.mock('@/utils/definedColumnForAllocationPreview', () => ({
  defineColumnForAllocationPreview: jest.fn((basis: string) => basis),
}));

jest.mock('mobx-react-lite', () => ({
  observer: <P extends object>(Component: React.ComponentType<P>) => Component,
}));

describe('AllocationPreviewTable', () => {
  const defaultProps = {
    rows: [],
    isLoading: false,
    allocationBasis: 'commitment',
  };

  test('renders placeholder rows when loading and rows empty', () => {
    render(<AllocationPreviewTable {...defaultProps} isLoading={true} rows={[]} />);
    expect(screen.getByTestId('table-allocation-preview-table')).toBeInTheDocument();
  });

  test('renders rows when data is provided', () => {
    const rows = [
      { is: 'row1', investor: 'Investor 1', amount: 100 },
      { is: 'row2', investor: 'Investor 2', amount: 200 },
    ];
    render(<AllocationPreviewTable {...defaultProps} isLoading={false} rows={rows} />);
    expect(screen.getByTestId('table-allocation-preview-table')).toBeInTheDocument();
  });

  test('uses allocationBasis to define column defs', () => {
    const rows = [{ is: 'row1', investor: 'Investor 1', amount: 100 }];
    render(<AllocationPreviewTable {...defaultProps} allocationBasis="commitment" rows={rows} />);
    expect(screen.getByTestId('table-allocation-preview-table')).toBeInTheDocument();
  });

  test('allows overriding testid', () => {
    render(<AllocationPreviewTable {...defaultProps} testId="custom-id" />);
    expect(screen.getByTestId('table-custom-id')).toBeInTheDocument();
  });

  test('calls defineColumnForAllocationPreview and getAllocationPreviewColumnDefs with correct args', () => {
    const { defineColumnForAllocationPreview } = jest.requireMock(
      '@/utils/definedColumnForAllocationPreview',
    );
    const { getAllocationPreviewColumnDefs } = jest.requireMock(
      '@/utils/getAllocationPreviewColumnDefs',
    );

    render(<AllocationPreviewTable {...defaultProps} allocationBasis="commitment" rows={[]} />);

    expect(defineColumnForAllocationPreview).toHaveBeenCalledWith('commitment');
    expect(getAllocationPreviewColumnDefs).toHaveBeenCalledWith('commitment', 'commitment', false);
  });

  test('provides 5 placeholder rows while loading with empty rows', () => {
    const ConfigurationTable = jest.requireMock('@/app/components/ConfigurationTable');
    ConfigurationTable.mockClear();

    render(<AllocationPreviewTable {...defaultProps} isLoading={true} rows={[]} />);

    const lastCallProps = ConfigurationTable.mock.calls[0][0];
    expect(Array.isArray(lastCallProps.rowData)).toBe(true);
    expect(lastCallProps.rowData).toHaveLength(5);
    expect(lastCallProps.pinnedBottomRowData).toBeTruthy();
    const totalRow = lastCallProps.pinnedBottomRowData[0];
    expect(totalRow.customerId).toBe('Total');
    expect(totalRow.allocatedAmount).toBe(0);
    expect(totalRow.commitment).toBe(0);
    expect(totalRow.managementFee).toBe(0);
  });

  test('computes pinned bottom totals from rows when data present', () => {
    const ConfigurationTable = jest.requireMock('@/app/components/ConfigurationTable');
    ConfigurationTable.mockClear();

    const rows = [
      { allocatedAmount: 100, trType: 0, nav: 10, managementFee: 5 },
      { allocatedAmount: 200, trType: -1, nav: 20, managementFee: 1 },
    ];

    render(<AllocationPreviewTable rows={rows} isLoading={false} allocationBasis="nav" />);

    const lastCallProps = ConfigurationTable.mock.calls[0][0];
    expect(lastCallProps.pinnedBottomRowData).toBeTruthy();
    const totalRow = lastCallProps.pinnedBottomRowData[0];
    expect(totalRow.customerId).toBe('Total');
    // allocatedAmount: 100 + (200 * -1) = -100
    expect(totalRow.allocatedAmount).toBe(-100);
    // dynamic column 'nav': 10 + 20 = 30
    expect(totalRow.nav).toBe(30);
    // managementFee: 5 + 1 = 6
    expect(totalRow.managementFee).toBe(6);
  });

  test('does not pass pinnedBottomRowData when there are no rows and not loading', () => {
    const ConfigurationTable = jest.requireMock('@/app/components/ConfigurationTable');
    ConfigurationTable.mockClear();

    render(<AllocationPreviewTable {...defaultProps} isLoading={false} rows={[]} />);

    const lastCallProps = ConfigurationTable.mock.calls[0][0];
    expect(lastCallProps.rowData).toEqual([]);
    expect(lastCallProps.pinnedBottomRowData).toBeUndefined();
  });
});
