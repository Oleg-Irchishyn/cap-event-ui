import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import SkeletonCellRenderer from '..';

describe('SkeletonCellRenderer', () => {
  test('renders wrapper and bar', () => {
    render(<SkeletonCellRenderer />);
    expect(screen.getByTestId('skeleton-cell')).toBeInTheDocument();
    expect(screen.getByTestId('skeleton-bar')).toBeInTheDocument();
  });

  test('applies default width 80% when widthPercent not provided', () => {
    render(<SkeletonCellRenderer />);
    const bar = screen.getByTestId('skeleton-bar');
    expect(bar).toHaveStyle({ width: '80%' });
  });

  test('applies provided widthPercent as inline style', () => {
    render(<SkeletonCellRenderer widthPercent={42} />);
    const bar = screen.getByTestId('skeleton-bar');
    expect(bar).toHaveStyle({ width: '42%' });
  });
});
