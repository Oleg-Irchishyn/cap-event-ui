import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ICellRendererParams } from 'ag-grid-community';
import { TruncatedTextCell } from '../TruncatedTextCell';

// Mock Tooltip component
jest.mock('@/app/components/Tooltip', () => {
  return function MockTooltip({
    showTooltip,
    tooltipMessage,
  }: {
    showTooltip: boolean;
    tooltipMessage: string;
  }) {
    return showTooltip ? <div data-testid="tooltip">{tooltipMessage}</div> : null;
  };
});

describe('TruncatedTextCell', () => {
  const createMockProps = (
    overrides: Partial<ICellRendererParams & { textAlign?: 'start' | 'end' | 'center' }> = {},
  ): ICellRendererParams & { textAlign?: 'start' | 'end' | 'center' } => {
    return {
      value: undefined,
      data: {},
      ...overrides,
    } as ICellRendererParams & { textAlign?: 'start' | 'end' | 'center' };
  };

  const mockTruncation = (element: HTMLElement, isTruncated: boolean) => {
    Object.defineProperty(element, 'scrollWidth', {
      writable: true,
      configurable: true,
      value: isTruncated ? 200 : 50,
    });
    Object.defineProperty(element, 'clientWidth', {
      writable: true,
      configurable: true,
      value: 100,
    });
  };

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders the value as text', () => {
      const props = createMockProps({ value: 'Test Value' });
      render(<TruncatedTextCell {...props} />);
      expect(screen.getByText('Test Value')).toBeInTheDocument();
    });

    it('renders "-" when value is undefined', () => {
      const props = createMockProps({ value: undefined });
      render(<TruncatedTextCell {...props} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('renders "-" when value is null', () => {
      const props = createMockProps({ value: null });
      render(<TruncatedTextCell {...props} />);
      expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('converts number values to string', () => {
      const props = createMockProps({ value: 12345 });
      render(<TruncatedTextCell {...props} />);
      expect(screen.getByText('12345')).toBeInTheDocument();
    });

    it('updates when value changes', () => {
      const props = createMockProps({ value: 'Initial' });
      const { rerender } = render(<TruncatedTextCell {...props} />);
      expect(screen.getByText('Initial')).toBeInTheDocument();

      const newProps = createMockProps({ value: 'Updated' });
      rerender(<TruncatedTextCell {...newProps} />);
      expect(screen.getByText('Updated')).toBeInTheDocument();
    });
  });

  describe('Text Alignment', () => {
    it('applies default start alignment when textAlign is not provided', () => {
      const props = createMockProps({ value: 'Test' });
      const { container } = render(<TruncatedTextCell {...props} />);
      const textElement = container.querySelector('span');
      expect(textElement).toHaveStyle({ 'text-align': 'start' });
    });

    it('applies start alignment when textAlign is "start"', () => {
      const props = createMockProps({ value: 'Test', textAlign: 'start' });
      const { container } = render(<TruncatedTextCell {...props} />);
      const textElement = container.querySelector('span');
      expect(textElement).toHaveStyle({ 'text-align': 'start' });
    });

    it('applies end alignment when textAlign is "end"', () => {
      const props = createMockProps({ value: 'Test', textAlign: 'end' });
      const { container } = render(<TruncatedTextCell {...props} />);
      const textElement = container.querySelector('span');
      expect(textElement).toHaveStyle({ 'text-align': 'end' });
    });

    it('applies center alignment when textAlign is "center"', () => {
      const props = createMockProps({ value: 'Test', textAlign: 'center' });
      const { container } = render(<TruncatedTextCell {...props} />);
      const textElement = container.querySelector('span');
      expect(textElement).toHaveStyle({ 'text-align': 'center' });
    });
  });

  describe('Tooltip Display', () => {
    it('shows tooltip on hover when text is truncated', async () => {
      const props = createMockProps({ value: 'Very long text that should be truncated' });
      const { container } = render(<TruncatedTextCell {...props} />);

      await waitFor(() => {
        const textElement = container.querySelector('span') as HTMLElement;
        expect(textElement).toBeInTheDocument();
      });

      const textElement = container.querySelector('span') as HTMLElement;
      mockTruncation(textElement, true);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        const wrapper = container.querySelector('div');
        expect(wrapper).toBeInTheDocument();
      });

      const wrapper = container.querySelector('div');
      act(() => {
        fireEvent.mouseEnter(wrapper!);
      });

      await waitFor(() => {
        const tooltip = screen.getByTestId('tooltip');
        expect(tooltip).toBeInTheDocument();
        expect(tooltip).toHaveTextContent('Very long text that should be truncated');
      });
    });

    it('hides tooltip on mouse leave', async () => {
      const props = createMockProps({ value: 'Very long text that should be truncated' });
      const { container } = render(<TruncatedTextCell {...props} />);

      await waitFor(() => {
        const textElement = container.querySelector('span') as HTMLElement;
        expect(textElement).toBeInTheDocument();
      });

      const textElement = container.querySelector('span') as HTMLElement;
      mockTruncation(textElement, true);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      await waitFor(() => {
        const wrapper = container.querySelector('div');
        expect(wrapper).toBeInTheDocument();
      });

      const wrapper = container.querySelector('div');
      act(() => {
        fireEvent.mouseEnter(wrapper!);
      });

      await waitFor(() => {
        expect(screen.getByTestId('tooltip')).toBeInTheDocument();
      });

      act(() => {
        fireEvent.mouseLeave(wrapper!);
      });

      await waitFor(() => {
        expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
      });
    });

    it('does not show tooltip when text is not truncated', async () => {
      const props = createMockProps({ value: 'Short text' });
      const { container } = render(<TruncatedTextCell {...props} />);

      await waitFor(() => {
        const textElement = container.querySelector('span') as HTMLElement;
        expect(textElement).toBeInTheDocument();
      });

      const textElement = container.querySelector('span') as HTMLElement;
      mockTruncation(textElement, false);

      act(() => {
        jest.advanceTimersByTime(100);
      });

      const wrapper = container.querySelector('div');
      act(() => {
        fireEvent.mouseEnter(wrapper!);
      });

      await waitFor(() => {
        // Tooltip should not be shown when not truncated
        expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
      });
    });
  });
});
