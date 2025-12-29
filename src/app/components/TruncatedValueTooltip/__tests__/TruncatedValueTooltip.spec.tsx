import React, { forwardRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import TruncatedValueTooltip from '@/app/components/TruncatedValueTooltip';

jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

const TestWrapper = forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  (props, ref) => <div ref={ref} {...props} />,
);
TestWrapper.displayName = 'TestWrapper';

describe('TruncatedValueTooltip', () => {
  const setup = (text: string) =>
    render(<TruncatedValueTooltip text={text} Wrapper={TestWrapper} />);

  it('renders text and no tooltip initially', () => {
    setup('Some text');
    expect(screen.getByText('Some text')).toBeInTheDocument();
    expect(
      screen.queryByText('Some text', { selector: '[data-testid="tooltip-tooltip"]' }),
    ).toBeNull();
  });

  it('shows tooltip on hover when truncated', async () => {
    setup('A long truncated text');
    const el = screen.getByText('A long truncated text') as HTMLDivElement;
    Object.defineProperty(el, 'clientWidth', { value: 50, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 100, configurable: true });

    fireEvent.mouseEnter(el);

    await waitFor(() => {
      expect(screen.getByText('A long truncated text')).toBeInTheDocument();
    });
  });

  it('does not show tooltip when not truncated', async () => {
    setup('Short');
    const el = screen.getByText('Short') as HTMLDivElement;
    Object.defineProperty(el, 'clientWidth', { value: 100, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 100, configurable: true });

    fireEvent.mouseEnter(el);
    await waitFor(() => {
      expect(screen.queryAllByText('Short')).toHaveLength(1);
    });
  });

  it("doesn't show tooltip for '-'", async () => {
    setup('-');
    const el = screen.getByText('-') as HTMLDivElement;
    Object.defineProperty(el, 'clientWidth', { value: 50, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 100, configurable: true });

    fireEvent.mouseEnter(el);
    await waitFor(() => {
      expect(screen.queryAllByText('-')).toHaveLength(1);
    });
  });

  it('hides tooltip on mouse leave', async () => {
    setup('Hidden later');
    const el = screen.getByText('Hidden later') as HTMLDivElement;
    Object.defineProperty(el, 'clientWidth', { value: 50, configurable: true });
    Object.defineProperty(el, 'scrollWidth', { value: 100, configurable: true });

    fireEvent.mouseEnter(el);
    await waitFor(() => {
      expect(screen.getByText('Hidden later')).toBeInTheDocument();
    });
    fireEvent.mouseLeave(el);
    await waitFor(() => {
      expect(screen.queryAllByText('Hidden later')).toHaveLength(1);
    });
  });
});
