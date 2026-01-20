import type {
  BodyScrollEvent,
  ColumnResizedEvent,
  ColumnState,
  GridApi,
  GridReadyEvent,
} from 'ag-grid-community';
import { useCallback, useEffect, useMemo, useRef } from 'react';

import type { LineItemRow } from '@/app/new/LineItems/types';
import type { PreviewScreenRow } from '@/app/preview-screen/types';

type UsePreviewScreenTableProps = {
  rows: PreviewScreenRow[];
  lineItems: [string, LineItemRow[]][];
  isLoading: boolean;
  columnDefs: unknown[];
};

export const usePreviewScreenTable = ({
  rows,
  lineItems,
  isLoading,
  columnDefs,
}: UsePreviewScreenTableProps) => {
  const topGridApiRef = useRef<GridApi | null>(null);
  const mainGridApiRef = useRef<GridApi | null>(null);
  const topGridContainerRef = useRef<HTMLDivElement | null>(null);
  const mainGridContainerRef = useRef<HTMLDivElement | null>(null);
  const isSyncingRef = useRef(false);

  const topGridRows = useMemo(() => {
    if (isLoading) {
      return Array.from({ length: 3 }).map(
        (_, index) =>
          ({
            id: `top-skeleton-${index}`,
          }) as PreviewScreenRow,
      );
    }

    if (!Array.isArray(rows) || rows.length === 0 || lineItems.length === 0) {
      return [];
    }

    const topRows: Array<Partial<PreviewScreenRow>> = [];

    for (let rowIndex = 0; rowIndex < 3; rowIndex++) {
      const rowData: Partial<PreviewScreenRow> & Record<string, string | undefined> = {
        id: `top-row-${rowIndex}`,
      };

      lineItems.forEach(([, lineItemRows]) => {
        lineItemRows.forEach((lineItem) => {
          if (rowIndex === 0) {
            rowData[lineItem.id] = lineItem.insideCommitment;
          } else if (rowIndex === 1) {
            rowData[lineItem.id] = lineItem.prDate
              ? new Date(lineItem.prDate).toLocaleDateString()
              : '';
          } else if (rowIndex === 2) {
            rowData[lineItem.id] = lineItem.prFlag;
          }
        });
      });

      topRows.push(rowData);
    }

    return topRows;
  }, [isLoading, rows, lineItems]);

  const mainGridRows = useMemo(() => {
    if (!isLoading || (Array.isArray(rows) && rows.length > 0)) {
      return rows ?? [];
    }
    const placeholderCount = columnDefs.length;
    return Array.from({ length: placeholderCount }).map(
      (_, index) =>
        ({
          id: `skeleton-${index}`,
        }) as PreviewScreenRow,
    );
  }, [columnDefs, isLoading, rows]);

  const safeTopGridRows = useMemo(() => {
    return topGridRows.map((r, i) => {
      if (r !== null && typeof r === 'object') {
        return { ...(r as PreviewScreenRow), _index: i } as PreviewScreenRow & { _index: number };
      }
      return { value: r, _index: i } as unknown as PreviewScreenRow & { _index: number };
    });
  }, [topGridRows]);

  const safeMainGridRows = useMemo(() => {
    return mainGridRows.map((r, i) => ({ ...r, _index: i }));
  }, [mainGridRows]);

  const syncColumnStateToTopGrid = useCallback(() => {
    if (isSyncingRef.current || !mainGridApiRef.current || !topGridApiRef.current) return;

    isSyncingRef.current = true;
    try {
      const mainColumnState = mainGridApiRef.current.getColumnState();

      const topColumnState: ColumnState[] = [];

      const first4Columns = mainColumnState.slice(0, 4);
      const combinedWidth = first4Columns.reduce((sum, col) => {
        return sum + (col.width ?? 0);
      }, 0);

      if (combinedWidth > 0) {
        topColumnState.push({
          colId: 'generalInfo',
          width: combinedWidth,
          pinned: first4Columns[0]?.pinned || null,
          hide: first4Columns.some((col) => col.hide) || false,
        });
      }

      const columns5and6 = mainColumnState.slice(4, 6);
      const combinedTitleWidth = columns5and6.reduce((sum, col) => {
        return sum + (col.width ?? 0);
      }, 0);

      if (combinedTitleWidth > 0) {
        topColumnState.push({
          colId: 'lineItemsFields',
          width: combinedTitleWidth,
          pinned: columns5and6[0]?.pinned || null,
          hide: columns5and6.some((col) => col.hide) || false,
        });
      }

      const remainingColumns = mainColumnState.slice(6);
      topColumnState.push(...remainingColumns);

      topGridApiRef.current.applyColumnState({
        state: topColumnState,
        applyOrder: true,
      });
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const syncHorizontalScroll = useCallback((scrollLeft: number) => {
    if (isSyncingRef.current || !topGridContainerRef.current) return;

    isSyncingRef.current = true;
    try {
      const topCenterViewport = topGridContainerRef.current.querySelector(
        '.ag-center-cols-viewport',
      ) as HTMLElement;
      if (topCenterViewport) {
        topCenterViewport.scrollLeft = scrollLeft;
      }

      const scrollContainer = topGridContainerRef.current.querySelector(
        '.ag-body-horizontal-scroll-viewport',
      ) as HTMLElement;
      if (scrollContainer) {
        scrollContainer.scrollLeft = scrollLeft;
      }
    } finally {
      isSyncingRef.current = false;
    }
  }, []);

  const handleMainGridReady = useCallback(
    (params: GridReadyEvent) => {
      mainGridApiRef.current = params.api;
      if (topGridApiRef.current) {
        setTimeout(() => syncColumnStateToTopGrid(), 0);
      }
    },
    [syncColumnStateToTopGrid],
  );

  const handleTopGridReady = useCallback(
    (params: GridReadyEvent) => {
      topGridApiRef.current = params.api;
      if (mainGridApiRef.current) {
        setTimeout(() => syncColumnStateToTopGrid(), 0);
      }
    },
    [syncColumnStateToTopGrid],
  );

  const handleMainColumnResized = useCallback(
    (e: ColumnResizedEvent) => {
      if (!e.finished || isSyncingRef.current) return;
      syncColumnStateToTopGrid();
      if (mainGridContainerRef.current) {
        const scrollContainer = mainGridContainerRef.current.querySelector(
          '.ag-body-horizontal-scroll-viewport',
        ) as HTMLElement;
        if (scrollContainer) {
          syncHorizontalScroll(scrollContainer.scrollLeft);
        }
      }
    },
    [syncColumnStateToTopGrid, syncHorizontalScroll],
  );

  const handleMainBodyScroll = useCallback(
    (e: BodyScrollEvent) => {
      if (isSyncingRef.current || e.direction !== 'horizontal') return;

      if (mainGridContainerRef.current) {
        const centerViewport = mainGridContainerRef.current.querySelector(
          '.ag-center-cols-viewport',
        ) as HTMLElement;
        if (centerViewport) {
          syncHorizontalScroll(centerViewport.scrollLeft);
        } else {
          syncHorizontalScroll(e.left);
        }
      } else {
        syncHorizontalScroll(e.left);
      }
    },
    [syncHorizontalScroll],
  );

  const handleMainFirstDataRendered = useCallback(() => {
    if (isSyncingRef.current) return;
    syncColumnStateToTopGrid();
  }, [syncColumnStateToTopGrid]);

  useEffect(() => {
    if (mainGridApiRef.current && topGridApiRef.current) {
      setTimeout(() => syncColumnStateToTopGrid(), 0);
    }
  }, [columnDefs, syncColumnStateToTopGrid]);

  const localeText = useMemo(
    () => ({
      noRowsToShow: 'No Data to display',
    }),
    [],
  );

  return {
    topGridRows,
    mainGridRows,
    safeTopGridRows,
    safeMainGridRows,
    localeText,
    topGridApiRef,
    mainGridApiRef,
    topGridContainerRef,
    mainGridContainerRef,
    handleMainGridReady,
    handleTopGridReady,
    handleMainColumnResized,
    handleMainBodyScroll,
    handleMainFirstDataRendered,
  };
};
