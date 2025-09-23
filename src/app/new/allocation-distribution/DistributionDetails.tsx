'use client';

import { CapEventPackageApi } from '@/api';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import DistributionJsonParseField from '@/app/new/allocation-distribution/DistributionJsonParseField';
import DistributionJsonUploadButton from '@/app/new/allocation-distribution/DistributionJsonUploadButton';
import DistributionTable from '@/app/new/allocation-distribution/DistributionTable';
import mockedResponse from '@/app/new/allocation-distribution/mockedResponse.json';
import { Title, Wrapper } from '@/app/new/styles';
import { CapEventProcessRequest } from '@/clients/CapEventPackage';
import { useToast } from '@/providers/ToastProvider';
import { parseToDistributionRows } from '@/utils/parseToDistributionRows';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { useState } from 'react';
import { DistributionRow } from './types';

const DistributionDetails = () => {
  const toast = useToast();
  const [payload, setPayload] = useState('');
  const [rows, setRows] = useState<DistributionRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleUpload = async () => {
    let requestPayload: CapEventProcessRequest;
    try {
      requestPayload = JSON.parse(payload) as CapEventProcessRequest;
    } catch {
      const msg = `Invalid JSON`;
      toast.error(msg);
      return;
    }

    try {
      setIsLoading(true);
      const response = await CapEventPackageApi.default.process(requestPayload);
      setRows(parseToDistributionRows(response));
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      toast.error(message);
      setRows(parseToDistributionRows(mockedResponse));
    } finally {
      setIsLoading(false);
    }
  };

  const onSetPayload = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPayload(e.target.value);
  };

  return (
    <BackgroundContainer testId={prepareDataTestId('background', 'allocation-distribution')}>
      <Wrapper>
        <Title>Allocation Distribution</Title>

        <DistributionJsonParseField
          testId={prepareDataTestId('json-parse', 'allocation-distribution')}
          payload={payload}
          onSetPayload={onSetPayload}
        />

        <DistributionJsonUploadButton
          testId={prepareDataTestId('upload', 'allocation-distribution')}
          isLoading={isLoading}
          payload={payload}
          handleUpload={handleUpload}
        />

        <DistributionTable
          testId={prepareDataTestId('table', 'allocation-distribution')}
          rows={rows}
          isLoading={isLoading}
        />
      </Wrapper>
    </BackgroundContainer>
  );
};

export default DistributionDetails;
