import { FC, ChangeEvent } from 'react';
import { AddFilesButtonText, BrowseLabel, VisuallyHiddenInput } from './styles';
import { baseFormats, extendedFormats } from '@/const/allowedFileFormats';
import { capEventSettingsStore } from '@/stores';
import { Attachment, AttachmentType } from './types';

interface AddFilesButtonProps {
  areaId: AttachmentType;
  updatedFileList: (fileList: Attachment[]) => void;
}

const AddFilesButton: FC<AddFilesButtonProps> = ({ areaId, updatedFileList }) => {
  const allowedFormats = areaId === 'additionalSupportiveFiles' ? extendedFormats : baseFormats;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    const newFileList = [
      ...(capEventSettingsStore.attachments.get(areaId) as Attachment[]),
      ...Array.from(event.target.files as FileList).map((file) => ({
        file: file,
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
