import { renderHook, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { usePreviewScreenDetails } from '@/hooks/usePreviewScreenDetails';

const mockProcessPayload = jest.fn();

jest.mock('@/providers/ToastProvider', () => {
  const stableToast = { notify: jest.fn() };
  return { useToast: () => stableToast };
});

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    get entitiesLineItem() {
      const map = new Map<string, Array<Record<string, unknown>>>();
      map.set('Z', []);
      map.set('A', []);
      return map;
    },
  },
  previewScreenStore: {
    get isLoading() {
      return false;
    },
    processPayload: (...args: unknown[]) => mockProcessPayload(...args),
  },
}));

jest.mock('@/utils/getPreviewScreenColumnDefs', () => ({
  getDynamicColumnsDefs: jest.fn(() => [{ headerName: 'Dyn', field: 'dyn' }]),
  getPreviewScreenColumnDefs: jest.fn(() => [
    { headerName: 'Static', field: 'static', initialWidth: 100 },
  ]),
  getPreviewSubTotalColumnDefs: jest.fn(() => [{ headerName: 'Sub', field: 'sub' }]),
  getTopGridColumnDefs: jest.fn(() => [{ headerName: 'Top', field: 'top' }]),
  getSubTotalRows: jest.fn(() => []),
}));

describe('usePreviewScreenDetails (simplified)', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initializes and returns required structures', async () => {
    mockProcessPayload.mockResolvedValueOnce([]);
    const { result } = renderHook(() => usePreviewScreenDetails());
    await act(async () => {
      await Promise.resolve();
    });

    expect(Array.isArray(result.current.rows)).toBe(true);
    expect(Array.isArray(result.current.subTotalRows)).toBe(true);
    expect(Array.isArray(result.current.columnDefs)).toBe(true);
    expect(Array.isArray(result.current.topGridColumnDefs)).toBe(true);
    expect(Array.isArray(result.current.subTotalColumnDefs)).toBe(true);
  });

  it('builds columns from utils and sorts line items', async () => {
    mockProcessPayload.mockResolvedValueOnce([]);
    const { result } = renderHook(() => usePreviewScreenDetails());
    await act(async () => {
      await Promise.resolve();
    });
    const colHeaders = (result.current.columnDefs as Array<{ headerName?: string }>).map(
      (c) => c.headerName,
    );
    expect(colHeaders).toEqual(['Static', 'Dyn']);
    const keys = (result.current.lineItems as Array<[string, unknown]>).map((e) => e[0]);
    expect(keys).toEqual(['A', 'Z']);
  });
});
