import { Dispatch, FC, SetStateAction, ChangeEvent } from 'react';
import { AddFilesButtonText, BrowseLabel, VisuallyHiddenInput } from './styles';
import { allowedFormats } from '@/const/allowedFileFormats';

interface AddFilesButtonProps {
  attachmentFiles: File[];
  setAttachmentFiles: Dispatch<SetStateAction<File[]>>;
}

const AddFilesButton: FC<AddFilesButtonProps> = ({ attachmentFiles, setAttachmentFiles }) => (
  <span>
    <AddFilesButtonText>Drop file(s) here or</AddFilesButtonText>
    <BrowseLabel>
      Browse
      <VisuallyHiddenInput
        multiple
        type="file"
        accept={Array.from(allowedFormats)
          .map((format) => `.${format}`)
          .join(', ')}
        onChange={(event: ChangeEvent<HTMLInputElement>) =>
          setAttachmentFiles([...attachmentFiles, ...(event.target.files as FileList)])
        }
      />
    </BrowseLabel>
  </span>
);

export default AddFilesButton;
