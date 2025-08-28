import { DragNDropError } from '@/app/new/attachments/types';
import {
  AlertContainer,
  AlertHeader,
  AlertMessage,
  AlertName,
  CloseButton,
  ErrorIcon,
  ErrorSection,
} from './styles';

type AlertStatus = 'error' | 'success';

interface AlertPopupProps {
  isAlertOpen: boolean;
  status: AlertStatus;
  errors?: DragNDropError[];
  handleAlertClose: () => void;
}

const alertStatuses = {
  error: 'Error!',
  success: 'Success',
};

const AlertPopup: React.FC<AlertPopupProps> = ({
  status,
  errors,
  isAlertOpen,
  handleAlertClose,
}) => {
  return (
    <>
      {isAlertOpen && (
        <AlertContainer data-status={status}>
          <AlertHeader>
            <ErrorIcon />
            <AlertName>{alertStatuses[status]}</AlertName>
            <CloseButton onClick={handleAlertClose} />
          </AlertHeader>
          {errors &&
            errors.map((error, i) => (
              <ErrorSection key={i}>
                <AlertMessage>{error.message}</AlertMessage>
                {error.details && <AlertMessage>{error.details}</AlertMessage>}
              </ErrorSection>
            ))}
        </AlertContainer>
      )}
    </>
  );
};

export default AlertPopup;
