import { FC, useRef } from 'react';
import Image from 'next/image';
import Button, { BUTTON_THEMES } from '@/app/components/Button';
import { useExternalElementClick } from '@/hooks/useExternalElementClick';
import { ConfirmationModalProps } from './types';
import {
  ModalButtonContainer,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalDescription,
  ModalTitle,
  ModalHeader,
  ModalSubDescription,
  ModalWrapper,
} from './styles';

const CloseIcon = () => (
  <Image src="/cap-event/icons/cross.svg" width={10} height={10} alt="modal-close-icon" />
);

const ConfirmationModal: FC<ConfirmationModalProps> = ({
  title = '',
  isOpen = true,
  cancelText = 'Cancel',
  confirmText = 'Proceed',
  secondaryDescription = '',
  description,
  handleClose = () => {},
  handleProceed = () => {},
}) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useExternalElementClick(modalRef, () => {
    if (isOpen) {
      handleClose();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <ModalWrapper>
      <ModalContainer ref={modalRef}>
        <ModalHeader>
          <ModalTitle data-testid="confirmation-modal-title">{title}</ModalTitle>
          <ModalCloseButton onClick={handleClose}>
            <CloseIcon />
          </ModalCloseButton>
        </ModalHeader>

        <ModalContent>
          <ModalDescription data-testid="confirmation-modal-description">
            {description}
          </ModalDescription>
          <ModalSubDescription>{secondaryDescription}</ModalSubDescription>
        </ModalContent>

        <ModalButtonContainer>
          <Button
            testId="confirmation-modal-cancel"
            width="auto"
            onClick={handleClose}
            buttonTheme={BUTTON_THEMES.secondary}
          >
            {cancelText}
          </Button>
          <Button
            testId="confirmation-modal-proceed"
            width="auto"
            onClick={handleProceed}
            buttonTheme={BUTTON_THEMES.primary}
          >
            {confirmText}
          </Button>
        </ModalButtonContainer>
      </ModalContainer>
    </ModalWrapper>
  );
};

export default ConfirmationModal;
