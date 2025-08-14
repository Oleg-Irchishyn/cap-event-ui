import React, { FC, RefObject, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

type TooltipProps = {
  showTooltip: boolean;
  tooltipMessage: string;
  targetRef: RefObject<HTMLDivElement | null>;
};

const Tooltip: FC<TooltipProps> = ({ showTooltip, tooltipMessage, targetRef }) => {
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (targetRef?.current) {
        const rec = targetRef.current.getBoundingClientRect();
        setPos({
          top: rec.top + window.scrollY + (e.clientY - rec.top),
          left: rec.left + window.scrollX + (e.clientX - rec.left) + 10,
        });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [targetRef]);

  return showTooltip && tooltipMessage
    ? createPortal(
        <div
          style={{
            display: 'flex',
            backgroundColor: 'white',
            borderRadius: '2px',
            position: 'absolute',
            top: pos.top - 40,
            left: pos.left,
            boxShadow: '0px 12px 16px rgba(0, 0, 0, 0.25)',
            padding: '10px',
            whiteSpace: 'nowrap',
            color: 'black',
            zIndex: 10,
          }}
        >
          {tooltipMessage}
        </div>,
        document.body,
      )
    : null;
};

export default Tooltip;
