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
import { Attachment, AttachmentType } from './types';
import { MAX_ATTACHMENTS_NUMBER } from '@/const/attachments';

interface FileListProps {
  areaId: AttachmentType;
  handleRemoveFile: (name: string) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  updatedFileList: (fileList: Attachment[]) => void;
}

const FileList: FC<FileListProps> = ({
  areaId,
  handleDragEnd,
  updatedFileList,
  handleRemoveFile,
}) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  const totalFilesCount = [...capEventSettingsStore.attachments.values()].reduce(
    (sum, items) => sum + items.length,
    0,
  );

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <FileListStyled>
        <SortableContext
          items={
            capEventSettingsStore.attachments
              .get(areaId)
              ?.map((attachment) => attachment.file.name) || []
          }
          strategy={rectSortingStrategy}
        >
          {capEventSettingsStore.attachments.get(areaId)?.map((attachment, i) => (
            <SortableItem
              id={attachment.file.name}
              key={`${attachment.file.name}-${i}`}
              fileNumber={i + 1}
              fileName={attachment.file.name}
              removeFile={handleRemoveFile}
            />
          ))}
        </SortableContext>
        {totalFilesCount < MAX_ATTACHMENTS_NUMBER && (
          <AddFilesButton areaId={areaId} updatedFileList={updatedFileList} />
        )}
      </FileListStyled>
    </DndContext>
  );
};

export default FileList;
