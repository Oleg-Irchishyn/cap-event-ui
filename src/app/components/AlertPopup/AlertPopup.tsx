import { DragNDropError } from '@/app/new/attachments/types';
import {
  AlertContainer,
  AlertHeader,
  AlertMessage,
  AlertName,
  CloseButton,
  ErrorIcon,
  ErrorSection,
  FileName,
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
  const renderFileName = (file: { fileName: string; fileSize?: number }, i: number) => {
    if (file.fileSize) {
      return (
        <span key={i}>
          <FileName>{file.fileName}</FileName>
          {`- ${(file.fileSize / (1024 * 1024)).toFixed(2)} MB`}
        </span>
      );
    }
    return <FileName key={i}>{file.fileName}</FileName>;
  };

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
            errors.length &&
            errors.map((error, i) => (
              <ErrorSection key={i}>
                <AlertMessage>{error.message}</AlertMessage>
                <AlertMessage>
                  {`${error.details || ''}`}{' '}
                  {error.files &&
                    error.files.flatMap((file, index, arr) => [
                      renderFileName(file, index),
                      index < arr.length - 1 ? '; ' : null,
                    ])}
                </AlertMessage>
              </ErrorSection>
            ))}
        </AlertContainer>
      )}
    </>
  );
};

export default AlertPopup;
