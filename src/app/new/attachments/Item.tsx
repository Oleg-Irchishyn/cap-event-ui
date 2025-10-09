import { HTMLAttributes, Ref, useRef, useState } from 'react';
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
import Tooltip from '@/app/components/Tooltip';

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
  const [showTooltip, setShowTooltip] = useState(false);

  const spanRef = useRef(null);

  const filesWithCheckbox = ['pdf', 'docx'];
  const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
  const fileExtension = fileName.split('.').at(-1);

  const handleCheckboxClick = () => {
    capEventSettingsStore.toggleAttachmentCheckbox(id);
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
          onMouseOver={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          {fileNameWithoutExtension}
        </FileName>
        <Tooltip
          tooltipMessage={fileNameWithoutExtension}
          showTooltip={showTooltip}
          targetRef={spanRef}
        />
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
