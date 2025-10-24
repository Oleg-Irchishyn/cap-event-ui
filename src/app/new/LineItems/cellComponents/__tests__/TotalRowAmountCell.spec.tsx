import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ICellRendererParams } from 'ag-grid-community';
import { TotalRowAmountCell } from '@/app/new/LineItems/cellComponents/TotalRowAmountCell';

describe('TotalRowAmountCell', () => {
  it('renders 0 as plain 0 for total row', () => {
    const props = { value: 0 } as unknown as ICellRendererParams;
    render(<TotalRowAmountCell {...props} />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders positive numbers with currency format', () => {
    const props = { value: 1234.5 } as unknown as ICellRendererParams;
    render(<TotalRowAmountCell {...props} />);
    expect(screen.getByText('$1,234.50')).toBeInTheDocument();
  });

  it('renders negative numbers wrapped in parentheses', () => {
    const props = { value: -50 } as unknown as ICellRendererParams;
    render(<TotalRowAmountCell {...props} />);
    expect(screen.getByText('($50.00)')).toBeInTheDocument();
  });
});
