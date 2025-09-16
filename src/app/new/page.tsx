'use client';

import GeneralSettings from '@/app/new/GeneralSettings';
import ButtonsGroup from '@/app/new/ButtonsGroup';
import Attachments from '@/app/new/attachments/Attachments';
import CommentsField from '@/app/new/CommentsField';
import EntityLineItems from '@/app/new/LineItems/EntityLineItems';
import FundGroupLineItems from './LineItems/FundGroupLineItems';

const CapEvent = () => {
  return (
    <>
      <ButtonsGroup />
      <GeneralSettings />
      <FundGroupLineItems />
      <EntityLineItems />
      <Attachments />
      <CommentsField />
    </>
  );
};

export default CapEvent;
