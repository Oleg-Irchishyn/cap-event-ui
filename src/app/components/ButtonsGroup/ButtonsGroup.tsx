'use client';

import { comparer } from 'mobx';
import { observer } from 'mobx-react-lite';
import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';
import styled from 'styled-components';

import { ButtonContainer, Container, Title, TitleContainer } from '@/app/styles';
import { ROUTES } from '@/const/routes';
import { capEventSettingsStore, entityDatesStore } from '@/stores';

import BackButton from '@/app/components/BackButton';
import BackToCapEventListButton from '@/app/components/BackToCapEventListButton';
import CancelButton from '@/app/components/CancelButton';
import ContinueButton from '@/app/components/ContinueButton';
import FootnotesButton from '@/app/components/FootnotesButton';
import LogoutButton from '@/app/components/LogoutButton';
import SaveDraftButton from '@/app/components/SaveDraftButton';
import SubmitButton from '@/app/components/SubmitButton';
import DeleteButton from '@/app/components/DeleteButton';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import FootnotesModal from '@/app/new/FootnotesModal';

const RightButtonsContainer = styled.div({
  display: 'flex',
  gap: '8px',
  alignItems: 'center',
});

const ButtonsGroup = () => {
  const [isFootnotesModalOpen, setFootnotesModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);

  const path = usePathname();
  const router = useRouter();

  const renderButton = () => {
    if (path === ROUTES.NEW_CAP_EVENT.path) {
      return <ContinueButton />;
    }
    if (path === ROUTES.PREVIEW_SCREEN.path) {
      return <SubmitButton />;
    }
  };

  const onOpenConfirmationModal = () => {
    setIsConfirmationModalOpen(true);
  };

  const onCloseConfirmationModal = () => {
    setIsConfirmationModalOpen(false);
  };

  const onCloseFootnotesModal = () => {
    setFootnotesModalOpen(false);
  };

  const onToggleFootnotesModal = () => {
    setFootnotesModalOpen((prev) => !prev);
  };

  const handleCancelChanges = () => {
    // Fully reset stores to ensure a clean slate when user returns to the New page
    capEventSettingsStore.cancelChanges();
    entityDatesStore.cancelChanges();
    entityDatesStore.clearGeneralNoticeDate();
    capEventSettingsStore.resetMfState();
    capEventSettingsStore.resetStore();
    entityDatesStore.resetAllDates();
    onCloseConfirmationModal();
    router.push(ROUTES.MAIN.path);
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

  let isFormClean: boolean;

  if (path === ROUTES.PREVIEW_SCREEN.path) {
    isFormClean = false;
  } else if (capEventSettingsStore.initialStateSnapshot) {
    // Ignore non-user-controlled fields that change due to background loads
    const currentFields = capEventSettingsStore.collectFields() as Record<string, unknown>;
    const snapshotFields = capEventSettingsStore.initialStateSnapshot as Record<string, unknown>;

    const {
      investments: _currInvestments,
      areInvestmentsLoading: _currAreInvestmentsLoading,
      mgmtJournalEntries: _currMgmtJournalEntries,
      ...currentUserFields
    } = currentFields;

    const {
      investments: _snapInvestments,
      areInvestmentsLoading: _snapAreInvestmentsLoading,
      mgmtJournalEntries: _snapMgmtJournalEntries,
      ...snapshotUserFields
    } = snapshotFields;

    isFormClean = comparer.structural(currentUserFields, snapshotUserFields);
  } else {
    isFormClean = true;
  }

  return (
    <>
      <Container>
        <TitleContainer>
          <Title>Capital Event - New</Title>
          <RightButtonsContainer>
            <BackToCapEventListButton
              isFormClean={isFormClean}
              onOpenConfirmationModal={onOpenConfirmationModal}
            />
            <LogoutButton />
          </RightButtonsContainer>
        </TitleContainer>
        <ButtonContainer>
          <CancelButton
            isFormClean={isFormClean}
            onOpenConfirmationModal={onOpenConfirmationModal}
          />
          <BackButton />
          <FootnotesButton
            isFootnotesButtonEnabled={isFootnotesButtonEnabled}
            onToggleFootnotesModal={onToggleFootnotesModal}
          />
          <DeleteButton />
          <SaveDraftButton />
          {renderButton()}
        </ButtonContainer>
      </Container>
      <FootnotesModal isOpen={isFootnotesModalOpen} handleClose={onCloseFootnotesModal} />
      <ConfirmationModal
        title="Unsaved Changes"
        isOpen={isConfirmationModalOpen}
        confirmText="Discard Changes"
        description="Unsaved changes detected. Do you want to discard changes?"
        handleClose={onCloseConfirmationModal}
        handleProceed={handleCancelChanges}
      />
    </>
  );
};

export default observer(ButtonsGroup);
