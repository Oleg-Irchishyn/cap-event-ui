import { FC, useRef, useState } from 'react';
import { DetailsReadOnlyInfoProps } from './types';
import { PanelItem, PanelItemDescription, PanelItemTitle, PressableWrapper } from './style';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import Image from 'next/image';
import Tooltip from '@/app/components/Tooltip';
import { generateIntacctLink } from '@/utils/generateIntacctLink';
import { capEventSettingsStore } from '@/stores';

const DetailsReadOnlyInfo: FC<DetailsReadOnlyInfoProps> = ({
  title,
  description,
  testId = 'details-read-only-info',
  entityId,
}) => {
  const labelRef = useRef(null);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleLinkClick = () => {
    window.open(
      generateIntacctLink({ sessionId: capEventSettingsStore.sessionId, type: 'entity', entityId }),
      '_blank',
    );
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
          <Image src="icons/link.svg" alt="link" width={11} height={11} />

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
