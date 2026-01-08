import { FC } from 'react';
import Button, { BUTTON_THEMES } from '@/app/components/Button';

interface FootnotesButtonProps {
  isFootnotesButtonEnabled: boolean;
  onToggleFootnotesModal: () => void;
}

const FootnotesButton: FC<FootnotesButtonProps> = ({
  isFootnotesButtonEnabled,
  onToggleFootnotesModal,
}) => {
  return (
    <Button
      testId="footnotes"
      style={{ display: 'none' }}
      disabled={!isFootnotesButtonEnabled}
      disabledTooltipText={'No Notice Line Description available'}
      width="auto"
      onClick={onToggleFootnotesModal}
      buttonTheme={BUTTON_THEMES.secondary}
    >
      Footnotes
    </Button>
  );
};

export default FootnotesButton;
