import { render, screen } from '@testing-library/react';
import PreviewScreenTable from '@/app/preview-screen/PreviewScreenTable';

jest.mock('@/app/components/ConfigurationTable', () => ({
  __esModule: true,
  default: (props: {
    testId: string;
    columnDefs: Array<{ headerName?: string }>;
    rowData: Array<{ id?: string; investor?: string; customerId?: string }>;
    noRowsText?: string;
    getRowId?: (params: { data: unknown }) => string;
    isLoading?: boolean;
  }) => {
    const sampleWithId = { id: 'row-1' };
    const sampleComposed = { customerId: 'CUST001', investor: 'ABC' };
    const computeId = (data: unknown) => {
      if (typeof props.getRowId === 'function') {
        return props.getRowId({ data });
      }
      const d = data as { id?: string };
      return d?.id || `row-${JSON.stringify(data)}`;
    };
    const id1 = computeId(props.rowData[0] ?? sampleWithId);
    const id2 = computeId(sampleComposed);
    return (
      <div>
        <div data-testid="received-testid">{props.testId}</div>
        <div data-testid="headers">{props.columnDefs.map((c) => c.headerName).join('|')}</div>
        <div data-testid="rows-count">{props.rowData.length}</div>
        <div data-testid="no-rows-text">{props.noRowsText || ''}</div>
        <div data-testid="id-with-id">{id1}</div>
        <div data-testid="id-composed">{id2}</div>
      </div>
    );
  },
}));

describe('PreviewScreenTable', () => {
  it('passes formatted testId and noRowsText to ConfigurationTable', () => {
    render(<PreviewScreenTable rows={[]} testId="dist" />);
    expect(screen.getByTestId('received-testid').textContent).toBe('table-dist');
    expect(screen.getByTestId('no-rows-text').textContent).toBe('No Data to display');
  });

  it('provides 3 columns with expected headers', () => {
    render(<PreviewScreenTable rows={[]} testId="dist" />);
    expect(screen.getByTestId('headers').textContent).toBe(
      'Entity ID|Entity Name|Investor ID|Investor Name|Investor Type I|Investor Type II|Total Capital Commitment|Total Amount Due',
    );
  });

  it('passes rows and stable getRowId implementation', () => {
    const rows = [
      {
        id: 'A',
        investor: 'INV A',
        investorId: 'C1',
        investorName: 'Investor A',
        entityId: 'E1',
        entityName: 'Entity 1',
        description: 'Desc',
        investmentTitle: 'Title',
        investmentName: 'Name',
        allocatedAmount: 1,
        isAggregated: true,
      },
      {
        investor: 'INV B',
        investorId: 'C2',
        investorName: 'Investor B',
        entityId: 'E2',
        entityName: 'Entity 2',
        description: 'Desc 2',
        investmentTitle: 'Title 2',
        investmentName: 'Name 2',
        allocatedAmount: 2,
        isAggregated: true,
      },
    ];
    render(<PreviewScreenTable rows={rows} testId="dist" />);
    expect(screen.getByTestId('rows-count').textContent).toBe('2');
    expect(screen.getByTestId('id-with-id').textContent).toBe('A');
    expect(screen.getByTestId('id-composed').textContent).toBe(
      'row-{"customerId":"CUST001","investor":"ABC"}',
    );
  });
});
