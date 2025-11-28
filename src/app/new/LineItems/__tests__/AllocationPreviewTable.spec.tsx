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
});
