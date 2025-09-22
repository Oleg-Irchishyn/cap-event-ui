'use client';

import React, { useState, useCallback } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { observer } from 'mobx-react-lite';
import { capEventSettingsStore } from '@/stores';
import EmptyFileArea from './EmptyFileArea';
import FileList from './FileList';
import AlertPopup from '@/app/components/AlertPopup/AlertPopup';
import { Attachment, DragNDropError } from './types';
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
  const [errors, setErrors] = useState<DragNDropError[]>([]);

  const checkedFilesNumber = capEventSettingsStore.attachments.filter(
    (file) => file.checked,
  ).length;

  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over?.id) {
      const currentFileList = capEventSettingsStore.attachments;
      const oldIndex = currentFileList.findIndex((item) => item.file.name === active.id);
      const newIndex = currentFileList.findIndex((item) => item.file.name === over.id);

      capEventSettingsStore.setAttachments(arrayMove(currentFileList, oldIndex, newIndex));
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const updatedFileList = (fileList: Attachment[]) => {
    const validatedFileList = validateFiles(fileList, setErrors);
    capEventSettingsStore.setAttachments(validatedFileList);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    const newFileList = [
      ...capEventSettingsStore.attachments,
      ...Array.from(files).map((file) => ({ file: file, checked: false })),
    ];

    updatedFileList(newFileList);
  };

  const handleRemoveFile = (name: string) => {
    const updatedFileList = capEventSettingsStore.attachments.filter(
      (attachment) => attachment.file.name !== name,
    );
    capEventSettingsStore.setAttachments(updatedFileList);
  };

  const handleAlertClose = () => {
    setErrors([]);
  };

  return (
    <Container data-testid="attachments">
      <AttachmentsHeader>
        <AttachmentsHeaderGroup>
          <Title>Attachment(s)</Title>
          {capEventSettingsStore.attachments.length ? (
            <AttachmentsHint>
              Select file(s) that have to be added to the Notices (only .DOCX and .PDF formats)
            </AttachmentsHint>
          ) : (
            ''
          )}
        </AttachmentsHeaderGroup>
        <AttachmentsHeaderGroup>
          {capEventSettingsStore.attachments.length ? (
            <AttachmentsCounter>{`Used ${capEventSettingsStore.attachments.length} of 20 attachments, ${checkedFilesNumber} added to Notices`}</AttachmentsCounter>
          ) : (
            ''
          )}
        </AttachmentsHeaderGroup>
      </AttachmentsHeader>

      <DropAreaContainer
        onDrop={handleDrop}
        data-is-drag-over={isDragOver}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        data-files-count={!!capEventSettingsStore.attachments.length}
      >
        {capEventSettingsStore.attachments.length ? (
          <FileList
            handleDragEnd={handleDragEnd}
            updatedFileList={updatedFileList}
            handleRemoveFile={handleRemoveFile}
            checkedFilesNumber={checkedFilesNumber}
          />
        ) : (
          <EmptyFileArea updatedFileList={updatedFileList} />
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
