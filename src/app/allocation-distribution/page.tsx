'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

import DistributionDetails from '@/app/allocation-distribution/DistributionDetails';
import useContinueButton from '@/hooks/useContinueButton';

import { ROUTES } from '@/const/routes';

const AllocationDistribution = () => {
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

  return <DistributionDetails />;
};

export default AllocationDistribution;
