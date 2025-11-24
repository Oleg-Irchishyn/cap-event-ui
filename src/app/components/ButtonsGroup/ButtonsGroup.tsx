'use client';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { capEventSettingsStore } from '@/stores';

import Button, { BUTTON_THEMES } from '@/app/components/Button';
import FootnotesModal from '@/app/new/FootnotesModal';
import ContinueButton from '@/app/components/ContinueButton';
import SubmitButton from '@/app/components/SubmitButton';
import { usePathname } from 'next/navigation';
import { ButtonContainer } from '@/app/styles';
import { ROUTES } from '@/const/routes';

const ButtonsGroup = () => {
  const [isFootnotesModalOpen, setFootnotesModalOpen] = useState(false);

  const path = usePathname();

  const renderButton = () => {
    if (path === ROUTES.NEW_CAP_EVENT.path) {
      return <ContinueButton />;
    }
    if (path === ROUTES.PREVIEW_SCREEN.path) {
      return <SubmitButton />;
    }
  };

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
          // temporary hide the footnotes button by adding style={{ display: 'none' }}
          style={{ display: 'none' }}
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
        {renderButton()}
      </ButtonContainer>
      <FootnotesModal
        isOpen={isFootnotesModalOpen}
        handleClose={() => setFootnotesModalOpen(false)}
      />
    </>
  );
};

export default observer(ButtonsGroup);
