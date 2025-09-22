import { HTMLAttributes, Ref, useEffect, useRef, useState } from 'react';
import {
  DragIcon,
  FileListItem,
  FileName,
  FileNameWrapper,
  FileNumber,
  IconButton,
  ItemCheckbox,
  TrashIcon,
} from './styles';
import { capEventSettingsStore } from '@/stores';

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  checked: boolean;
  fileNumber: number;
  withOpacity?: boolean;
  isDragging?: boolean;
  removeFile: (name: string) => void;
  fileName: string;
  ref?: Ref<HTMLDivElement>;
};

const Item = ({
  id,
  checked,
  withOpacity,
  isDragging,
  style,
  fileNumber,
  removeFile,
  fileName,
  ref,
  ...props
}: ItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [isNameOverflowing, setIsNameOverflowing] = useState(false);

  const spanRef = useRef<HTMLSpanElement>(null);

  const filesWithCheckbox = ['pdf', 'docx'];
  const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
  const fileExtension = fileName.split('.').at(-1);

  const handleCheckboxClick = () => {
    capEventSettingsStore.toggleAttachmentCheckbox(id);
  };

  useEffect(() => {
    if (spanRef.current) {
      setIsNameOverflowing(spanRef.current.scrollWidth > spanRef.current.clientWidth);
    }
  }, [fileNameWithoutExtension]);

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
      <DragIcon draggable={false} data-hovered={hovered} {...props} />
      {fileExtension && filesWithCheckbox.includes(fileExtension) && (
        <ItemCheckbox
          style={{
            width: '16px',
            height: '16px',
          }}
          checked={checked}
          onChange={handleCheckboxClick}
          title={checked ? 'Uncheck for deleting from Notices' : 'Check for adding to Notices'}
        />
      )}
      <FileNumber>{fileNumber}</FileNumber>
      <FileNameWrapper>
        <FileName
          {...props}
          ref={spanRef}
          title={isNameOverflowing ? fileNameWithoutExtension : undefined}
        >
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
