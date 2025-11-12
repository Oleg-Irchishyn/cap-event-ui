'use client';

import { ButtonContainer } from '@/app/new/styles';
import Button, { BUTTON_THEMES } from '@/app/components/Button';
import { useRouter } from 'next/navigation';
import { capEventSettingsStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import FootnotesModal from '@/app/new/FootnotesModal';
import { useState } from 'react';
import { ROUTES } from '@/const/routes';

const ButtonsGroup = () => {
  const router = useRouter();
  const [isFootnotesModalOpen, setFootnotesModalOpen] = useState(false);

  const isDescriptionPresentedInEntities = Array.from(
    capEventSettingsStore.entitiesLineItem.values(),
  )
    .flat()
    .some((item) => item.defaultDescription !== '');
  const isDescriptionPresentedInFundGroup = capEventSettingsStore.fundGroupsLineItem.some(
    (item) => item.defaultDescription !== '',
  );

  const isFootnotesButtonEnabled =
    isDescriptionPresentedInEntities || isDescriptionPresentedInFundGroup;

  return (
    <>
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
          testId="footnotes"
          disabled={!isFootnotesButtonEnabled}
          disabledTooltipText={'No Notice Line Description available'}
          width="auto"
          onClick={() => setFootnotesModalOpen((prev) => !prev)}
          buttonTheme={BUTTON_THEMES.secondary}
        >
          Footnotes
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
          onClick={() => router.push(ROUTES.ALLOCATION_DISTRIBUTION.path)}
          buttonTheme={BUTTON_THEMES.secondary}
        >
          Allocation Distribution
        </Button>
      </ButtonContainer>
      <FootnotesModal
        isOpen={isFootnotesModalOpen}
        handleClose={() => setFootnotesModalOpen(false)}
      />
    </>
  );
};

export default observer(ButtonsGroup);
