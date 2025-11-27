import { FC, useEffect, useRef, useState } from 'react';
import { renderAsync } from 'docx-preview';
import Image from 'next/image';

import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import {
  DocxContainer,
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
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const docxContentRef = useRef<HTMLDivElement | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!docxContentRef.current) return;
    if (!noticePreviewDoc) {
      setIsLoading(true);
      return;
    }
    setIsLoading(true);
    void renderAsync(noticePreviewDoc, docxContentRef.current, undefined, {
      className: 'docx-preview',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: true,
      useBase64URL: true,
      breakPages: true,
      renderHeaders: true,
      renderFooters: true,
      // rely on document-provided page breaks; do not override
    })
      .catch(() => {})
      .finally(() => {
        setIsLoading(false);
      });
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
          <DocxContainer data-testid={prepareDataTestId('notice-preview', testId)}>
            {isLoading && (
              <LoaderWrapper data-testid={prepareDataTestId('loader', testId)}>
                <PreviewLoader />
              </LoaderWrapper>
            )}
            <div ref={docxContentRef} data-testid={prepareDataTestId('docx', testId)} />
          </DocxContainer>
        </ModalContent>
      </ModalContainer>
    </ModalWrapper>
  );
};

export default PreviewScreenModal;
