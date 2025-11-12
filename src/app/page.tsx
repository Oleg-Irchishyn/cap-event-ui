'use client';

import Button, { BUTTON_THEMES } from '@/app/components/Button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/const/routes';
import { ButtonContainer } from '@/app/styles';

export default function Page() {
  const router = useRouter();

  return (
    <ButtonContainer>
      <Button
        width="auto"
        onClick={() => router.push(ROUTES.NEW_CAP_EVENT.path)}
        buttonTheme={BUTTON_THEMES.primary}
        testId="new-capital-event"
      >
        New Capital Event
      </Button>
    </ButtonContainer>
  );
}
