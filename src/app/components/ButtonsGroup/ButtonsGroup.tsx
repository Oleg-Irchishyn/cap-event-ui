'use client';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';
import styled from 'styled-components';

import { capEventSettingsStore, entityDatesStore, previewScreenStore } from '@/stores';

import Button, { BUTTON_THEMES } from '@/app/components/Button';
import FootnotesModal from '@/app/new/FootnotesModal';
import ContinueButton from '@/app/components/ContinueButton';
import SubmitButton from '@/app/components/SubmitButton';
import { usePathname, useRouter } from 'next/navigation';
import { ButtonContainer, Container, TitleContainer, Title } from '@/app/styles';
import { ROUTES } from '@/const/routes';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import { CapEventPackageApi } from '@/api';
import { showErrorToast } from '@/utils/showErrorToast';
import { useToast } from '@/providers/ToastProvider';
import useSaveDraftButton from '@/hooks/useSaveDraftButton';
import { comparer } from 'mobx';
import { logout } from '@/utils/logout';

const BackIcon = styled.img.attrs({
  src: '/cap-event/icons/back.svg',
})({
  width: '18px',
  height: '16px',
  padding: '4px 3px',
  marginLeft: '10px',
});

const RightButtonsContainer = styled.div({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

const ButtonsGroup = () => {
  const [isFootnotesModalOpen, setFootnotesModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const path = usePathname();
  const toast = useToast();
  const router = useRouter();
  const { isSaveDraftDisabled } = useSaveDraftButton();

  const renderButton = () => {
    if (path === ROUTES.NEW_CAP_EVENT.path) {
      return <ContinueButton />;
    }
    if (path === ROUTES.PREVIEW_SCREEN.path) {
      return <SubmitButton />;
    }
  };

  const handleBackPress = () => {
    router.push(ROUTES.NEW_CAP_EVENT.path);
  };

  const handleCancelChanges = () => {
    capEventSettingsStore.cancelChanges();
    entityDatesStore.cancelChanges();
    entityDatesStore.clearGeneralNoticeDate();
    capEventSettingsStore.resetMfState();
    setIsConfirmationModalOpen(false);
    router.push(ROUTES.MAIN.path);
  };

  const renderBackButton =
    path === ROUTES.PREVIEW_SCREEN.path ? (
      <Button
        testId="back"
        width="auto"
        onClick={handleBackPress}
        buttonTheme={BUTTON_THEMES.secondary}
      >
        Back
      </Button>
    ) : null;

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

  const handleSaveDraft = async () => {
    try {
      const payload = previewScreenStore.buildPayload(true);
      if (payload) {
        const response = await CapEventPackageApi.default.createDraft(payload);
        if (response) {
          toast.success('Successfully Saved');
          router.push(ROUTES.MAIN.path);
          setTimeout(() => {
            capEventSettingsStore.resetStore();
            entityDatesStore.resetAllDates();
          }, 1000);
        }
      }
    } catch (error) {
      showErrorToast(error);
      console.error(error);
    }
  };

  let isFormClean: boolean;

  if (path === ROUTES.PREVIEW_SCREEN.path) {
    isFormClean = false;
  } else if (capEventSettingsStore.initialStateSnapshot) {
    isFormClean = comparer.structural(
      capEventSettingsStore.collectFields(),
      capEventSettingsStore.initialStateSnapshot,
    );
  } else {
    isFormClean = true;
  }

  const handleBackClick = () => {
    if (isFormClean) {
      router.push(ROUTES.MAIN.path);
    } else {
      setIsConfirmationModalOpen(true);
    }
  };

  return (
    <>
      <Container>
        <TitleContainer>
          <Title>Capital Event - New</Title>
          <RightButtonsContainer>
            <Button
              testId="back"
              width="auto"
              onClick={handleBackClick}
              buttonTheme={BUTTON_THEMES.text}
              textStyle={{ alignItems: 'center' }}
            >
              Back to Capital Event List
              <BackIcon />
            </Button>
            <Button width="auto" onClick={logout} buttonTheme={BUTTON_THEMES.text} testId="logout">
              Logout
            </Button>
          </RightButtonsContainer>
        </TitleContainer>
        <ButtonContainer>
          <Button
            testId="cancel"
            disabled={isFormClean}
            width="auto"
            onClick={() => setIsConfirmationModalOpen(true)}
            buttonTheme={BUTTON_THEMES.secondary}
          >
            Cancel
          </Button>
          {renderBackButton}
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
            style={{ display: 'none' }}
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
            style={{ display: 'none' }}
            disabled={isSaveDraftDisabled}
            width="auto"
            onClick={handleSaveDraft}
            buttonTheme={BUTTON_THEMES.secondary}
          >
            Save Draft
          </Button>
          {renderButton()}
        </ButtonContainer>
      </Container>
      <FootnotesModal
        isOpen={isFootnotesModalOpen}
        handleClose={() => setFootnotesModalOpen(false)}
      />
      <ConfirmationModal
        title="Unsaved Changes"
        isOpen={isConfirmationModalOpen}
        confirmText="Discard Changes"
        description="Unsaved changes detected. Do you want to discard changes?"
        handleClose={() => setIsConfirmationModalOpen(false)}
        handleProceed={handleCancelChanges}
      />
    </>
  );
};

export default observer(ButtonsGroup);
