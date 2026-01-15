import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import PreviewScreenTable from '@/app/preview-screen/PreviewScreenTable';
import { LineItemRow } from '@/app/new/LineItems/types';

jest.mock('ag-grid-react', () => {
  return {
    AgGridReact: ({ ...props }: { columnDefs: string; rowData: string; className: string }) => {
      return (
        <div
          data-testid="ag-grid"
          data-column-defs={JSON.stringify(props.columnDefs)}
          data-row-data={JSON.stringify(props.rowData)}
          data-is-top-grid={props.className?.includes('preview-top-grid') ? 'true' : 'false'}
        >
          <div className="ag-center-cols-viewport"></div>
          <div className="ag-body-horizontal-scroll-viewport"></div>
        </div>
      );
    },
  };
});

const mockEntitiesLineItem = new Map<string, LineItemRow[]>();

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    get entitiesLineItem() {
      return mockEntitiesLineItem;
    },
  },
}));

jest.mock('@/utils/getPreviewScreenColumnDefs', () => ({
  getPreviewScreenColumnDefs: jest.fn(() => [
    { headerName: 'Entity ID', field: 'entityId' },
    { headerName: 'Entity Name', field: 'entityName' },
  ]),
  getDynamicColumnsDefs: jest.fn(() => [
    { headerName: 'Allocation', field: 'allocation' },
    { headerName: 'lineItem', field: 'lineItem' },
  ]),
  getTopDynamicColumnDefs: jest.fn(() => [
    { headerName: 'Allocation', field: 'allocation' },
    { headerName: 'lineItem', field: 'lineItem' },
  ]),
}));

jest.mock('@/utils/definedColumnForAllocationPreview', () => ({
  defineColumnForAllocationPreview: jest.fn((basis) => `field_${basis}`),
}));

jest.mock('@/utils/formatAmount', () => ({
  formatAmount: jest.fn((amount) => `$${amount || 0}`),
}));

jest.mock('@/utils/prepareDataTestId', () => ({
  prepareDataTestId: jest.fn((prefix, id) => `${prefix}-${id}`),
}));

jest.mock('@/app/components/SkeletonCellRenderer', () => ({
  __esModule: true,
  default: () => <div data-testid="skeleton-cell">Loading...</div>,
}));

const createMockLineItem = (overrides?: Partial<LineItemRow>): LineItemRow => ({
  id: 'line-item-1',
  amount: 1000,
  capitalCategory: 'Category 1',
  callDistributionReason: 'Reason 1',
  defaultDescription: 'Description 1',
  insideCommitment: 'Yes',
  investment: { id: 'inv-1', name: 'Investment 1' },
  allocationBasis: 'Basis 1',
  accountNo: 'ACC-001',
  prDate: new Date('2024-01-01'),
  prFlag: 'Flag 1',
  ...overrides,
});

const createMockRow = (overrides?: Partial<unknown>) => ({
  id: 'row-1',
  investor: 'Investor 1',
  investorId: 'INV-1',
  investorName: 'Investor Name 1',
  entityId: 'E1',
  entityName: 'Entity 1',
  description: 'Description',
  allocatedAmount: 5000,
  commitment: 10000,
  ...overrides,
});

describe('PreviewScreenTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockEntitiesLineItem.clear();
  });

  describe('Basic Rendering', () => {
    it('renders table wrapper with correct testId', () => {
      render(<PreviewScreenTable rows={[]} testId="test-table" />);
      const wrapper = screen.getByTestId('table-wrapper-test-table');
      expect(wrapper).toBeInTheDocument();
    });

    it('renders main grid with rows', () => {
      const rows = [createMockRow()];
      render(<PreviewScreenTable rows={rows} testId="test" />);

      const grids = screen.getAllByTestId('ag-grid');
      const mainGrid = grids.find((grid) => grid.getAttribute('data-is-top-grid') === 'false');

      expect(mainGrid).toBeInTheDocument();
    });

    it('does not render top grid when no line items exist', () => {
      const rows = [createMockRow()];
      render(<PreviewScreenTable rows={rows} testId="test" />);

      const grids = screen.getAllByTestId('ag-grid');
      const topGrid = grids.find((grid) => grid.getAttribute('data-is-top-grid') === 'true');

      expect(topGrid).toBeUndefined();
    });
  });

  describe('Dynamic Columns', () => {
    it('generates dynamic columns based on line items', () => {
      const lineItem1 = createMockLineItem({ id: 'li-1', allocationBasis: 'Basis 1' });
      const lineItem2 = createMockLineItem({ id: 'li-2', allocationBasis: 'Basis 2' });
      mockEntitiesLineItem.set('Entity 1', [lineItem1, lineItem2]);

      const rows = [createMockRow()];
      render(<PreviewScreenTable rows={rows} testId="test" />);

      const grids = screen.getAllByTestId('ag-grid');
      const mainGrid = grids.find((grid) => grid.getAttribute('data-is-top-grid') === 'false');

      expect(mainGrid).toBeInTheDocument();
      const columnDefs = JSON.parse(mainGrid?.getAttribute('data-column-defs') || '[]');
      expect(columnDefs.length).toBeGreaterThan(2);
    });
  });

  describe('Multiple Line Items', () => {
    it('handles multiple line items per entity', () => {
      const lineItem1 = createMockLineItem({ id: 'li-1', allocationBasis: 'Basis 1' });
      const lineItem2 = createMockLineItem({ id: 'li-2', allocationBasis: 'Basis 2' });
      mockEntitiesLineItem.set('Entity 1', [lineItem1, lineItem2]);

      const rows = [createMockRow()];
      render(<PreviewScreenTable rows={rows} testId="test" />);

      const grids = screen.getAllByTestId('ag-grid');
      const mainGrid = grids.find((grid) => grid.getAttribute('data-is-top-grid') === 'false');

      expect(mainGrid).toBeInTheDocument();
      const columnDefs = JSON.parse(mainGrid?.getAttribute('data-column-defs') || '[]');
      expect(columnDefs.length).toBeGreaterThanOrEqual(6);
    });
  });
});
