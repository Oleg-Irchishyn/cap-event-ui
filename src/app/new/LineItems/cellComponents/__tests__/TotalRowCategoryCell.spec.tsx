import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { ICellRendererParams } from 'ag-grid-community';
import { TotalRowCategoryCell } from '@/app/new/LineItems/cellComponents/TotalRowCategoryCell';

describe('TotalRowCategoryCell', () => {
  it('renders provided text value', () => {
    const props = { value: 'Total' } as unknown as ICellRendererParams;
    render(<TotalRowCategoryCell {...props} />);
    expect(screen.getByText('Total')).toBeInTheDocument();
  });

  it('updates when value changes', () => {
    const props = { value: 'Total' } as unknown as ICellRendererParams;
    const { rerender } = render(<TotalRowCategoryCell {...props} />);
    const newProps = { value: 'Grand Total' } as unknown as ICellRendererParams;
    rerender(<TotalRowCategoryCell {...newProps} />);
    expect(screen.getByText('Grand Total')).toBeInTheDocument();
  });

  it('renders nothing when value is undefined', () => {
    const props = { value: undefined } as unknown as ICellRendererParams;
    const { container } = render(<TotalRowCategoryCell {...props} />);
    expect(container.textContent).toBe('');
  });
});
