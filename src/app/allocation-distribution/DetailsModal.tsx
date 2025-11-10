import { FC, useEffect, useRef } from 'react';
import { renderAsync } from 'docx-preview';
import Image from 'next/image';

import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import {
  DocxContainer,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalWrapper,
} from './styles';
import { DistributionRow } from './types';

interface DetailsModalProps {
  noticePreviewDoc?: Blob | null;
  closeModal: () => void;
  selectedRow: DistributionRow | null;
  testId?: string;
}

const CloseIcon = () => (
  <Image src="icons/cross.svg" width={10} height={10} alt="modal-close-icon" />
);

const DetailsModal: FC<DetailsModalProps> = ({
  noticePreviewDoc,
  closeModal,
  selectedRow,
  testId = 'details-modal',
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const docxContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!noticePreviewDoc || !docxContainerRef.current) {
      if (!docxContainerRef.current) return;
    }

    docxContainerRef.current.innerHTML = 'Loading Notice preview...';
    void renderAsync(noticePreviewDoc, docxContainerRef.current, undefined, {
      className: 'docx-preview',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: true,
      useBase64URL: false,
      breakPages: false,
    }).catch(() => {});
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
          <DocxContainer
            ref={docxContainerRef}
            data-testid={prepareDataTestId('notice-preview', testId)}
          />
        </ModalContent>
      </ModalContainer>
    </ModalWrapper>
  );
};

export default DetailsModal;
