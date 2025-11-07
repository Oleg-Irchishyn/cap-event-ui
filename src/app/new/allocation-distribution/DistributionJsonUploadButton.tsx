import Button, { BUTTON_THEMES } from '@/app/components/Button';
import { ButtonContainer } from '@/app/new/styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import { DistributionJsonUploadButtonProps } from './types';

const DistributionJsonUploadButton = ({
  isLoading,
  payload,
  handleUpload,
  testId = 'distribution-json-upload-button',
}: DistributionJsonUploadButtonProps) => {
  return (
    <ButtonContainer>
      <Button
        testId={prepareDataTestId('button', testId)}
        width="auto"
        onClick={handleUpload}
        buttonTheme={BUTTON_THEMES.primary}
        disabled={isLoading || payload.trim().length === 0}
      >
        {isLoading ? 'Uploading…' : 'Upload'}
      </Button>
    </ButtonContainer>
  );
};

export default DistributionJsonUploadButton;
