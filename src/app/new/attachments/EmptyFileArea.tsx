import AddFilesButton from './AddFilesButton';
import { DownloadArrowIcon, DropdownHint, EmptyFileAreaContainer } from './styles';
import { Attachment } from './types';

interface EmptyFileAreaProps {
  updatedFileList: (fileList: Attachment[]) => void;
}

const EmptyFileArea: React.FC<EmptyFileAreaProps> = ({ updatedFileList }) => (
  <div>
    <EmptyFileAreaContainer>
      <DownloadArrowIcon />
      <AddFilesButton updatedFileList={updatedFileList} />
    </EmptyFileAreaContainer>
    <DropdownHint>Max 20 files; Up to 5MB per file</DropdownHint>
  </div>
);

export default EmptyFileArea;
