import { Dispatch, SetStateAction, FC } from 'react';
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

interface FileListProps {
  attachmentFiles: File[];
  checkedFilesNumber: number;
  handleRemoveFile: (name: string) => void;
  handleDragEnd: (event: DragEndEvent) => void;
  setAttachmentFiles: Dispatch<SetStateAction<File[]>>;
  setCheckedFilesNumber: Dispatch<SetStateAction<number>>;
}

const FileList: FC<FileListProps> = ({
  handleDragEnd,
  attachmentFiles,
  handleRemoveFile,
  setAttachmentFiles,
  checkedFilesNumber,
  setCheckedFilesNumber,
}) => {
  const sensors = useSensors(useSensor(MouseSensor), useSensor(TouchSensor));

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd} collisionDetection={closestCenter}>
      <FileListStyled>
        <SortableContext
          items={attachmentFiles.map((file) => file.name)}
          strategy={rectSortingStrategy}
        >
          {attachmentFiles.map((file, i) => (
            <SortableItem
              id={file.name}
              key={`${file.name}-${i}`}
              fileNumber={i + 1}
              fileName={file.name}
              removeFile={handleRemoveFile}
              checkedFilesNumber={checkedFilesNumber}
              setCheckedFilesNumber={setCheckedFilesNumber}
            />
          ))}
        </SortableContext>
        {attachmentFiles.length < 20 && (
          <AddFilesButton
            attachmentFiles={attachmentFiles}
            setAttachmentFiles={setAttachmentFiles}
          />
        )}
      </FileListStyled>
    </DndContext>
  );
};

export default FileList;
