'use client';

import React from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { capEventSettingsStore } from '@/stores';
import EmptyFileArea from './EmptyFileArea';
import FileList from './FileList';
import { Attachment, AttachmentType } from './types';
import {
  AttachmentsHeader,
  AttachmentsHint,
  Container,
  DropAreaContainer,
  DropAreaCover,
  DropAreaTitle,
} from './styles';
import {
  ADDENDUMS_ATTACHMENT_TYPE,
  ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  COVER_PAGES_ATTACHMENT_TYPE,
  MAX_ATTACHMENTS_NUMBER,
} from '@/const/attachments';

interface DropAreaProps {
  isDragOver: boolean;
  areaId: AttachmentType;
  handleDragLeave: (areaId: AttachmentType) => void;
  handleDragEnd: (event: DragEndEvent, areaId: AttachmentType) => void;
  handleDrop: (e: React.DragEvent<HTMLDivElement>, areaId: AttachmentType) => void;
  handleDragOver: (e: React.DragEvent<HTMLDivElement>, areaId: AttachmentType) => void;
  updatedFileList: (files: Attachment[], areaId: AttachmentType) => void;
  handleRemoveFile: (name: string, areaId: AttachmentType) => void;
}

const DropArea: React.FC<DropAreaProps> = ({
  areaId,
  isDragOver,
  handleDrop,
  handleDragEnd,
  handleDragOver,
  handleDragLeave,
  updatedFileList,
  handleRemoveFile,
}) => {
  const renderTitle = () => {
    if (areaId === ADDENDUMS_ATTACHMENT_TYPE) return 'Addendum(s)';
    if (areaId === COVER_PAGES_ATTACHMENT_TYPE) return 'Cover Page(s)';
    return 'Additional Supportive Doc(s)';
  };

  const renderDropAreaDescription = () => {
    if (areaId === ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE) return '';
    return `Attachment(s) to be added ${areaId === COVER_PAGES_ATTACHMENT_TYPE ? 'before' : 'after'} Notice`;
  };

  const renderCover = () => {
    if (
      areaId === COVER_PAGES_ATTACHMENT_TYPE &&
      capEventSettingsStore.attachments.get(ADDENDUMS_ATTACHMENT_TYPE)?.length ===
        MAX_ATTACHMENTS_NUMBER
    ) {
      return <DropAreaCover />;
    }

    if (
      areaId === ADDENDUMS_ATTACHMENT_TYPE &&
      capEventSettingsStore.attachments.get(COVER_PAGES_ATTACHMENT_TYPE)?.length ===
        MAX_ATTACHMENTS_NUMBER
    ) {
      return <DropAreaCover />;
    }
  };

  return (
    <Container data-testid="attachments">
      <AttachmentsHeader>
        <DropAreaTitle>{renderTitle()}</DropAreaTitle>
        <AttachmentsHint>{renderDropAreaDescription()}</AttachmentsHint>
      </AttachmentsHeader>

      <DropAreaContainer
        onDrop={(e) => handleDrop(e, areaId)}
        data-is-drag-over={isDragOver}
        onDragOver={(e) => handleDragOver(e, areaId)}
        onDragLeave={() => handleDragLeave(areaId)}
        data-files-count={!!capEventSettingsStore.attachments.get(areaId)?.length}
      >
        {capEventSettingsStore.attachments.get(areaId)?.length ? (
          <FileList
            areaId={areaId}
            handleDragEnd={(e) => handleDragEnd(e, areaId)}
            updatedFileList={(files) => updatedFileList(files, areaId)}
            handleRemoveFile={(name: string) => handleRemoveFile(name, areaId)}
          />
        ) : (
          <EmptyFileArea
            areaId={areaId}
            updatedFileList={(files) => updatedFileList(files, areaId)}
          />
        )}

        {renderCover()}
      </DropAreaContainer>
    </Container>
  );
};

export default DropArea;
