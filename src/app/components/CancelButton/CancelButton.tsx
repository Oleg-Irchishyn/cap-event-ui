import { FC, useRef, useState } from 'react';
import Button, { BUTTON_THEMES } from '@/app/components/Button';
import Tooltip from '@/app/components/Tooltip';

import { CancelButtonWrapper } from './styles';

interface CancelButtonProps {
  isFormClean: boolean;
  onOpenConfirmationModal: () => void;
}

const CancelButton: FC<CancelButtonProps> = ({ isFormClean, onOpenConfirmationModal }) => {
  const cancelTooltipRef = useRef<HTMLDivElement | null>(null);
  const [showCancelTooltip, setShowCancelTooltip] = useState(false);

  const onShowTooltip = () => {
    if (!isFormClean) {
      setShowCancelTooltip(true);
    }
  };

  const onHideTooltip = () => {
    setShowCancelTooltip(false);
  };

  return (
    <CancelButtonWrapper
      ref={cancelTooltipRef}
      onMouseEnter={onShowTooltip}
      onMouseLeave={onHideTooltip}
    >
      <Button
        testId="cancel"
        disabled={isFormClean}
        width="auto"
        onClick={onOpenConfirmationModal}
        buttonTheme={BUTTON_THEMES.secondary}
      >
        Cancel
      </Button>
      <Tooltip
        tooltipMessage="Discard unsaved changes"
        showTooltip={showCancelTooltip}
        targetRef={cancelTooltipRef}
        testId="cancel-button-tooltip"
      />
    </CancelButtonWrapper>
  );
};

export default CancelButton;
