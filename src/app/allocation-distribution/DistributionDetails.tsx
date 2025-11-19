'use client';

import { useEffect, useState } from 'react';
import { RowClickedEvent } from 'ag-grid-community';
import { observer } from 'mobx-react-lite';

import { allocationDistributionStore } from '@/stores/AllocationDistributionStore';
import { useToast } from '@/providers/ToastProvider';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import DetailsModal from '@/app/allocation-distribution/DetailsModal';
import DistributionTable from '@/app/allocation-distribution/DistributionTable';
import { Title, Wrapper } from '@/app/new/styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import { DistributionRow } from './types';

const DistributionDetails = () => {
  const toast = useToast();
  const [rows, setRows] = useState<DistributionRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<DistributionRow | null>(null);
  const [noticePreviewDoc, setNoticePreviewDoc] = useState<Blob | null>(null);

  useEffect(() => {
    const process = async () => {
      setRows([]);
      const newRows = await allocationDistributionStore.processPayload(toast);
      setRows(newRows);
    };
    process();
  }, [toast]);

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
          <Title>Preview Screen</Title>

          <DistributionTable
            testId={prepareDataTestId('table', 'allocation-distribution')}
            rows={rows}
            isLoading={allocationDistributionStore.isLoading}
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
