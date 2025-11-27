import { FC, useRef, useState } from 'react';
import { DetailsReadOnlyInfoProps } from './types';
import { PanelItem, PanelItemDescription, PanelItemTitle, PressableWrapper } from './style';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import Image from 'next/image';
import Tooltip from '@/app/components/Tooltip';
import { generateIntacctLink } from '@/utils/generateIntacctLink';
import { getStoredSessionId } from '@/utils/sessionIdStorage';

const DetailsReadOnlyInfo: FC<DetailsReadOnlyInfoProps> = ({
  title,
  description,
  testId = 'details-read-only-info',
  entityId,
}) => {
  const labelRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLinkClick = () => {
    const sessionId = getStoredSessionId() ?? '';
    window.open(generateIntacctLink({ sessionId, type: 'entity', entityId }), '_blank');
  };

  return (
    <PanelItem data-testid={prepareDataTestId(testId)}>
      <PanelItemTitle ref={labelRef}>
        {title}
        <PressableWrapper
          onClick={handleLinkClick}
          onMouseOver={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <Image src="/cap-event/icons/link.svg" alt="link" width={11} height={11} />

          <Tooltip
            tooltipMessage="Redirect to Entity profile in Intacct"
            showTooltip={showTooltip}
            targetRef={labelRef}
          />
        </PressableWrapper>
      </PanelItemTitle>
      <PanelItemDescription> {description}</PanelItemDescription>
    </PanelItem>
  );
};

export default DetailsReadOnlyInfo;
