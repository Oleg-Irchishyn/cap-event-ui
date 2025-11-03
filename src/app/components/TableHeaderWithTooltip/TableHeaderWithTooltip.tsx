import { useRef, useState } from 'react';
import Tooltip from '@/app/components/Tooltip';
import { HeaderName, HeaderWrapper, HelpIcon, IconWrapper } from './style';
import { IHeaderParams } from 'ag-grid-community';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

export const TableHeaderWithTooltip = (props: IHeaderParams) => {
  const [showTooltip, setTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const { displayName, column } = props;

  const headerComponentParams = column?.getColDef().headerComponentParams;
  const tooltipMessage = headerComponentParams?.tooltipMessage ?? '';
  const headerAlignment = headerComponentParams?.headerAlignment;

  return (
    <HeaderWrapper $headerAlignment={headerAlignment}>
      <HeaderName>{displayName}</HeaderName>
      <IconWrapper ref={tooltipRef}>
        <HelpIcon
          onMouseEnter={() => setTooltip(true)}
          onMouseLeave={() => setTooltip(false)}
          data-testid="help-icon"
        />
      </IconWrapper>
      <Tooltip
        tooltipMessage={tooltipMessage}
        showTooltip={showTooltip}
        targetRef={tooltipRef}
        testId={prepareDataTestId(displayName, 'tooltip')}
      />
    </HeaderWrapper>
  );
};
