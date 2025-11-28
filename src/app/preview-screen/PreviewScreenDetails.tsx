'use client';

import { useEffect, useState } from 'react';
import { RowClickedEvent } from 'ag-grid-community';
import { observer } from 'mobx-react-lite';

import { previewScreenStore } from '@/stores/PreviewScreenStore';
import { useToast } from '@/providers/ToastProvider';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import PreviewScreenModal from '@/app/preview-screen/PreviewScreenModal';
import PreviewScreenTable from '@/app/preview-screen/PreviewScreenTable';
import { Title, Wrapper } from '@/app/new/styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import { PreviewScreenRow, SubTotalTableRow } from './types';
import PreviewSubTotalTable from '@/app/preview-screen/PreviewSubTotalTable';

const PreviewScreenDetails = () => {
  const toast = useToast();
  const [rows, setRows] = useState<PreviewScreenRow[]>([]);
  const [selectedRow, setSelectedRow] = useState<PreviewScreenRow | null>(null);
  const [noticePreviewDoc, setNoticePreviewDoc] = useState<Blob | null>(null);
  const [subTotalRows, setSubTotalRows] = useState<SubTotalTableRow[]>([]);

  useEffect(() => {
    const process = async () => {
      setRows([]);
      const newRows = await previewScreenStore.processPayload(toast);
      setRows(newRows);
      const temp = newRows.reduce((acc, row) => {
        if (!row.isAggregated) return acc;
        const existing = acc.find((item) => item.entityName === row.entityName);
        if (existing) {
          existing.allocatedAmount += row.allocatedAmount ?? 0;
          existing.commitment = (existing.commitment ?? 0) + (row.commitment ?? 0);
        } else {
          acc.push({
            id: row.id,
            entityName: row.entityName,
            allocatedAmount: row.allocatedAmount ?? 0,
            commitment: row.commitment ?? 0,
          } as SubTotalTableRow);
        }
        return acc;
      }, [] as SubTotalTableRow[]);
      setSubTotalRows(temp);
    };
    process();
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
          <PreviewSubTotalTable
            rows={subTotalRows}
            testId={prepareDataTestId('sub-total-table', 'preview-screen')}
            isLoading={previewScreenStore.isLoading}
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
