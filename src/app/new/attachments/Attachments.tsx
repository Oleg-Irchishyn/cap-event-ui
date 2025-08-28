'use client';

import React, { useState, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { observer } from 'mobx-react-lite';
import { capEventSettingsStore } from '@/stores';
import EmptyFileArea from './EmptyFileArea';
import FileList from './FileList';
import AlertPopup from '@/app/components/AlertPopup/AlertPopup';
import { DragNDropError } from './types';
import { Title, Container } from '../styles';
import {
  AttachmentsCounter,
  AttachmentsHeader,
  AttachmentsHeaderGroup,
  AttachmentsHint,
  DropAreaContainer,
} from './styles';
import { validateFiles } from './utils';

const Attachments: React.FC = () => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [attachmentFiles, setAttachmentFiles] = useState<File[]>([]);
  const [errors, setErrors] = useState<DragNDropError[]>([]);
  const [checkedFilesNumber, setCheckedFilesNumber] = useState(0);

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over?.id) {
      setAttachmentFiles((items) => {
        const oldIndex = items.findIndex((item) => item.name === active.id);
        const newIndex = items.findIndex((item) => item.name === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setErrors([]);
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    const newFileList = [...attachmentFiles, ...files];

    const validatedFileList = validateFiles(newFileList, setErrors);

    setAttachmentFiles(validatedFileList);
    capEventSettingsStore.setAttachments(validatedFileList);
  };

  const handleRemoveFile = (name: string) => {
    const updatedFileList = attachmentFiles?.filter((file) => file.name !== name);
    setAttachmentFiles(updatedFileList);
  };

  const handleAlertClose = () => {
    setErrors([]);
  };

  return (
    <Container>
      <AttachmentsHeader>
        <AttachmentsHeaderGroup>
          <Title>Attachment(s)</Title>
          <AttachmentsHint>
            Select file(s) that have to be added to the Notices (only .DOCX and .PDF formats)
          </AttachmentsHint>
        </AttachmentsHeaderGroup>
        <AttachmentsHeaderGroup>
          <AttachmentsCounter>{`Used ${attachmentFiles.length} out of 20 attachments, ${checkedFilesNumber} added to Notice`}</AttachmentsCounter>
        </AttachmentsHeaderGroup>
      </AttachmentsHeader>

      <DropAreaContainer
        onDrop={handleDrop}
        data-is-drag-over={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-files-count={!!attachmentFiles.length}
      >
        {attachmentFiles.length ? (
          <FileList
            handleDragEnd={handleDragEnd}
            attachmentFiles={attachmentFiles}
            handleRemoveFile={handleRemoveFile}
            setAttachmentFiles={setAttachmentFiles}
            checkedFilesNumber={checkedFilesNumber}
            setCheckedFilesNumber={setCheckedFilesNumber}
          />
        ) : (
          <EmptyFileArea
            attachmentFiles={attachmentFiles}
            setAttachmentFiles={setAttachmentFiles}
          />
        )}

        <AlertPopup
          status="error"
          errors={errors}
          isAlertOpen={!!errors.length}
          handleAlertClose={handleAlertClose}
        />
      </DropAreaContainer>
    </Container>
  );
};

export default observer(Attachments);
