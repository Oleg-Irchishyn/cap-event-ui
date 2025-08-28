import { ChangeEvent, Dispatch, HTMLAttributes, Ref, SetStateAction, useState } from 'react';
import {
  CustomCheckbox,
  DragIcon,
  FileListItem,
  FileName,
  FileNameWrapper,
  FileNumber,
  IconButton,
  TrashIcon,
} from './styles';

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  fileNumber: number;
  withOpacity?: boolean;
  isDragging?: boolean;
  removeFile: (name: string) => void;
  fileName: string;
  ref?: Ref<HTMLDivElement>;
  checkedFilesNumber: number;
  setCheckedFilesNumber: Dispatch<SetStateAction<number>>;
};

const Item = ({
  id,
  withOpacity,
  isDragging,
  style,
  fileNumber,
  removeFile,
  fileName,
  ref,
  checkedFilesNumber,
  setCheckedFilesNumber,
  ...props
}: ItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [checked, setChecked] = useState(false);

  const filesWithCheckbox = ['pdf', 'docx'];
  const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
  const fileExtension = fileName.split('.').at(-1);

  const handleCheckboxClick = (e: ChangeEvent<HTMLInputElement>) => {
    setChecked(e.target.checked);
    if (e.target.checked) {
      setCheckedFilesNumber(checkedFilesNumber + 1);
      return;
    }
    setCheckedFilesNumber(checkedFilesNumber - 1);
    return;
  };

  return (
    <FileListItem
      ref={ref}
      style={{ ...style }}
      data-hovered={hovered}
      data-is-dragging={isDragging}
      data-with-opacity={withOpacity}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <DragIcon data-hovered={hovered} />
      {fileExtension && filesWithCheckbox.includes(fileExtension) && (
        <CustomCheckbox
          type="checkbox"
          onChange={handleCheckboxClick}
          title={checked ? 'Uncheck for deleting from Notices' : 'Check for adding to Notices'}
        />
      )}
      <FileNumber>{fileNumber}</FileNumber>
      <FileNameWrapper>
        <FileName {...props} title={fileNameWithoutExtension}>
          {fileNameWithoutExtension}
        </FileName>
        {'.' + fileExtension}
      </FileNameWrapper>

      <IconButton aria-label="delete" data-hovered={hovered} onClick={() => removeFile(id)}>
        <TrashIcon />
      </IconButton>
    </FileListItem>
  );
};

Item.displayName = 'Item';

export default Item;
