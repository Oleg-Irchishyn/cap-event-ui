import React, { createRef } from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import Tooltip from '../Tooltip';

// Mock createPortal to render tooltip in the same container
jest.mock('react-dom', () => ({
  ...jest.requireActual('react-dom'),
  createPortal: (node: React.ReactNode) => node,
}));

describe('Tooltip', () => {
  const mockTargetRef = createRef<HTMLDivElement>();
  const defaultProps = {
    showTooltip: true,
    tooltipMessage: 'Test tooltip message',
    targetRef: mockTargetRef,
    testId: 'test-tooltip',
  };

  beforeEach(() => {
    // Mock window properties
    Object.defineProperty(window, 'innerWidth', {
      writable: true,
      configurable: true,
      value: 1024,
    });
    Object.defineProperty(window, 'innerHeight', {
      writable: true,
      configurable: true,
      value: 768,
    });
    Object.defineProperty(window, 'scrollX', {
      writable: true,
      configurable: true,
      value: 0,
    });
    Object.defineProperty(window, 'scrollY', {
      writable: true,
      configurable: true,
      value: 0,
    });

    // Mock target element
    mockTargetRef.current = document.createElement('div');
    document.body.appendChild(mockTargetRef.current);
  });

  afterEach(() => {
    if (mockTargetRef.current) {
      document.body.removeChild(mockTargetRef.current);
    }
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should render tooltip when showTooltip is true and message is provided', () => {
      render(<Tooltip {...defaultProps} />);

      const tooltip = screen.getByTestId('test-tooltip');
      expect(tooltip).toBeInTheDocument();
      expect(tooltip).toHaveTextContent('Test tooltip message');
    });

    it('should not render tooltip when showTooltip is false', () => {
      render(<Tooltip {...defaultProps} showTooltip={false} />);

      const tooltip = screen.queryByTestId('test-tooltip');
      expect(tooltip).not.toBeInTheDocument();
    });

    it('should not render tooltip when message is empty', () => {
      render(<Tooltip {...defaultProps} tooltipMessage="" />);

      const tooltip = screen.queryByTestId('test-tooltip');
      expect(tooltip).not.toBeInTheDocument();
    });
  });

  describe('Positioning', () => {
    it('should position tooltip below cursor when there is space below', async () => {
      render(<Tooltip {...defaultProps} />);

      // Simulate mouse move event
      fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });

      await waitFor(() => {
        const tooltip = screen.getByTestId('test-tooltip');
        expect(tooltip).toHaveStyle({
          top: '61px', // 100 + 1 (offset) - 40 (tooltip offset)
          left: '101px', // 100 + 1 (offset)
        });
      });
    });

    it('should position tooltip above cursor when there is no space below', async () => {
      // Set small viewport height to force positioning above
      Object.defineProperty(window, 'innerHeight', {
        writable: true,
        configurable: true,
        value: 100,
      });

      render(<Tooltip {...defaultProps} />);

      // Simulate mouse move event near bottom of viewport
      fireEvent.mouseMove(window, { clientX: 100, clientY: 80 });

      await waitFor(() => {
        const tooltip = screen.getByTestId('test-tooltip');
        expect(tooltip).toHaveStyle({
          top: '-1px', // 80 - 40 (tooltip height) - 1 (offset)
          left: '101px',
        });
      });
    });

    it('should position tooltip to the right of cursor when there is space', async () => {
      render(<Tooltip {...defaultProps} />);

      // Simulate mouse move event
      fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });

      await waitFor(() => {
        const tooltip = screen.getByTestId('test-tooltip');
        expect(tooltip).toHaveStyle({
          left: '101px', // 100 + 1 (offset)
        });
      });
    });

    it('should update position on mouse move', async () => {
      render(<Tooltip {...defaultProps} />);

      // First mouse move
      fireEvent.mouseMove(window, { clientX: 100, clientY: 100 });

      await waitFor(() => {
        const tooltip = screen.getByTestId('test-tooltip');
        expect(tooltip).toHaveStyle({
          top: '61px', // 100 + 1 (offset) - 40 (tooltip offset)
          left: '101px', // 100 + 1 (offset)
        });
      });

      // Second mouse move
      fireEvent.mouseMove(window, { clientX: 200, clientY: 200 });

      await waitFor(() => {
        const tooltip = screen.getByTestId('test-tooltip');
        expect(tooltip).toHaveStyle({
          top: '161px', // 200 + 1 (offset) - 40 (tooltip offset)
          left: '201px', // 200 + 1 (offset)
        });
      });
    });
  });

  describe('Event Handling', () => {
    it('should add and remove mouse move event listener', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');

      const { unmount } = render(<Tooltip {...defaultProps} />);

      expect(addEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));

      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('mousemove', expect.any(Function));
    });
  });
});
