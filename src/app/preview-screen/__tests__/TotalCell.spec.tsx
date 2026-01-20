import React from 'react';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { TotalCell } from '@/app/preview-screen/TotalCell';
import type { ICellRendererParams } from 'ag-grid-community';

function makeParams(partial: Partial<ICellRendererParams>): ICellRendererParams {
  const base: Record<string, unknown> = {
    value: null,
    valueFormatted: undefined,
    data: {},
    node: {},
    colDef: {},
    column: {},
    rowIndex: 0,
    api: {},
    columnApi: {},
    context: {},
    eGridCell: document.createElement('div'),
    eParentOfValue: document.createElement('div'),
  };
  Object.assign(base, partial);
  return base as unknown as ICellRendererParams;
}

const formatValueMock = jest.fn((val: unknown, isZero?: boolean) =>
  isZero ? 'ZERO' : `FMT-${String(val)}`,
);

jest.mock('@/app/new/LineItems/utils', () => ({
  formatValue: (val: unknown, isZero?: boolean) =>
    (formatValueMock as (v: unknown, z?: boolean) => string)(val, isZero),
}));

describe('TotalCell', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders ZERO when value is 0 (uses formatValue with zero flag)', () => {
    render(<TotalCell {...makeParams({ value: 0 })} />);
    expect(screen.getByText('ZERO')).toBeInTheDocument();
    expect(formatValueMock).toHaveBeenCalledWith(0, true);
  });

  it('renders formatted number when value is a number', () => {
    render(<TotalCell {...makeParams({ value: 123 })} />);
    const el = screen.getByTestId('total-row-amount');
    expect(el).toHaveTextContent('FMT-123');
    expect(formatValueMock).toHaveBeenCalledWith(123, undefined);
  });

  it('renders string value as-is when value is a string', () => {
    render(<TotalCell {...makeParams({ value: 'Hello' })} textAlign="left" />);
    const el = screen.getByTestId('total-row-amount');
    expect(el).toHaveTextContent('Hello');
    expect(formatValueMock).not.toHaveBeenCalled();
  });
});
