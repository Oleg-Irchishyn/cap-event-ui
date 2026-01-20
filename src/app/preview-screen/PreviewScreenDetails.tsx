'use client';

import { observer } from 'mobx-react-lite';

import BackgroundContainer from '@/app/components/BackgroundContainer';
import PreviewScreenModal from '@/app/preview-screen/PreviewScreenModal';
import PreviewScreenTable from '@/app/preview-screen/PreviewScreenTable';
import { Title, Wrapper } from '@/app/new/styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import PreviewSubTotalTable from '@/app/preview-screen/PreviewSubTotalTable';
import { usePreviewScreenDetails } from '@/hooks/usePreviewScreenDetails';

const PreviewScreenDetails = () => {
  const {
    rows,
    subTotalRows,
    isLoading,
    lineItems,
    columnDefs,
    topGridColumnDefs,
    subTotalColumnDefs,
    onRowClicked,
    selectedRow,
    noticePreviewDoc,
    isLoadingPreview,
    closeModal,
  } = usePreviewScreenDetails();

  return (
    <>
      <BackgroundContainer testId={prepareDataTestId('background', 'preview-screen')}>
        <Wrapper>
          <Title>Preview Screen</Title>

          <PreviewScreenTable
            testId={prepareDataTestId('table', 'preview-screen')}
            rows={rows}
            lineItems={lineItems}
            columnDefs={columnDefs}
            topGridColumnDefs={topGridColumnDefs}
            isLoading={isLoading}
            onRowClicked={onRowClicked}
          />
          <PreviewSubTotalTable
            rows={subTotalRows}
            columnDefs={subTotalColumnDefs}
            testId={prepareDataTestId('sub-total-table', 'preview-screen')}
            isLoading={isLoading}
          />
        </Wrapper>
      </BackgroundContainer>
      {selectedRow && (
        <PreviewScreenModal
          noticePreviewDoc={noticePreviewDoc}
          closeModal={closeModal}
          selectedRow={selectedRow}
          isLoading={isLoadingPreview}
        />
      )}
    </>
  );
};
export default observer(PreviewScreenDetails);
