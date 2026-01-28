'use client';

import Button, { BUTTON_THEMES } from '@/app/components/Button';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/const/routes';
import {
  ButtonContainer,
  Container,
  PageContainer,
  TitleContainer,
  Title as PageTitle,
} from '@/app/styles';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import { CapEventCollectionTable } from '@/app/components/CapEventCollectionTable/CapEventCollectionTable';
import { useState, useEffect } from 'react';
import { Title } from '@/app/new/styles';
import { capEventSettingsStore } from '@/stores';
import { ITEM_STATES } from '@/const/common';
import { CapEvent } from '@/clients/CapEventPackage';
import { useToast } from '@/providers/ToastProvider';
import { CapEventPackageApi } from '@/api';
import { logout } from '@/utils/logout';

export default function Page() {
  const router = useRouter();
  const toast = useToast();

  const [events, setEvents] = useState<CapEvent[]>([]);
  const [isListLoading, setIsListLoading] = useState(false);

  useEffect(() => {
    const getCapEvents = async () => {
      try {
        setIsListLoading(true);

        const selectedSponsorId = capEventSettingsStore.sponsors.find(
          (sponsor) => sponsor.state === ITEM_STATES.SELECTED,
        )?.id;

        const capEvents = await CapEventPackageApi.default
          .getCapEventList({
            sponsorId: selectedSponsorId,
          })
          .then((res) => res.data);
        setEvents(capEvents);
      } catch (error) {
        console.error(error);
        if (error instanceof Error) toast.error(error?.message);
      } finally {
        setIsListLoading(false);
      }
    };
    getCapEvents();
  }, [toast]);

  return (
    <PageContainer>
      <Container>
        <TitleContainer>
          <PageTitle>Capital Event</PageTitle>
          <Button width="auto" onClick={logout} buttonTheme={BUTTON_THEMES.text} testId="logout">
            Logout
          </Button>
        </TitleContainer>
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
      </Container>
      <BackgroundContainer>
        <Title>Capital Events List</Title>
        <CapEventCollectionTable
          rows={events}
          isLoading={isListLoading}
          testId="cap-event-collection"
        />
      </BackgroundContainer>
    </PageContainer>
  );
}
