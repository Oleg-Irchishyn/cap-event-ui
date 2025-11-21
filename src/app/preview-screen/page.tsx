'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import PreviewScreenDetails from '@/app/preview-screen/PreviewScreenDetails';
import useContinueButton from '@/hooks/useContinueButton';

import { ROUTES } from '@/const/routes';
import { PageContainer } from '@/app/styles';
import ButtonsGroup from '../new/ButtonsGroup';

const PreviewScreen = () => {
  const router = useRouter();
  const { isContinueDisabled } = useContinueButton();

  useEffect(() => {
    if (isContinueDisabled) {
      router.replace(ROUTES.NEW_CAP_EVENT.path);
    }
  }, [isContinueDisabled, router]);

  if (isContinueDisabled) {
    return null;
  }

  return (
    <PageContainer>
      <ButtonsGroup />
      <PreviewScreenDetails />
    </PageContainer>
  );
};

export default PreviewScreen;
