import { FC } from 'react';
import {
  closestCenter,
  DndContext,
  DragEndEvent,
  MouseSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { rectSortingStrategy, SortableContext } from '@dnd-kit/sortable';
import SortableItem from './SortableItem';
import AddFilesButton from './AddFilesButton';
import { FileListStyled } from './styles';
import { capEventSettingsStore } from '@/stores';
import { Attachment } from './types';

interface FileListProps {
  checkedFilesNumber: number;
  handleRemoveFile: (name: string) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  updatedFileList: (fileList: Attachment[]) => void;
}

const FileList: FC<FileListProps> = ({ handleDragEnd, handleRemoveFile, updatedFileList }) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <FileListStyled>
        <SortableContext
          items={capEventSettingsStore.attachments.map((attachment) => attachment.file.name)}
          strategy={rectSortingStrategy}
        >
          {capEventSettingsStore.attachments.map((attachment, i) => (
            <SortableItem
              id={attachment.file.name}
              key={`${attachment.file.name}-${i}`}
              checked={attachment.checked}
              fileNumber={i + 1}
              fileName={attachment.file.name}
              removeFile={handleRemoveFile}
            />
          ))}
        </SortableContext>
        {capEventSettingsStore.attachments.length < 20 && (
          <AddFilesButton updatedFileList={updatedFileList} />
        )}
      </FileListStyled>
    </DndContext>
  );
};

export default FileList;
