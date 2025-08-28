'use client';

import GeneralSettings from '@/app/new/GeneralSettings';
import ButtonsGroup from '@/app/new/ButtonsGroup';
import Attachments from '@/app/new/attachments/Attachments';
import CommentsField from '@/app/new/CommentsField';

const CapEvent = () => {
  return (
    <>
      <ButtonsGroup />
      <GeneralSettings />
      <Attachments />
      <CommentsField />
    </>
  );
};

export default CapEvent;
