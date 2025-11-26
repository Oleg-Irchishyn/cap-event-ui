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

  test('aligns skeleton to flex-end when textAlign is end', () => {
    render(<SkeletonCellRenderer textAlign="end" />);
    const wrapper = screen.getByTestId('skeleton-cell');
    expect(wrapper).toHaveStyle({ justifyContent: 'flex-end' });
  });

  test('aligns skeleton to flex-end when textAlign is right', () => {
    render(<SkeletonCellRenderer textAlign="right" />);
    const wrapper = screen.getByTestId('skeleton-cell');
    expect(wrapper).toHaveStyle({ justifyContent: 'flex-end' });
  });

  test('aligns skeleton to center when textAlign is center', () => {
    render(<SkeletonCellRenderer textAlign="center" />);
    const wrapper = screen.getByTestId('skeleton-cell');
    expect(wrapper).toHaveStyle({ justifyContent: 'center' });
  });

  test('aligns skeleton to flex-start by default', () => {
    render(<SkeletonCellRenderer />);
    const wrapper = screen.getByTestId('skeleton-cell');
    expect(wrapper).toHaveStyle({ justifyContent: 'flex-start' });
  });

  test('aligns skeleton to flex-start when textAlign is left', () => {
    render(<SkeletonCellRenderer textAlign="left" />);
    const wrapper = screen.getByTestId('skeleton-cell');
    expect(wrapper).toHaveStyle({ justifyContent: 'flex-start' });
  });
});
