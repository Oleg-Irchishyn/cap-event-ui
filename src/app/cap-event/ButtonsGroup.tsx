import { ButtonContainer } from '@/app/cap-event/styles';
import Button, { BUTTON_THEMES } from '@/app/components/Button';

const ButtonsGroup = () => {
  return (
    <ButtonContainer>
      <Button
        testId="cancel"
        disabled
        width="auto"
        onClick={() => {}}
        buttonTheme={BUTTON_THEMES.secondary}
      >
        Cancel
      </Button>
      <Button
        testId="delete"
        disabled
        width="auto"
        onClick={() => {}}
        buttonTheme={BUTTON_THEMES.secondary}
      >
        Delete Capital Event
      </Button>
      <Button
        testId="save-draft"
        disabled
        width="auto"
        onClick={() => {}}
        buttonTheme={BUTTON_THEMES.secondary}
      >
        Save Draft
      </Button>
      <Button
        testId="continue"
        disabled
        width="auto"
        onClick={() => {}}
        buttonTheme={BUTTON_THEMES.primary}
      >
        Continue
      </Button>
    </ButtonContainer>
  );
};

export default ButtonsGroup;
