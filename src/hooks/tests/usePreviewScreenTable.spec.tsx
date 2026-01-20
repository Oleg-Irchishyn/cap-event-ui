import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import React, { useEffect } from 'react';
import { usePreviewScreenTable } from '@/hooks/usePreviewScreenTable';
import type { PreviewScreenRow } from '@/app/preview-screen/types';
import type { LineItemRow } from '@/app/new/LineItems/types';

const TestComponent = ({
  rows,
  lineItems,
  isLoading,
  columnDefs,
  onReady,
}: {
  rows: PreviewScreenRow[];
  lineItems: [string, LineItemRow[]][];
  isLoading: boolean;
  columnDefs: Array<Record<string, unknown>>;
  onReady?: (data: ReturnType<typeof usePreviewScreenTable>) => void;
}) => {
  const data = usePreviewScreenTable({ rows, lineItems, isLoading, columnDefs });
  useEffect(() => {
    onReady?.(data);
  }, [data, onReady]);
  return (
    <div data-testid="out">
      {JSON.stringify({
        topGridRows: data.topGridRows,
        mainGridRows: data.mainGridRows,
        safeTopGridRows: data.safeTopGridRows,
        safeMainGridRows: data.safeMainGridRows,
        localeText: data.localeText,
      })}
    </div>
  );
};

describe('usePreviewScreenTable', () => {
  it('returns skeleton rows when loading', () => {
    render(
      <TestComponent
        rows={[]}
        lineItems={[
          [
            'Entity',
            [
              {
                id: 'li-1',
                defaultDescription: '',
                callDistributionReason: '',
                investment: { name: '' },
                insideCommitment: 'Yes',
                prDate: new Date('2024-01-01'),
                prFlag: 'F',
              } as unknown as LineItemRow,
            ],
          ],
        ]}
        isLoading={true}
        columnDefs={[{ a: 1 }, { b: 2 }, { c: 3 }]}
      />,
    );
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');
    expect(out.topGridRows.length).toBe(3);
    expect(out.mainGridRows.length).toBe(3);
  });

  it('maps top grid rows from line items when not loading', () => {
    render(
      <TestComponent
        rows={[
          {
            id: 'r1',
            investor: 'I1',
            entityId: 'E1',
            entityName: 'Entity 1',
            description: '',
            allocatedAmount: 0,
          },
        ]}
        lineItems={[
          [
            'Entity',
            [
              {
                id: 'li-1',
                defaultDescription: '',
                callDistributionReason: '',
                investment: { name: '' },
                insideCommitment: 'Yes',
                prDate: new Date('2024-01-02'),
                prFlag: 'F1',
              } as unknown as LineItemRow,
            ],
          ],
        ]}
        isLoading={false}
        columnDefs={[{ a: 1 }]}
      />,
    );
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');
    expect(out.topGridRows.length).toBe(3);
    expect(out.topGridRows[0]['li-1']).toBe('Yes');
    expect(out.topGridRows[2]['li-1']).toBe('F1');
  });

  it('syncs column state from main to top on grid ready', async () => {
    let handleMainGridReadyFn: ((e: { api: unknown }) => void) | null = null;
    let handleTopGridReadyFn: ((e: { api: unknown }) => void) | null = null;

    render(
      <TestComponent
        rows={[
          {
            id: 'r1',
            investor: 'I1',
            entityId: 'E1',
            entityName: 'Entity 1',
            description: '',
            allocatedAmount: 0,
          },
        ]}
        lineItems={[]}
        isLoading={false}
        columnDefs={[{ a: 1 }, { b: 2 }, { c: 3 }, { d: 4 }, { e: 5 }, { f: 6 }, { g: 7 }]}
        onReady={(d) => {
          handleMainGridReadyFn = d.handleMainGridReady as (e: { api: unknown }) => void;
          handleTopGridReadyFn = d.handleTopGridReady as (e: { api: unknown }) => void;
        }}
      />,
    );

    const topApplyStates: Array<{ applyOrder?: boolean }> = [];
    const mainApi = {
      getColumnState: () => [
        { colId: 'c0', width: 10, pinned: null },
        { colId: 'c1', width: 20, pinned: null },
        { colId: 'c2', width: 30, pinned: null },
        { colId: 'c3', width: 40, pinned: null },
        { colId: 'c4', width: 50, pinned: null },
        { colId: 'c5', width: 60, pinned: null },
        { colId: 'c6', width: 70, pinned: null },
      ],
    };
    const topApi = {
      applyColumnState: (s: { applyOrder?: boolean }) => topApplyStates.push(s),
    };

    expect(handleMainGridReadyFn).not.toBeNull();
    expect(typeof handleTopGridReadyFn).toBe('function');
    // call main first (top not yet set) then set top and reapply
    if (typeof handleMainGridReadyFn === 'function') {
      (handleMainGridReadyFn as (e: { api: unknown }) => void)({ api: mainApi });
    }
    if (typeof handleTopGridReadyFn === 'function') {
      (handleTopGridReadyFn as (e: { api: unknown }) => void)({ api: topApi });
    }
    await new Promise((res) => setTimeout(res, 0));
    expect(topApplyStates.length).toBeGreaterThan(0);
    expect(
      (topApplyStates as Array<{ applyOrder?: boolean }>)[topApplyStates.length - 1].applyOrder,
    ).toBe(true);
  });
});
