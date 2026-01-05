import { Dispatch, SetStateAction } from 'react';
import { baseFormats, extendedFormats } from '@/const/allowedFileFormats';
import { Attachment, DragNDropError } from './types';
import { MAX_ATTACHMENTS_NUMBER } from '@/const/attachments';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const validateFiles = (
  initFileList: Attachment[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
  isAdditionalDocs: boolean,
) => {
  setErrors([]);
  const filteredBySize = checkFileSizes(initFileList, setErrors);
  const filteredByFormat = checkFileFormats(filteredBySize, setErrors, isAdditionalDocs);
  const filteredByUniqueName = checkDuplications(filteredByFormat, setErrors);
  const filteredByNumber = checkFilesNumber(filteredByUniqueName, setErrors);

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
): Attachment[] => {
  if (attachments.length > MAX_ATTACHMENTS_NUMBER) {
    setErrors((prev) => [
      ...prev,
      {
        message: `Maximum upload limit: ${MAX_ATTACHMENTS_NUMBER} files.`,
        details: 'The following files were not uploaded: ',
        files: attachments.slice(MAX_ATTACHMENTS_NUMBER).map((attachment) => ({
          fileName: attachment.file.name,
        })),
      },
    ]);
    return attachments.slice(0, MAX_ATTACHMENTS_NUMBER);
  }
  return attachments;
};

const checkDuplications = (
  attachments: Attachment[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
): Attachment[] => {
  const seenFiles = new Set<string>();
  const duplications = new Set<string>();
  const uniqueFiles: Attachment[] = [];

  for (const attachment of attachments) {
    if (seenFiles.has(attachment.file.name)) {
      duplications.add(attachment.file.name);
    } else {
      seenFiles.add(attachment.file.name);
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
