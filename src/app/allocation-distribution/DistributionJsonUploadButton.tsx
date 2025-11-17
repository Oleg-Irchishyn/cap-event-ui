import Button, { BUTTON_THEMES } from '@/app/components/Button';

import { prepareDataTestId } from '@/utils/prepareDataTestId';

import { DistributionJsonUploadButtonProps } from './types';

const DistributionJsonUploadButton = ({
  isLoading,
  payload,
  handleUpload,
  testId = 'distribution-json-upload-button',
}: DistributionJsonUploadButtonProps) => {
  return (
    <Button
      testId={prepareDataTestId('button', testId)}
      width="auto"
      onClick={handleUpload}
      buttonTheme={BUTTON_THEMES.primary}
      disabled={isLoading || payload.trim().length === 0}
      style={{ marginLeft: 'auto' }}
    >
      {isLoading ? 'Uploading…' : 'Upload'}
    </Button>
  );
};

export default DistributionJsonUploadButton;
