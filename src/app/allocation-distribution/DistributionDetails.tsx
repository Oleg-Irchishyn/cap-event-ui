'use client';

import { useState, ChangeEvent } from 'react';
import { RowClickedEvent } from 'ag-grid-community';
import { observer } from 'mobx-react-lite';

import { allocationDistributionStore } from '@/stores/AllocationDistributionStore';
import { useToast } from '@/providers/ToastProvider';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import DetailsModal from '@/app/allocation-distribution/DetailsModal';
import DistributionJsonParseField from '@/app/allocation-distribution/DistributionJsonParseField';
import DistributionJsonUploadButton from '@/app/allocation-distribution/DistributionJsonUploadButton';
import DistributionTable from '@/app/allocation-distribution/DistributionTable';
import { Title, Wrapper } from '@/app/new/styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import { DistributionRow } from './types';

const DistributionDetails = () => {
  const toast = useToast();
  const [payload, setPayload] = useState('');
  const [rows, setRows] = useState<DistributionRow[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedRow, setSelectedRow] = useState<DistributionRow | null>(null);
  const [noticePreviewDoc, setNoticePreviewDoc] = useState<Blob | null>(null);

  const handleUpload = async () => {
    setRows([]);
    setIsLoading(true);
    const newRows = await allocationDistributionStore.processPayload(payload, toast);
    setRows(newRows);
    setIsLoading(false);
  };

  const onSetPayload = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setPayload(e.target.value);
  };

  const onRowClicked = async (e: RowClickedEvent) => {
    if (e.data?.isAggregated) {
      setSelectedRow(e.data);
      const blob = await allocationDistributionStore.fetchDoc(e.data.ceBoxFileId);
      setNoticePreviewDoc(blob ?? null);
    }
  };

  const closeModal = () => {
    setSelectedRow(null);
    setNoticePreviewDoc(null);
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
      {selectedRow && (
        <DetailsModal
          noticePreviewDoc={noticePreviewDoc}
          closeModal={closeModal}
          selectedRow={selectedRow}
        />
      )}
    </>
  );
};
export default observer(DistributionDetails);
