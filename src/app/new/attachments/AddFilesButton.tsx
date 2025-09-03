import { FC, ChangeEvent } from 'react';
import { AddFilesButtonText, BrowseLabel, VisuallyHiddenInput } from './styles';
import { allowedFormats } from '@/const/allowedFileFormats';
import { capEventSettingsStore } from '@/stores';
import { Attachment } from './types';

interface AddFilesButtonProps {
  updatedFileList: (fileList: Attachment[]) => void;
}

const AddFilesButton: FC<AddFilesButtonProps> = ({ updatedFileList }) => {
  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFileList = [
      ...capEventSettingsStore.attachments,
      ...Array.from(event.target.files as FileList).map((file) => ({
        file: file,
        checked: false,
      })),
    ];
    updatedFileList(newFileList);
  };

  return (
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
          onChange={handleChange}
        />
      </BrowseLabel>
    </span>
  );
};

export default AddFilesButton;
