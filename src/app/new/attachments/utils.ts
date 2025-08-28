import { Dispatch, SetStateAction } from 'react';
import { allowedFormats } from '@/const/allowedFileFormats';
import { DragNDropError } from './types';

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const validateFiles = (
  initFileList: File[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
) => {
  const filteredBySize = checkFileSizes(initFileList, setErrors);
  const filteredByFormat = checkFileFormats(filteredBySize, setErrors);
  const filteredByNumber = checkFilesNumber(filteredByFormat, setErrors);
  const filteredByUniqueName = checkDuplications(filteredByNumber, setErrors);

  return filteredByUniqueName;
};

const checkFileSizes = (
  fileList: File[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
): File[] => {
  const bigFiles: { fileName: string; size: number }[] = [];
  const smallFiles: File[] = [];
  for (const file of fileList) {
    if (file.size > MAX_FILE_SIZE_BYTES) {
      bigFiles.push({
        fileName: file.name,
        size: file.size,
      });
      continue;
    }
    smallFiles.push(file);
  }
  if (bigFiles.length) {
    setErrors((prev) => [
      ...prev,
      {
        message: 'Maximum size limit per file: 5 MB',
        details: bigFiles
          .map((file) => `${file.fileName} - ${(file.size / (1024 * 1024)).toFixed(1)} MB`)
          .join('; '),
      },
    ]);
  }
  return smallFiles;
};

const checkFileFormats = (
  fileList: File[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
): File[] => {
  const disallowedFiles: File[] = [];
  const allowedFiles: File[] = [];
  for (const file of fileList) {
    const ext = file.name.split('.').pop();
    if (ext && !allowedFormats.has(ext)) {
      disallowedFiles.push(file);
      continue;
    }
    allowedFiles.push(file);
  }
  if (disallowedFiles.length) {
    setErrors((prev) => [
      ...prev,
      {
        message: 'Unsupported format(s)',
        details: disallowedFiles.map((file) => file.name).join('; '),
      },
    ]);
  }
  return allowedFiles;
};

const checkFilesNumber = (
  fileList: File[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
): File[] => {
  if (fileList.length > 20) {
    setErrors((prev) => [
      ...prev,
      {
        message: 'Maximum upload limit: 20 files.',
        details: `The following files were not uploaded: ${fileList
          .slice(20)
          .map((file) => file.name)
          .join('; ')}`,
      },
    ]);
    return fileList.slice(0, 20);
  }
  return fileList;
};

const checkDuplications = (
  fileList: File[],
  setErrors: Dispatch<SetStateAction<DragNDropError[]>>,
): File[] => {
  const seenFiles = new Set<string>();
  const duplications = new Set<string>();
  const uniqueFiles: File[] = [];

  for (const file of fileList) {
    if (seenFiles.has(file.name)) {
      duplications.add(file.name);
    } else {
      seenFiles.add(file.name);
      uniqueFiles.push(file);
    }
  }

  if (duplications.size) {
    setErrors((prev) => [
      ...prev,
      {
        message: 'Not unique file name(s)',
        details: `${Array.from(duplications).join(', ')}`,
      },
    ]);
  }

  return uniqueFiles;
};
