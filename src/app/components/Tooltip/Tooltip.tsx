import React, { FC, RefObject, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

type TooltipProps = {
  showTooltip: boolean;
  tooltipMessage: string;
  targetRef: RefObject<HTMLElement | null>;
  testId?: string;
};

const Tooltip: FC<TooltipProps> = ({ showTooltip, tooltipMessage, targetRef, testId }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (targetRef?.current) {
        const tooltipWidth = tooltipMessage.length * 6; // Rough estimation
        const tooltipHeight = 40;
        const offset = 1;

        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;

        let top = e.clientY + window.scrollY;
        let left = e.clientX + window.scrollX;

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
            Math.max(5, Math.min(viewportWidth - tooltipWidth - 5, e.clientX - tooltipWidth / 2)) +
            window.scrollX;
        }

        setPos({ top, left });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [targetRef, tooltipMessage.length]);

  return showTooltip && tooltipMessage
    ? createPortal(
        <div
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
            whiteSpace: 'nowrap',
            color: 'black',
            fontSize: '14px',
            zIndex: 99999,
          }}
        >
          {tooltipMessage}
        </div>,
        document.body,
      )
    : null;
};

export default Tooltip;
