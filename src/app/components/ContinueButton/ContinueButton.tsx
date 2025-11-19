import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';

import Button, { BUTTON_THEMES } from '@/app/components/Button';
import Tooltip from '@/app/components/Tooltip';
import useContinueButton from '@/hooks/useContinueButton';

import { ROUTES } from '@/const/routes';

import { ContinueButtonWrapper } from './styles';

const ContinueButton = () => {
  const router = useRouter();

  const [showContinueTooltip, setShowContinueTooltip] = useState(false);
  const continueTooltipRef = useRef<HTMLDivElement | null>(null);

  const { isContinueDisabled, tooltipMessage } = useContinueButton();

  const onShowTooltip = () => {
    if (isContinueDisabled) {
      setShowContinueTooltip(true);
    }
  };

  const onHideTooltip = () => {
    setShowContinueTooltip(false);
  };

  const onContinueClick = () => {
    router.push(ROUTES.PREVIEW_SCREEN.path);
  };

  return (
    <ContinueButtonWrapper
      ref={continueTooltipRef}
      onMouseEnter={onShowTooltip}
      onMouseLeave={onHideTooltip}
    >
      <Button
        testId="preview-screen"
        disabled={isContinueDisabled}
        width="auto"
        onClick={onContinueClick}
        buttonTheme={BUTTON_THEMES.primary}
      >
        Continue
      </Button>
      <Tooltip
        tooltipMessage={tooltipMessage}
        showTooltip={showContinueTooltip}
        targetRef={continueTooltipRef}
        testId="continue-button-tooltip"
      />
    </ContinueButtonWrapper>
  );
};

export default observer(ContinueButton);
