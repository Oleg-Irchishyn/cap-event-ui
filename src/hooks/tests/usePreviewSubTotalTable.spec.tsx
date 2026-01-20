import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React, { useEffect } from 'react';
import { usePreviewSubTotalTable } from '@/hooks/usePreviewSubTotalTable';
import type { SubTotalTableRow } from '@/app/preview-screen/types';
import type { ColDef, PostSortRowsParams } from 'ag-grid-community';
import { ENTITY_NAME_FIELD } from '@/const/previewScreen';

const TestComponent = ({
  rows,
  isLoading,
  columnDefs,
  onReady,
}: {
  rows: SubTotalTableRow[];
  isLoading: boolean;
  columnDefs: ColDef[];
  onReady?: (data: ReturnType<typeof usePreviewSubTotalTable>) => void;
}) => {
  const data = usePreviewSubTotalTable({ rows, isLoading, columnDefs });
  useEffect(() => {
    onReady?.(data);
  }, [data, onReady]);
  return <div data-testid="out">{JSON.stringify(data)}</div>;
};

describe('usePreviewSubTotalTable', () => {
  it('appends total row with sums when not loading', () => {
    const rows: SubTotalTableRow[] = [
      {
        id: 'a',
        entityName: 'E1',
        allocatedAmount: 10,
        commitment: 100,
        x: 2,
      } as unknown as SubTotalTableRow,
      {
        id: 'b',
        entityName: 'E1',
        allocatedAmount: 5,
        commitment: 200,
        x: 3,
      } as unknown as SubTotalTableRow,
    ];
    render(
      <TestComponent
        rows={rows}
        isLoading={false}
        columnDefs={[{ headerName: 'E', field: ENTITY_NAME_FIELD }]}
      />,
    );
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');
    expect(out.displayRows.length).toBe(3);
    const total = out.displayRows[out.displayRows.length - 1];
    expect(total.id).toBe('total-row');
    expect(total[ENTITY_NAME_FIELD]).toBe('Grand Total');
    expect(total.allocatedAmount).toBe(15);
    expect(total.commitment).toBe(300);
    expect(total.x).toBe(5);
  });

  it('returns placeholders when loading', () => {
    render(
      <TestComponent
        rows={[]}
        isLoading={true}
        columnDefs={[
          { headerName: 'A', field: 'a' },
          { headerName: 'B', field: 'b' },
        ]}
      />,
    );
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');
    expect(out.displayRows.length).toBe(2);
    expect(String(out.displayRows[0].id)).toContain('skeleton-');
  });

  it('postSortRows keeps total row at bottom', () => {
    const rows: SubTotalTableRow[] = [
      {
        id: 'a',
        entityName: 'E1',
        allocatedAmount: 10,
        commitment: 100,
      } as unknown as SubTotalTableRow,
    ];
    let handlePostSortRowsFn: ((p: PostSortRowsParams) => void) | null = null;
    render(
      <TestComponent
        rows={rows}
        isLoading={false}
        columnDefs={[{ headerName: 'E', field: ENTITY_NAME_FIELD }]}
        onReady={(d) => {
          handlePostSortRowsFn = d.handlePostSortRows as (p: PostSortRowsParams) => void;
        }}
      />,
    );
    const nodes: Array<{
      data: { [k: string]: unknown; isTotalRow?: boolean };
    }> = [
      { data: { id: 'n1' } },
      { data: { id: 'total-row', isTotalRow: true } },
      { data: { id: 'n2' } },
    ];
    const params = { nodes } as unknown as PostSortRowsParams;
    expect(handlePostSortRowsFn).not.toBeNull();
    const invoke = handlePostSortRowsFn as unknown as (p: PostSortRowsParams) => void;
    invoke(params);
    expect(nodes[nodes.length - 1].data.isTotalRow).toBe(true);
  });
});
