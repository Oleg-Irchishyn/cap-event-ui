'use client';

import { useState, ChangeEvent } from 'react';
import { CapEventPackageApi } from '@/api';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import DistributionJsonParseField from '@/app/new/allocation-distribution/DistributionJsonParseField';
import DistributionJsonUploadButton from '@/app/new/allocation-distribution/DistributionJsonUploadButton';
import DistributionTable from '@/app/new/allocation-distribution/DistributionTable';
import { Title, Wrapper } from '@/app/new/styles';
import { CapEventProcessRequest } from '@/clients/CapEventPackage';
import { useToast } from '@/providers/ToastProvider';
import { parseToDistributionRows } from '@/utils/parseToDistributionRows';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { DistributionRow } from './types';
import { RowClickedEvent } from 'ag-grid-community';
import DetailsModal from '@/app/new/allocation-distribution/DetailsModal';

const DistributionDetails = () => {
  const toast = useToast();
  const [payload, setPayload] = useState('');
  const [rows, setRows] = useState<DistributionRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DistributionRow | null>(null);

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
      setRows([]);
    } finally {
      setIsLoading(false);
    }
  };

  const onSetPayload = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPayload(e.target.value);
  };

  const onRowClicked = (e: RowClickedEvent) => {
    setSelectedRow(e.data);
  };

  const closeModal = () => {
    setSelectedRow(null);
  };

  return (
    <>
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
            onRowClicked={onRowClicked}
          />
        </Wrapper>
      </BackgroundContainer>
      {selectedRow && <DetailsModal details={selectedRow} closeModal={closeModal} />}
    </>
  );
};

export default DistributionDetails;
