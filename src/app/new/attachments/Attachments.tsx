'use client';

import React, { useState, useCallback, Dispatch, SetStateAction, useRef } from 'react';
import { DragEndEvent } from '@dnd-kit/core';
import { arrayMove } from '@dnd-kit/sortable';
import { observer } from 'mobx-react-lite';
import { capEventSettingsStore } from '@/stores';
import { Attachment, AttachmentType, DragNDropError } from './types';
import { Title, Container } from '../styles';
import {
  AttachmentsCounter,
  AttachmentsHeader,
  AttachmentsHeaderGroup,
  DropAreaWrapper,
  HelpIcon,
  IconWrapper,
} from './styles';
import { validateFiles } from './utils';
import DropArea from './DropArea';
import DropAreaDivider from './DropAreaDivider';
import AlertPopup from '@/app/components/AlertPopup/AlertPopup';
import Tooltip from '@/app/components/Tooltip';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import {
  ADDENDUMS_ATTACHMENT_TYPE,
  ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  COVER_PAGES_ATTACHMENT_TYPE,
  MAX_ATTACHMENTS_NUMBER,
} from '@/const/attachments';

const Attachments: React.FC = () => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [dragOverByArea, setDragOverByArea] = useState({
    coverPages: false,
    addendums: false,
    additionalSupportiveFiles: false,
  });

  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Use errors from the store, provide a React-compatible setter wrapper
  const errors = capEventSettingsStore.attachmentErrors;
  const setErrors: Dispatch<SetStateAction<DragNDropError[]>> = useCallback((updater) => {
    if (typeof updater === 'function') {
      capEventSettingsStore.setAttachmentErrors(updater(capEventSettingsStore.attachmentErrors));
    } else {
      capEventSettingsStore.setAttachmentErrors(updater);
    }
  }, []);

  const handleDragEnd = useCallback((event: DragEndEvent, areaId: AttachmentType) => {
    const { active, over } = event;

    if (over && active.id !== over?.id) {
      const currentFileList = capEventSettingsStore.attachments.get(areaId) as Attachment[];
      const oldIndex = currentFileList.findIndex((item) => item.file.name === active.id);
      const newIndex = currentFileList.findIndex((item) => item.file.name === over.id);

      capEventSettingsStore.setAttachments(areaId, arrayMove(currentFileList, oldIndex, newIndex));
    }
  }, []);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>, areaId: AttachmentType) => {
    e.preventDefault();
    setDragOverByArea((prev) => ({
      ...prev,
      [areaId]: true,
    }));
  };

  const handleDragLeave = (areaId: AttachmentType) => {
    setDragOverByArea((prev) => ({
      ...prev,
      [areaId]: false,
    }));
  };

  const updatedFileList = (fileList: Attachment[], areaId: AttachmentType) => {
    const validatedFileList = validateFiles(
      fileList,
      setErrors,
      areaId === 'additionalSupportiveFiles',
    );
    capEventSettingsStore.setAttachments(areaId, validatedFileList);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, areaId: AttachmentType) => {
    e.preventDefault();
    setDragOverByArea((prev) => ({
      ...prev,
      [areaId]: false,
    }));
    const files = e.dataTransfer.files;
    const newFileList = [
      ...(capEventSettingsStore.attachments.get(areaId) as Attachment[]),
      ...Array.from(files).map((file) => ({ file: file, checked: false })),
    ];

    updatedFileList(newFileList, areaId);
  };

  const handleRemoveFile = (name: string, areaId: AttachmentType) => {
    const updatedFileList = capEventSettingsStore.attachments
      .get(areaId)
      ?.filter((attachment) => attachment.file.name !== name) as Attachment[];
    capEventSettingsStore.setAttachments(areaId, updatedFileList);
  };

  const handleAlertClose = () => {
    capEventSettingsStore.setAttachmentErrors([]);
  };

  const totalFilesCount = [...capEventSettingsStore.attachments.values()].reduce(
    (sum, items) => sum + items.length,
    0,
  );

  return (
    <Container data-testid="attachments">
      <AttachmentsHeader>
        <AttachmentsHeaderGroup>
          <Title>Attachment(s)</Title>
          <IconWrapper ref={tooltipRef}>
            <HelpIcon
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              data-testid="help-icon"
            />
          </IconWrapper>
          <Tooltip
            tooltipMessage={`Max ${MAX_ATTACHMENTS_NUMBER} files. Up to 5MB per file.\nSet an order for Cover Pages and Addendums by reordering the files`}
            showTooltip={showTooltip}
            targetRef={tooltipRef}
            testId={prepareDataTestId('attachments', 'tooltip')}
          />
        </AttachmentsHeaderGroup>
        <AttachmentsHeaderGroup>
          <AttachmentsCounter>{`Used ${totalFilesCount} of ${MAX_ATTACHMENTS_NUMBER} attachments`}</AttachmentsCounter>
        </AttachmentsHeaderGroup>
      </AttachmentsHeader>

      <DropAreaWrapper>
        <DropArea
          areaId={COVER_PAGES_ATTACHMENT_TYPE}
          isDragOver={dragOverByArea.coverPages}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          updatedFileList={updatedFileList}
          handleRemoveFile={handleRemoveFile}
        />

        <DropAreaDivider />

        <DropArea
          areaId={ADDENDUMS_ATTACHMENT_TYPE}
          isDragOver={dragOverByArea.addendums}
          handleDrop={handleDrop}
          handleDragEnd={handleDragEnd}
          handleDragOver={handleDragOver}
          handleDragLeave={handleDragLeave}
          updatedFileList={updatedFileList}
          handleRemoveFile={handleRemoveFile}
        />
      </DropAreaWrapper>

      <DropArea
        areaId={ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE}
        isDragOver={dragOverByArea.additionalSupportiveFiles}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        updatedFileList={updatedFileList}
        handleRemoveFile={handleRemoveFile}
      />

      <AlertPopup
        status="error"
        errors={errors}
        isAlertOpen={!!errors.length}
        handleAlertClose={handleAlertClose}
      />
    </Container>
  );
};

export default observer(Attachments);
