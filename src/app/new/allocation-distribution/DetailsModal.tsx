import { renderAsync } from 'docx-preview';
import { FC, useEffect, useRef } from 'react';

import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { theme } from '@/ui/globalStyles';

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
  <svg width="10" height="10" viewBox="0 0 10 10" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M5.88372 5.00008L9.81672 1.06701C10.0611 0.822643 10.0611 
      0.42765 9.81672 0.183278C9.57236 -0.0610928 9.17737 -0.0610928
      8.933 0.183278L5 4.11634L1.067 0.183278C0.822631 -0.0610928 0.427643 
      -0.0610928 0.183276 0.183278C-0.0610919 0.42765 -0.0610919 
      0.822643 0.183276 1.06701L4.11628 5.00008L0.183276 
      8.93314C-0.0610919 9.17751 -0.0610919 9.57251 0.183276 
      9.81688C0.305147 9.93875 0.465142 10 0.625137 10C0.785132 
      10 0.945127 9.93875 1.067 9.81688L5 5.88381L8.933 9.81688C9.05487 
      9.93875 9.21487 10 9.37486 10C9.53486 10 9.69485 9.93875 9.81672 
      9.81688C10.0611 9.57251 10.0611 9.17751 9.81672 8.93314L5.88372 5.00008Z"
      fill={theme.colors.textSecondary}
    />
  </svg>
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
    renderAsync(noticePreviewDoc, docxContainerRef.current, undefined, {
      className: 'docx-preview',
      inWrapper: true,
      ignoreWidth: false,
      ignoreHeight: true,
      useBase64URL: false,
      breakPages: false,
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
