import React, { FC, RefObject, useEffect, useState, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

type TooltipProps = {
  showTooltip: boolean;
  tooltipMessage: string;
  targetRef: RefObject<HTMLElement | null>;
  testId?: string;
  position?: 'cursor' | 'center';
};

const Tooltip: FC<TooltipProps> = ({
  showTooltip,
  tooltipMessage,
  targetRef,
  testId,
  position = 'cursor',
}) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);
  const lastMousePosRef = useRef<{ x: number; y: number } | null>(null);

  const calculateCenterPosition = useCallback(
    (mouseX: number, mouseY: number) => {
      if (!tooltipRef.current) return;

      const actualWidth = tooltipRef.current.offsetWidth || tooltipMessage.length * 6;
      const actualHeight = tooltipRef.current.offsetHeight || 40;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const minOffset = 5;

      let top = mouseY - actualHeight / 2 + window.scrollY;
      let left = mouseX - actualWidth / 2 + window.scrollX;

      top = Math.max(
        minOffset + window.scrollY,
        Math.min(viewportHeight - actualHeight - minOffset + window.scrollY, top),
      );
      left = Math.max(
        minOffset + window.scrollX,
        Math.min(viewportWidth - actualWidth - minOffset + window.scrollX, left),
      );

      setPos({ top, left });
    },
    [tooltipMessage.length],
  );

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (targetRef?.current) {
        lastMousePosRef.current = { x: e.clientX, y: e.clientY };

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        const offset = 1;

        // Get actual tooltip dimensions if available, otherwise use estimates
        const actualWidth = tooltipRef.current?.offsetWidth || tooltipMessage.length * 6;
        const actualHeight = tooltipRef.current?.offsetHeight || 40;
        const tooltipWidth = actualWidth;
        const tooltipHeight = actualHeight;

        let top = e.clientY + window.scrollY;
        let left = e.clientX + window.scrollX;

        if (position === 'center') {
          // Center the tooltip on the cursor using actual dimensions
          calculateCenterPosition(e.clientX, e.clientY);
          return;
        } else {
          // Vertical positioning logic
          const spaceAbove = e.clientY;
          const spaceBelow = viewportHeight - e.clientY;

          if (spaceBelow >= tooltipHeight + offset) {
            // Prefer below cursor
            top += offset;
          } else if (spaceAbove >= tooltipHeight + offset) {
            // Show above cursor
            top -= tooltipHeight + offset;
          } else {
            // Use the side with more space, with minimum offset
            const minOffset = 5;
            if (spaceAbove > spaceBelow) {
              top = Math.max(minOffset, e.clientY - tooltipHeight - minOffset) + window.scrollY;
            } else {
              top =
                Math.min(viewportHeight - tooltipHeight - minOffset, e.clientY + minOffset) +
                window.scrollY;
            }
          }

          const spaceLeft = e.clientX;
          const spaceRight = viewportWidth - e.clientX;

          if (spaceRight >= tooltipWidth + offset) {
            // Prefer right of cursor
            left += offset;
          } else if (spaceLeft >= tooltipWidth + offset) {
            // Show left of cursor
            left -= tooltipWidth + offset;
          } else {
            // Center horizontally, but keep within viewport bounds
            left =
              Math.max(
                5,
                Math.min(viewportWidth - tooltipWidth - 5, e.clientX - tooltipWidth / 2),
              ) + window.scrollX;
          }
        }

        setPos({ top, left });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [calculateCenterPosition, position, targetRef, tooltipMessage.length]);

  // Recalculate position when tooltip dimensions change (for multi-line tooltips)
  useEffect(() => {
    if (!showTooltip || position !== 'center' || !lastMousePosRef.current) return;

    const recalculatePosition = () => {
      if (lastMousePosRef.current && tooltipRef.current) {
        calculateCenterPosition(lastMousePosRef.current.x, lastMousePosRef.current.y);
      }
    };

    // Use requestAnimationFrame to ensure tooltip is rendered with correct dimensions
    const rafId = requestAnimationFrame(() => {
      requestAnimationFrame(recalculatePosition);
    });

    return () => cancelAnimationFrame(rafId);
  }, [showTooltip, position, tooltipMessage, calculateCenterPosition]);

  return showTooltip && tooltipMessage
    ? createPortal(
        <div
          ref={tooltipRef}
          data-testid={prepareDataTestId('tooltip', testId)}
          style={{
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: '2px',
            position: 'absolute',
            top: pos.top - 40,
            left: pos.left,
            boxShadow: '0px 4px 4px rgba(0, 0, 0, 0.25)',
            padding: '10px 12px',
            whiteSpace: 'pre-line',
            color: 'black',
            fontSize: '14px',
            zIndex: 99999,
            pointerEvents: 'none',
          }}
        >
          {tooltipMessage}
        </div>,
        document.body,
      )
    : null;
};

export default Tooltip;
