'use client';

import { ButtonContainer } from '@/app/new/styles';
import Button, { BUTTON_THEMES } from '@/app/components/Button';
import { useRouter } from 'next/navigation';

const ButtonsGroup = () => {
  const router = useRouter();

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
      <Button
        testId="allocation-distribution"
        width="auto"
        onClick={() => router.push('/new/allocation-distribution')}
        buttonTheme={BUTTON_THEMES.secondary}
      >
        Allocation Distribution
      </Button>
    </ButtonContainer>
  );
};

export default ButtonsGroup;
