import { FC } from 'react';
import Button, { BUTTON_THEMES } from '@/app/components/Button';
import {
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalWrapper,
} from './styles';
import { Title } from '../styles';
import AllocationPreviewTable from './AllocationPreviewTable';
import { capEventSettingsStore } from '@/stores';
import { AllocationPreviewTableData } from './types';

interface EntityPreviewModalProps {
  isOpen: boolean;
  title: string;
  data: AllocationPreviewTableData[];
}

const AllocationPreviewModal: FC<EntityPreviewModalProps> = ({ isOpen, title, data }) => {
  if (!isOpen) return null;

  const handleCancel = () => {
    capEventSettingsStore.setAllocationPreviewOpen(false);
  };

  return (
    <ModalWrapper>
      <ModalContainer>
        <ModalHeader>
          <Title>{`Preview - ${title}`}</Title>
          <ModalButtonContainer>
            <Button
              testId="confirmation-modal-cancel"
              width="auto"
              onClick={handleCancel}
              buttonTheme={BUTTON_THEMES.secondary}
            >
              Cancel
            </Button>
          </ModalButtonContainer>
        </ModalHeader>
        <ModalContent>
          <AllocationPreviewTable rows={data} />
        </ModalContent>
      </ModalContainer>
    </ModalWrapper>
  );
};

export default AllocationPreviewModal;
