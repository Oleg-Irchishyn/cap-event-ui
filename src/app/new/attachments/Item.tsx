import { HTMLAttributes, Ref, useRef, useState } from 'react';
import {
  DragIcon,
  FileListItem,
  FileName,
  FileNameWrapper,
  FileNumber,
  IconButton,
  TrashIcon,
} from './styles';
import Tooltip from '@/app/components/Tooltip';

export type ItemProps = HTMLAttributes<HTMLDivElement> & {
  id: string;
  fileNumber: number;
  withOpacity?: boolean;
  isDragging?: boolean;
  removeFile: (name: string) => void;
  fileName: string;
  ref?: Ref<HTMLDivElement>;
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
  ...props
}: ItemProps) => {
  const [hovered, setHovered] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const spanRef = useRef(null);

  const fileNameWithoutExtension = fileName.split('.').slice(0, -1).join('.');
  const fileExtension = fileName.split('.').at(-1);

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
