import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CapEventCollectionTable } from '../CapEventCollectionTable';
import { CapEvent, CapEventStatus } from '@/clients/CapEventPackage';
import { ColDef, ValueGetterParams } from 'ag-grid-community';

// Mock ConfigurationTable
jest.mock('@/app/components/ConfigurationTable', () => {
  return function MockConfigurationTable({
    rowData,
    columnDefs,
    isLoading,
    testId,
    noRowsText,
  }: {
    rowData: CapEvent[];
    columnDefs: ColDef[];
    isLoading?: boolean;
    testId?: string;
    noRowsText?: string;
  }) {
    if (isLoading) {
      return <div data-testid={testId}>Loading...</div>;
    }
    if (rowData.length === 0) {
      return <div data-testid={testId}>{noRowsText}</div>;
    }
    return (
      <div data-testid={testId}>
        {rowData.map((row, idx) => (
          <div key={idx} data-testid={`row-${idx}`}>
            {columnDefs.map((col, colIdx) => {
              const valueGetter = col.valueGetter;
              const value =
                typeof valueGetter === 'function'
                  ? valueGetter({ data: row } as ValueGetterParams)
                  : col.field
                    ? row[col.field as keyof CapEvent]
                    : undefined;
              return (
                <span key={colIdx} data-testid={`cell-${col.field || colIdx}`}>
                  {String(value ?? '')}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    );
  };
});

// Mock TruncatedTextCell
jest.mock('../TruncatedTextCell', () => ({
  TruncatedTextCell: ({ value }: { value: string }) => <span>{String(value)}</span>,
}));

// Mock SkeletonCellRenderer
jest.mock('@/app/components/SkeletonCellRenderer', () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton-cell">Loading...</div>,
}));

describe('CapEventCollectionTable', () => {
  const createMockCapEvent = (overrides: Partial<CapEvent> = {}): CapEvent => ({
    id: '1',
    status: 'DRAFT' as CapEventStatus,
    capEventType: {
      name: 'Capital Call',
      abbreviation: 'CC',
    },
    sponsor: {
      id: 'sponsor-1',
      name: 'Test Sponsor',
    },
    fundGroup: {
      id: 'fund-1',
      name: 'Test Fund Group',
    },
    entities: [
      { id: 'entity-1', name: 'Entity 1' },
      { id: 'entity-2', name: 'Entity 2' },
    ],
    noticeDate: '2024-01-01',
    totalAmount: 1000000,
    createdAt: '2024-01-01T00:00:00Z',
    createdBy: 'John Doe',
    ...overrides,
  });

  it('renders table with capital event data', async () => {
    const mockEvents: CapEvent[] = [
      createMockCapEvent({
        id: '1',
        totalAmount: 1000000,
      }),
      createMockCapEvent({
        id: '2',
        totalAmount: 2000000,
        capEventType: { name: 'Distribution', abbreviation: 'DIST' },
      }),
    ];

    render(<CapEventCollectionTable rows={mockEvents} testId="test-table" />);

    await waitFor(() => {
      expect(screen.getByTestId('table-test-table')).toBeInTheDocument();
    });

    const row0 = screen.getByTestId('row-0');

    expect(row0.querySelector('[data-testid="cell-id"]')).toHaveTextContent('1');
    expect(row0.querySelector('[data-testid="cell-status"]')).toHaveTextContent('DRAFT');
  });

  it('shows loading state with skeleton renderer', async () => {
    const mockEvents: CapEvent[] = [createMockCapEvent()];

    render(<CapEventCollectionTable rows={mockEvents} isLoading={true} testId="test-table" />);

    await waitFor(() => {
      expect(screen.getByTestId('table-test-table')).toBeInTheDocument();
    });

    // When loading, should show loading state
    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('shows empty state when no data available', async () => {
    render(<CapEventCollectionTable rows={[]} testId="test-table" />);

    await waitFor(() => {
      expect(screen.getByTestId('table-test-table')).toBeInTheDocument();
    });

    // Should show "No data available" message
    expect(screen.getByText('No data available')).toBeInTheDocument();
  });
});
