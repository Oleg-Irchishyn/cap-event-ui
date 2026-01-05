import { FC, useEffect, useRef, useState } from 'react';
import Image from 'next/image';

import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import {
  PreviewContainer,
  LoaderWrapper,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalWrapper,
  PreviewLoader,
} from './styles';
import { PreviewScreenRow } from './types';

interface PreviewScreenModalProps {
  noticePreviewDoc?: Blob | null;
  closeModal: () => void;
  selectedRow: PreviewScreenRow | null;
  isLoading: boolean;
  testId?: string;
}

const CloseIcon = () => (
  <Image src="icons/cross.svg" width={10} height={10} alt="modal-close-icon" />
);

const PreviewScreenModal: FC<PreviewScreenModalProps> = ({
  noticePreviewDoc,
  closeModal,
  selectedRow,
  testId = 'preview-screen-modal',
  isLoading,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!noticePreviewDoc) {
      setPdfUrl(null);
      return;
    }

    const pdfBlob = new Blob([noticePreviewDoc], { type: 'application/pdf' });
    const url = URL.createObjectURL(pdfBlob);
    setPdfUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [noticePreviewDoc]);

  useExternalElementClick(modalRef, () => {
    if (selectedRow !== null) {
      closeModal();
    }
  }, [selectedRow !== null]);

  return (
    <ModalWrapper>
      <ModalContainer ref={modalRef}>
        <ModalHeader>
          <ModalTitle data-testid={prepareDataTestId('title', testId)}>Notice Preview</ModalTitle>
          <ModalCloseButton onClick={closeModal}>
            <CloseIcon />
          </ModalCloseButton>
        </ModalHeader>
        <ModalContent>
          <PreviewContainer data-testid={prepareDataTestId('notice-preview', testId)}>
            {isLoading && (
              <LoaderWrapper data-testid={prepareDataTestId('loader', testId)}>
                <PreviewLoader />
              </LoaderWrapper>
            )}
            {pdfUrl && (
              <iframe
                src={pdfUrl}
                style={{
                  width: '100%',
                  height: '100%',
                  border: 'none',
                  display: 'block',
                }}
                title="PDF Preview"
                data-testid={prepareDataTestId('pdf', testId)}
              >
                <ModalTitle>Your browser does not support PDF preview</ModalTitle>
              </iframe>
            )}
          </PreviewContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWrapper>
  );
};

export default PreviewScreenModal;
