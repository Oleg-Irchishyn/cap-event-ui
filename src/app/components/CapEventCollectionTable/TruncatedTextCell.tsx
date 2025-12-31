import { FC, useRef, useState, useEffect } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import Tooltip from '@/app/components/Tooltip';
import styled from 'styled-components';

const CellWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  min-width: 0;
  overflow: hidden;
`;

const CellText = styled.span<{ $textAlign?: 'start' | 'end' | 'center' }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: ${({ $textAlign }) => $textAlign};
  width: 100%;
  min-width: 0;
`;

type TruncatedTextCellParams = ICellRendererParams & {
  textAlign?: 'start' | 'end' | 'center';
};

export const TruncatedTextCell: FC<TruncatedTextCellParams> = (params) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const textRef = useRef<HTMLSpanElement>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  const displayValue = params.valueFormatted ?? params.value ?? '-';
  const valueString = String(displayValue);
  const textAlign = params.textAlign ?? 'start';

  useEffect(() => {
    const checkTruncation = () => {
      if (textRef.current) {
        const element = textRef.current;
        const isTextTruncated = element.scrollWidth > element.clientWidth + 1; // Add 1px tolerance for rounding
        setIsTruncated(isTextTruncated);
      }
    };

    // Use a small delay to ensure the DOM has updated
    const timeoutId = setTimeout(checkTruncation, 0);

    // Also check after a brief delay to handle async rendering
    const delayedCheck = setTimeout(checkTruncation, 100);

    return () => {
      clearTimeout(timeoutId);
      clearTimeout(delayedCheck);
    };
  }, [valueString]);

  const handleMouseEnter = () => {
    if (isTruncated && valueString && valueString !== '-') {
      setShowTooltip(true);
    }
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <>
      <CellWrapper onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
        <CellText ref={textRef} $textAlign={textAlign}>
          {valueString}
        </CellText>
      </CellWrapper>
      {isTruncated && valueString !== '-' && (
        <Tooltip showTooltip={showTooltip} tooltipMessage={valueString} targetRef={textRef} />
      )}
    </>
  );
};
