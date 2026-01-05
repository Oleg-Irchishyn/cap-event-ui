import AddFilesButton from './AddFilesButton';
import { DownloadArrowIcon, DropdownHint, EmptyFileAreaContainer } from './styles';
import { Attachment, AttachmentType } from './types';

interface EmptyFileAreaProps {
  areaId: AttachmentType;
  updatedFileList: (fileList: Attachment[]) => void;
}

const EmptyFileArea: React.FC<EmptyFileAreaProps> = ({ areaId, updatedFileList }) => (
  <div>
    <EmptyFileAreaContainer>
      <DownloadArrowIcon alt="download-icon" />
      <AddFilesButton areaId={areaId} updatedFileList={updatedFileList} />
    </EmptyFileAreaContainer>
    <DropdownHint>
      {areaId === 'additionalSupportiveFiles'
        ? ''
        : 'Select file(s) that have to be added to the Notices (only .DOCX and .PDF formats)'}
    </DropdownHint>
  </div>
);

export default EmptyFileArea;
