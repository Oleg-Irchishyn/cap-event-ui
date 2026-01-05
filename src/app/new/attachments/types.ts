export interface DragNDropError {
  message: string;
  details?: string;
  files?: {
    fileName: string;
    fileSize?: number;
  }[];
}

export interface Attachment {
  file: File;
}

export type AttachmentType = 'coverPages' | 'addendums' | 'additionalSupportiveFiles';
