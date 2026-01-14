import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { CapEventCollectionTable } from '../CapEventCollectionTable';
import { CapEvent, CapEventStatus } from '@/clients/CapEventPackage';
import { ColDef, ValueGetterParams } from 'ag-grid-community';

let lastColumnDefs: ColDef[] | null = null;

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
    lastColumnDefs = columnDefs;
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
    name: 'Test Capital Event',
    status: 'DRAFT' as CapEventStatus,
    capEventType: {
      name: 'Capital Call',
      abbreviation: 'CC',
    },
    sponsor: 'sponsor-1 - Test Sponsor' as unknown as CapEvent['sponsor'],
    fundGroup: 'fund-1 - Test Fund Group' as unknown as CapEvent['fundGroup'],
    entities: [
      { id: 'entity-1', name: 'Entity 1' },
      { id: 'entity-2', name: 'Entity 2' },
    ],
    noticeDate: '2024-01-01',
    totalAmount: 1000000,
    modifiedAt: '2024-01-01T00:00:00Z',
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

    expect(row0.querySelector('[data-testid="cell-capEvent"]')).toHaveTextContent(
      'Test Capital Event',
    );
    expect(row0.querySelector('[data-testid="cell-status"]')).toHaveTextContent('Draft');
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

    expect(screen.getByText('No data available')).toBeInTheDocument();
  });

  it('configures Total Amount column for numeric sorting', async () => {
    const mockEvents: CapEvent[] = [
      createMockCapEvent({ id: '1', totalAmount: 100 }),
      createMockCapEvent({ id: '2', totalAmount: 2 }),
    ];

    render(<CapEventCollectionTable rows={mockEvents} testId="test-table" />);

    await waitFor(() => {
      expect(lastColumnDefs).not.toBeNull();
    });

    const totalAmountCol = lastColumnDefs!.find((c) => c.field === 'totalAmount');
    expect(totalAmountCol).toBeTruthy();
    expect(totalAmountCol!.sortable).toBe(true);
    expect(typeof totalAmountCol!.valueGetter).toBe('function');
    expect(typeof totalAmountCol!.valueFormatter).toBe('function');

    const v1 = (totalAmountCol!.valueGetter as (p: ValueGetterParams) => unknown)({
      data: { totalAmount: 100 },
    } as unknown as ValueGetterParams);
    const v2 = (totalAmountCol!.valueGetter as (p: ValueGetterParams) => unknown)({
      data: { totalAmount: 2 },
    } as unknown as ValueGetterParams);

    expect(typeof v1).toBe('number');
    expect(typeof v2).toBe('number');
    expect(v1 as number).toBeGreaterThan(v2 as number);

    const f1 = (totalAmountCol!.valueFormatter as (p: { value: unknown }) => unknown)({
      value: v1 as unknown,
    });
    expect(typeof f1).toBe('string');
  });

  it('configures Created At column with numeric valueGetter and display formatter', async () => {
    const mockEvents: CapEvent[] = [
      createMockCapEvent({ id: '1', modifiedAt: '2024-01-01T00:00:00Z' }),
      createMockCapEvent({ id: '2', modifiedAt: '2023-01-01T00:00:00Z' }),
      createMockCapEvent({ id: '3', modifiedAt: undefined }),
    ];

    render(<CapEventCollectionTable rows={mockEvents} testId="test-table" />);

    await waitFor(() => {
      expect(lastColumnDefs).not.toBeNull();
    });

    const modifiedAtCol = lastColumnDefs!.find((c) => c.field === 'modifiedAt');
    expect(modifiedAtCol).toBeTruthy();
    expect(modifiedAtCol!.sortable).toBe(true);
    expect(typeof modifiedAtCol!.valueGetter).toBe('function');
    expect(typeof modifiedAtCol!.valueFormatter).toBe('function');

    const vNewer = (modifiedAtCol!.valueGetter as (p: ValueGetterParams) => unknown)({
      data: { modifiedAt: '2024-01-01T00:00:00Z' },
    } as unknown as ValueGetterParams);
    const vOlder = (modifiedAtCol!.valueGetter as (p: ValueGetterParams) => unknown)({
      data: { modifiedAt: '2023-01-01T00:00:00Z' },
    } as unknown as ValueGetterParams);
    const vMissing = (modifiedAtCol!.valueGetter as (p: ValueGetterParams) => unknown)({
      data: { modifiedAt: undefined },
    } as unknown as ValueGetterParams);

    expect(typeof vNewer).toBe('number');
    expect(typeof vOlder).toBe('number');
    expect(vNewer as number).toBeGreaterThan(vOlder as number);
    expect(vMissing).toBeNull();

    const formatWithDate = (modifiedAtCol!.valueFormatter as (p: { data: CapEvent }) => unknown)({
      data: { modifiedAt: '2024-01-01T00:00:00Z' } as unknown as CapEvent,
    });
    expect(typeof formatWithDate).toBe('string');
    expect(formatWithDate).not.toBe('-');

    const formatMissing = (modifiedAtCol!.valueFormatter as (p: { data: CapEvent }) => unknown)({
      data: { modifiedAt: undefined } as unknown as CapEvent,
    });
    expect(formatMissing).toBe('-');
  });

  describe('formatNamedObject behavior via sponsor and fundGroup columns', () => {
    const getCell = (rowIdx: number, field: string) =>
      screen.getByTestId(`row-${rowIdx}`).querySelector(`[data-testid="cell-${field}"]`);

    it('renders "-" for missing sponsor and fund group', async () => {
      const mockEvents: CapEvent[] = [
        createMockCapEvent({
          sponsor: undefined as unknown as CapEvent['sponsor'],
          fundGroup: undefined as unknown as CapEvent['fundGroup'],
        }),
      ];

      render(<CapEventCollectionTable rows={mockEvents} testId="test-table" />);

      await waitFor(() => {
        expect(screen.getByTestId('table-test-table')).toBeInTheDocument();
      });

      expect(getCell(0, 'sponsor')).toHaveTextContent('-');
      expect(getCell(0, 'fundGroup')).toHaveTextContent('-');
    });

    it('renders string values as-is for sponsor and fund group', async () => {
      const mockEvents: CapEvent[] = [
        createMockCapEvent({
          sponsor: 'SP1 - Test Sponsor' as unknown as CapEvent['sponsor'],
          fundGroup: 'FG1 - Test FundGroup' as unknown as CapEvent['fundGroup'],
        }),
      ];

      render(<CapEventCollectionTable rows={mockEvents} testId="test-table" />);

      await waitFor(() => {
        expect(screen.getByTestId('table-test-table')).toBeInTheDocument();
      });

      expect(getCell(0, 'sponsor')).toHaveTextContent('SP1 - Test Sponsor');
      expect(getCell(0, 'fundGroup')).toHaveTextContent('FG1 - Test FundGroup');
    });
  });
});
