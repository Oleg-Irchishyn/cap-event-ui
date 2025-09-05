'use client';

import GeneralSettings from '@/app/new/GeneralSettings';
import ButtonsGroup from '@/app/new/ButtonsGroup';
import Attachments from '@/app/new/attachments/Attachments';
import CommentsField from '@/app/new/CommentsField';
import EntityLineItems from '@/app/new/LineItems/EntityLineItems';

const CapEvent = () => {
  return (
    <>
      <ButtonsGroup />
      <GeneralSettings />
      <EntityLineItems />
      <Attachments />
      <CommentsField />
    </>
  );
};

export default CapEvent;
