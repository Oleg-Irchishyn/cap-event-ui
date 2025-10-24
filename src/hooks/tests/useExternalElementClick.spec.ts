import '@testing-library/jest-dom';
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useExternalElementClick } from '@/hooks/useExternalElementClick';

const TestComponent = ({ onOutside }: { onOutside: (e: Event) => void }) => {
  const ref = React.useRef<HTMLDivElement | null>(null);
  useExternalElementClick(ref, onOutside);

  return React.createElement(
    'div',
    null,
    React.createElement('div', { ref, 'data-testid': 'inside' }, 'inside'),
    React.createElement('div', { 'data-testid': 'outside' }, 'outside'),
  );
};

describe('useExternalElementClick', () => {
  it('calls callback on outside click', () => {
    const cb = jest.fn();
    render(React.createElement(TestComponent, { onOutside: cb }));

    const outside = screen.getByTestId('outside');
    fireEvent.mouseDown(outside);

    expect(cb).toHaveBeenCalledTimes(1);
  });

  it('does not call callback on inside click', () => {
    const cb = jest.fn();
    render(React.createElement(TestComponent, { onOutside: cb }));

    const inside = screen.getByTestId('inside');
    fireEvent.mouseDown(inside);

    expect(cb).not.toHaveBeenCalled();
  });

  it('removes event listener on unmount', () => {
    const cb = jest.fn();
    const { unmount } = render(React.createElement(TestComponent, { onOutside: cb }));
    unmount();

    fireEvent.mouseDown(document);

    expect(cb).not.toHaveBeenCalled();
  });
});
