import { usePathname, useRouter } from 'next/navigation';
import { ROUTES } from '@/const/routes';
import Button, { BUTTON_THEMES } from '@/app/components/Button';
import Tooltip from '@/app/components/Tooltip';

import { BackButtonWrapper } from './styles';
import { useRef, useState } from 'react';

const BackButton = () => {
  const path = usePathname();
  const router = useRouter();

  const backTooltipRef = useRef<HTMLDivElement | null>(null);
  const [showBackTooltip, setShowBackTooltip] = useState(false);

  const onShowTooltip = () => {
    setShowBackTooltip(true);
  };

  const onHideTooltip = () => {
    setShowBackTooltip(false);
  };

  const handleBackPress = () => {
    router.push(ROUTES.NEW_CAP_EVENT.path);
  };

  if (path !== ROUTES.PREVIEW_SCREEN.path) {
    return null;
  }

  return (
    <BackButtonWrapper
      ref={backTooltipRef}
      onMouseEnter={onShowTooltip}
      onMouseLeave={onHideTooltip}
    >
      <Button
        testId="back"
        width="auto"
        onClick={handleBackPress}
        buttonTheme={BUTTON_THEMES.secondary}
      >
        Back
      </Button>
      <Tooltip
        tooltipMessage="Back to previous page"
        showTooltip={showBackTooltip}
        targetRef={backTooltipRef}
        testId="back-button-tooltip"
      />
    </BackButtonWrapper>
  );
};

export default BackButton;
