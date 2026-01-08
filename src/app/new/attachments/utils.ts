import { Dispatch, SetStateAction } from 'react';
import { baseFormats, extendedFormats } from '@/const/allowedFileFormats';
import { Attachment, AttachmentType, DragNDropError } from './types';
import {
  ADDENDUMS_ATTACHMENT_TYPE,
  ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  COVER_PAGES_ATTACHMENT_TYPE,
  MAX_ATTACHMENTS_NUMBER,
} from '@/const/attachments';
import { capEventSettingsStore } from '@/stores';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const validateFiles = (
  initFileList: Attachment[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
  areaId: AttachmentType,
) => {
  setErrors([]);
  const filteredBySize = checkFileSizes(initFileList, setErrors);
  const filteredByFormat = checkFileFormats(
    filteredBySize,
    setErrors,
    areaId === ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  );
  const filteredByUniqueName = checkDuplications(filteredByFormat, setErrors, areaId);
  const filteredByNumber = checkFilesNumber(filteredByUniqueName, setErrors, areaId);

  return filteredByNumber;
};

const checkFileSizes = (
  attachments: Attachment[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
): Attachment[] => {
  const bigFiles: { fileName: string; size: number }[] = [];
  const smallFiles: Attachment[] = [];
  for (const attachment of attachments) {
    if (attachment.file.size > MAX_FILE_SIZE_BYTES) {
      bigFiles.push({
        fileName: attachment.file.name,
        size: attachment.file.size,
      });
      continue;
    }
    smallFiles.push(attachment);
  }
  if (bigFiles.length) {
    setErrors((prev) => [
      ...prev,
      {
        message: 'Maximum size limit per file: 5 MB.',
        files: bigFiles.map((file) => ({
          fileName: file.fileName,
          fileSize: file.size,
        })),
      },
    ]);
  }
  return smallFiles;
};

const checkFileFormats = (
  attachments: Attachment[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
  isAdditionalDocs: boolean,
): Attachment[] => {
  const disallowedFiles: File[] = [];
  const allowedFiles: Attachment[] = [];
  for (const attachment of attachments) {
    const ext = attachment.file.name.split('.').pop()?.toLowerCase();
    const allowedFormats = isAdditionalDocs ? extendedFormats : baseFormats;

    if (ext && !allowedFormats.has(ext)) {
      disallowedFiles.push(attachment.file);
      continue;
    }
    allowedFiles.push(attachment);
  }
  if (disallowedFiles.length) {
    setErrors((prev) => [
      ...prev,
      {
        message: 'Unsupported format(s).',
        files: disallowedFiles.map((file) => ({
          fileName: file.name,
        })),
      },
    ]);
  }
  return allowedFiles;
};

const checkFilesNumber = (
  attachments: Attachment[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
  areaId: AttachmentType,
): Attachment[] => {
  const currentNumberOfAttachments = Array.from(capEventSettingsStore.attachments.values()).reduce(
    (sum, arr) => sum + arr.length,
    0,
  );

  if (currentNumberOfAttachments + attachments.length > MAX_ATTACHMENTS_NUMBER) {
    const extraFilesNumber =
      currentNumberOfAttachments + attachments.length - MAX_ATTACHMENTS_NUMBER;
    setErrors((prev) => [
      ...prev,
      {
        message: `Maximum upload limit: ${MAX_ATTACHMENTS_NUMBER} files.`,
        details: 'The following files were not uploaded: ',
        files: attachments.slice(attachments.length - extraFilesNumber).map((attachment) => ({
          fileName: attachment.file.name,
        })),
      },
    ]);

    return [
      ...(capEventSettingsStore.attachments.get(areaId) as Attachment[]),
      ...attachments.slice(0, attachments.length - extraFilesNumber),
    ];
  }
  return [...(capEventSettingsStore.attachments.get(areaId) as Attachment[]), ...attachments];
};

const checkDuplications = (
  attachments: Attachment[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
  areaId: AttachmentType,
): Attachment[] => {
  const duplications = new Set<string>();
  const uniqueFiles: Attachment[] = [];

  const coverPagesAttachments = new Set(
    capEventSettingsStore.attachments
      .get(COVER_PAGES_ATTACHMENT_TYPE)
      ?.map((attachment) => attachment.file.name),
  );
  const addendumsAttachments = new Set(
    capEventSettingsStore.attachments
      .get(ADDENDUMS_ATTACHMENT_TYPE)
      ?.map((attachment) => attachment.file.name),
  );
  const additionalFilesAttachments = new Set(
    capEventSettingsStore.attachments
      .get(ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE)
      ?.map((attachment) => attachment.file.name),
  );

  const existingFilesToCheck =
    areaId === ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE
      ? additionalFilesAttachments
      : new Set([...coverPagesAttachments, ...addendumsAttachments]);

  for (const attachment of attachments) {
    const fileName = attachment.file.name;

    if (existingFilesToCheck.has(fileName)) {
      duplications.add(fileName);
    } else {
      uniqueFiles.push(attachment);
    }
  }

  if (duplications.size) {
    setErrors((prev) => [
      ...prev,
      {
        message: 'Not unique file name(s).',
        files: Array.from(duplications).map((file) => ({
          fileName: file,
        })),
      },
    ]);
  }

  return uniqueFiles;
};
