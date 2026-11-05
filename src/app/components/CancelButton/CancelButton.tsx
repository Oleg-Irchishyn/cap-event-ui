import { FC } from 'react';
import { ActionButton } from '@oleg-irchishyn/irchishyn-ui-library';

import { CancelButtonWrapper } from './styles';

interface CancelButtonProps {
  isFormClean: boolean;
  onOpenConfirmationModal: () => void;
}

const CancelButton: FC<CancelButtonProps> = ({ isFormClean, onOpenConfirmationModal }) => (
  <CancelButtonWrapper>
    <ActionButton
      variant="secondary"
      label="Cancel"
      disabled={isFormClean}
      onClick={onOpenConfirmationModal}
      tooltip={isFormClean ? undefined : 'Discard unsaved changes'}
    />
  </CancelButtonWrapper>
);

export default CancelButton;
