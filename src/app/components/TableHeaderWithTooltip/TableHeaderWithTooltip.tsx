import { useRef, useState } from 'react';
import Tooltip from '@/app/components/Tooltip';
import { HeaderName, HeaderWrapper, HelpIcon, IconWrapper } from './style';
import { IHeaderParams } from 'ag-grid-community';

export const TableHeaderWithTooltip = (props: IHeaderParams) => {
  const [showTooltip, setTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const { displayName } = props;

  return (
    <HeaderWrapper>
      <HeaderName>{displayName}</HeaderName>
      <IconWrapper ref={tooltipRef}>
        <HelpIcon
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          data-testid="help-icon"
        />
      </IconWrapper>
      <Tooltip
        tooltipMessage="Input Contributions as positive amounts, and Distributions as negative amounts"
        showTooltip={showTooltip}
        targetRef={tooltipRef}
        testId="amount-icon-tooltip"
      />
    </HeaderWrapper>
  );
};
