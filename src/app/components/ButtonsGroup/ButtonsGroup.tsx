'use client';

import { observer } from 'mobx-react-lite';
import { useState } from 'react';

import { capEventSettingsStore, entityDatesStore, previewScreenStore } from '@/stores';

import Button, { BUTTON_THEMES } from '@/app/components/Button';
import FootnotesModal from '@/app/new/FootnotesModal';
import ContinueButton from '@/app/components/ContinueButton';
import SubmitButton from '@/app/components/SubmitButton';
import { usePathname, useRouter } from 'next/navigation';
import { ButtonContainer, Container, TitleContainer, Title } from '@/app/styles';
import { ROUTES } from '@/const/routes';
import { CapEventPackageApi } from '@/api';
import { showErrorToast } from '@/utils/showErrorToast';
import { useToast } from '@/providers/ToastProvider';
import useSaveDraftButton from '@/hooks/useSaveDraftButton';

const ButtonsGroup = () => {
  const [isFootnotesModalOpen, setFootnotesModalOpen] = useState(false);

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

  return (
    <>
      <Container>
        <TitleContainer>
          <Title>Capital Event - New</Title>
        </TitleContainer>
        <ButtonContainer>
          {renderBackButton}
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
    </>
  );
};

export default observer(ButtonsGroup);
