import Tooltip from '@/app/components/Tooltip';
import { generateIntacctLink } from '@/utils/generateIntacctLink';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { getStoredSessionId } from '@/utils/sessionIdStorage';
import Image from 'next/image';
import { FC, useRef, useState } from 'react';
import { PanelItem, PanelItemTitle, PressableWrapper } from './style';
import { DetailsEntityNameProps } from './types';

const DetailsEntityName: FC<DetailsEntityNameProps> = ({
  title,
  testId = 'entity-name',
  entityId,
}) => {
  const labelRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLinkClick = () => {
    const sessionId = getStoredSessionId() ?? '';
    window.open(generateIntacctLink({ sessionId, type: 'entity', entityId }), '_blank');
  };

  const handleShowTooltip = () => {
    setShowTooltip(true);
  };

  const handleHideTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <PanelItem data-testid={prepareDataTestId(testId)}>
      <PanelItemTitle ref={labelRef}>
        {title}
        <PressableWrapper
          onClick={handleLinkClick}
          onMouseOver={handleShowTooltip}
          onMouseLeave={handleHideTooltip}
        >
          <Image src="/cap-event/icons/link.svg" alt="link" width={12} height={12} />

          <Tooltip
            tooltipMessage="Redirect to Entity profile in Intacct"
            showTooltip={showTooltip}
            targetRef={labelRef}
          />
        </PressableWrapper>
      </PanelItemTitle>
    </PanelItem>
  );
};

export default DetailsEntityName;
