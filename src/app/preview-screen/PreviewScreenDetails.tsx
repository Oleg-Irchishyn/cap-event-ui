'use client';

import { useEffect, useState } from 'react';
import { RowClickedEvent } from 'ag-grid-community';
import { observer } from 'mobx-react-lite';

import { previewScreenStore } from '@/stores/PreviewScreenStore';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { useToast } from '@/providers/ToastProvider';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import PreviewScreenModal from '@/app/preview-screen/PreviewScreenModal';
import PreviewScreenTable from '@/app/preview-screen/PreviewScreenTable';
import { Title, Wrapper } from '@/app/new/styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import { PreviewScreenRow } from './types';

const PreviewScreenDetails = () => {
  const toast = useToast();
  const [rows, setRows] = useState<PreviewScreenRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<PreviewScreenRow | null>(null);
  const [noticePreviewDoc, setNoticePreviewDoc] = useState<Blob | null>(null);

  useEffect(() => {
    const process = async () => {
      setRows([]);
      const newRows = await previewScreenStore.processPayload(toast);
      setRows(newRows);
    };
    process();

    // Reset selections and dates when leaving the preview screen, till we don't have local data base
    return () => {
      capEventSettingsStore.resetAfterPreview();
      entityDatesStore.resetAllDates();
    };
  }, [toast]);

  const onRowClicked = async (e: RowClickedEvent) => {
    if (e.data?.isAggregated) {
      setSelectedRow(e.data);
      const blob = await previewScreenStore.fetchDoc(e.data, toast);
      setNoticePreviewDoc(blob ?? null);
    }
  };

  const closeModal = () => {
    setSelectedRow(null);
    setNoticePreviewDoc(null);
  };

  return (
    <>
      <BackgroundContainer testId={prepareDataTestId('background', 'preview-screen')}>
        <Wrapper>
          <Title>Preview Screen</Title>

          <PreviewScreenTable
            testId={prepareDataTestId('table', 'preview-screen')}
            rows={rows}
            isLoading={previewScreenStore.isLoading}
            onRowClicked={onRowClicked}
          />
        </Wrapper>
      </BackgroundContainer>
      {selectedRow && (
        <PreviewScreenModal
          noticePreviewDoc={noticePreviewDoc}
          closeModal={closeModal}
          selectedRow={selectedRow}
        />
      )}
    </>
  );
};
export default observer(PreviewScreenDetails);
