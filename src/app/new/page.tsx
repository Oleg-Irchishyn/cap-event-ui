'use client';

import GeneralSettings from '@/app/new/GeneralSettings';
import ButtonsGroup from '@/app/components/ButtonsGroup/ButtonsGroup';
import Attachments from '@/app/new/attachments/Attachments';
import CommentsField from '@/app/new/CommentsField';
import EntityLineItems from '@/app/new/LineItems/EntityLineItems';
import FundGroupLineItems from '@/app/new/LineItems/FundGroupLineItems';
import { PageContainer } from '@/app/styles';
import { useEffect } from 'react';
import { capEventSettingsStore, entityDatesStore } from '@/stores';

const CapEvent = () => {
  useEffect(() => {
    // Reset selections and dates when enter the page, till we don't have local data base
    capEventSettingsStore.resetAfterPreview();
    entityDatesStore.resetAllDates();
  }, []);

  return (
    <PageContainer>
      <ButtonsGroup />
      <GeneralSettings />
      <FundGroupLineItems />
      <EntityLineItems />
      <Attachments />
      <CommentsField />
    </PageContainer>
  );
};

export default CapEvent;
