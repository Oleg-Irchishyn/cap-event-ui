import PreviewSubTotalTable from '@/app/preview-screen/PreviewSubTotalTable';
import type { SubTotalTableRow } from '@/app/preview-screen/types';
import { ENTITY_NAME_FIELD } from '@/const/previewScreen';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import type { ColDef } from 'ag-grid-community';

jest.mock('@/app/components/ConfigurationTable', () => {
  return {
    __esModule: true,
    default: ({
      rowData,
      postSortRows,
    }: {
      rowData: unknown[];
      postSortRows?: (p: { nodes: Array<{ data: Record<string, unknown> }> }) => void;
    }) => {
      const nodes: Array<{ data: Record<string, unknown> }> = [
        { data: { id: 'n1' } },
        { data: { id: 'total-row', isTotalRow: true } },
        { data: { id: 'n2' } },
      ];
      if (postSortRows) {
        postSortRows({ nodes });
      }
      return (
        <div
          data-testid="config-table"
          data-row-data={JSON.stringify(rowData)}
          data-nodes={JSON.stringify(nodes)}
        />
      );
    },
  };
});

jest.mock('@/utils/prepareDataTestId', () => ({
  prepareDataTestId: (prefix: string, id: string) => `${prefix}-${id}`,
}));

describe('PreviewSubTotalTable', () => {
  const baseCols: ColDef[] = [
    { headerName: 'Entity', field: ENTITY_NAME_FIELD },
    { headerName: 'Commitment', field: 'commitment' },
  ];

  it('adds a total row when not loading', () => {
    const rows: SubTotalTableRow[] = [
      {
        id: 'r1',
        entityName: 'E1',
        allocatedAmount: 10,
        commitment: 100,
        extra: 5,
      } as unknown as SubTotalTableRow,
      {
        id: 'r2',
        entityName: 'E2',
        allocatedAmount: 15,
        commitment: 200,
        extra: 7,
      } as unknown as SubTotalTableRow,
    ];

    render(
      <PreviewSubTotalTable
        rows={rows}
        columnDefs={baseCols}
        testId="preview-subtotal"
        isLoading={false}
      />,
    );

    const el = screen.getByTestId('config-table');
    const data = JSON.parse(el.getAttribute('data-row-data') || '[]') as SubTotalTableRow[];
    expect(data.length).toBe(3);
    const total = data[data.length - 1] as SubTotalTableRow;
    expect(total.id).toBe('total-row');
    expect(total.isTotalRow).toBe(true);
    expect(total[ENTITY_NAME_FIELD]).toBe('Grand Total');
    expect(total.allocatedAmount).toBe(25);
    expect(total.commitment).toBe(300);
    expect((total as unknown as Record<string, unknown>).extra).toBe(12);
  });

  it('renders placeholders equal to columnDefs length when loading', () => {
    const rows: SubTotalTableRow[] = [];
    const columnDefs: ColDef[] = [
      { headerName: 'A', field: 'a' },
      { headerName: 'B', field: 'b' },
    ];

    render(
      <PreviewSubTotalTable
        rows={rows}
        columnDefs={columnDefs}
        testId="preview-subtotal"
        isLoading={true}
      />,
    );

    const el = screen.getByTestId('config-table');
    const data = JSON.parse(el.getAttribute('data-row-data') || '[]') as SubTotalTableRow[];
    expect(data.length).toBe(2);
    expect(String(data[0].id)).toContain('skeleton-');
  });

  it('postSortRows moves total row to the bottom', () => {
    const rows: SubTotalTableRow[] = [
      {
        id: 'r1',
        entityName: 'E1',
        allocatedAmount: 10,
        commitment: 100,
      } as unknown as SubTotalTableRow,
    ];

    render(
      <PreviewSubTotalTable
        rows={rows}
        columnDefs={baseCols}
        testId="preview-subtotal"
        isLoading={false}
      />,
    );

    const el = screen.getByTestId('config-table');
    const nodes = JSON.parse(el.getAttribute('data-nodes') || '[]') as Array<{
      data: { [k: string]: unknown; isTotalRow?: boolean };
    }>;
    expect(nodes[nodes.length - 1].data.isTotalRow).toBe(true);
  });
});
