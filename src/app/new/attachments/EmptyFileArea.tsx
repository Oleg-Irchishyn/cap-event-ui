import AddFilesButton from './AddFilesButton';
import { DownloadArrowIcon, DropdownHint, EmptyFileAreaContainer } from './styles';

interface EmptyFileAreaProps {
  attachmentFiles: File[];
  setAttachmentFiles: React.Dispatch<React.SetStateAction<File[]>>;
}

const EmptyFileArea: React.FC<EmptyFileAreaProps> = ({ attachmentFiles, setAttachmentFiles }) => (
  <div>
    <EmptyFileAreaContainer>
      <DownloadArrowIcon />
      <AddFilesButton attachmentFiles={attachmentFiles} setAttachmentFiles={setAttachmentFiles} />
    </EmptyFileAreaContainer>
    <DropdownHint>Max 20 files; Up to 5MB per file</DropdownHint>
  </div>
);

export default EmptyFileArea;
