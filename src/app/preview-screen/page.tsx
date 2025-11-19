'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import PreviewScreenDetails from '@/app/preview-screen/PreviewScreenDetails';
import useContinueButton from '@/hooks/useContinueButton';

import { ROUTES } from '@/const/routes';

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

  return <PreviewScreenDetails />;
};

export default PreviewScreen;
