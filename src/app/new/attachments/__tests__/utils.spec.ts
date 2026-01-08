import {
  ADDENDUMS_ATTACHMENT_TYPE,
  ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  COVER_PAGES_ATTACHMENT_TYPE,
  MAX_ATTACHMENTS_NUMBER,
} from '@/const/attachments';
import { capEventSettingsStore } from '@/stores';
import { baseFormats, extendedFormats } from '@/const/allowedFileFormats';
import { validateFiles } from '../utils';
import { Attachment, AttachmentType } from '../types';

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    attachments: new Map<AttachmentType, Attachment[]>([
      [COVER_PAGES_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
    ]),
  },
}));

jest.mock('@/const/allowedFileFormats', () => ({
  baseFormats: new Set(['pdf']),
  extendedFormats: new Set(['pdf', 'docx']),
}));

const createFile = (name: string, size = 1024) =>
  new File(['x'.repeat(size)], name, { type: 'application/pdf' });

const createAttachment = (name: string, size?: number) => ({
  file: createFile(name, size),
});

const mockSetErrors = () => jest.fn();

describe('validateFiles – file size', () => {
  it('filters out files larger than 5MB and reports error', () => {
    const setErrors = mockSetErrors();

    const bigFile = createAttachment('big.pdf', 6 * 1024 * 1024);
    const smallFile = createAttachment('small.pdf');

    const result = validateFiles(
      [bigFile, smallFile],
      setErrors,
      COVER_PAGES_ATTACHMENT_TYPE as AttachmentType,
    );

    expect(result).toHaveLength(1);
    expect(result[0].file.name).toBe('small.pdf');

    expect(setErrors).toHaveBeenCalledWith(expect.any(Function));
  });
});

describe('validateFiles – file format', () => {
  it('rejects unsupported formats for base attachments', () => {
    const setErrors = mockSetErrors();

    const badFile = {
      file: new File(['x'], 'image.png'),
    };

    const result = validateFiles(
      [badFile as Attachment],
      setErrors,
      COVER_PAGES_ATTACHMENT_TYPE as AttachmentType,
    );

    expect(result).toHaveLength(0);
    expect(setErrors).toHaveBeenCalled();
  });

  it('allows extended formats for additional supportive files', () => {
    const setErrors = mockSetErrors();

    const docxFile = {
      file: new File(['x'], 'doc.docx'),
    };

    const result = validateFiles(
      [docxFile as Attachment],
      setErrors,
      ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE as AttachmentType,
    );

    expect(result).toHaveLength(1);
    expect(result[0].file.name).toBe('doc.docx');
  });
});

describe('validateFiles – duplicate names', () => {
  it('filters out duplicate file names across areas', () => {
    const setErrors = mockSetErrors();

    capEventSettingsStore.attachments.set(COVER_PAGES_ATTACHMENT_TYPE, [
      createAttachment('duplicate.pdf'),
    ]);

    const result = validateFiles(
      [createAttachment('duplicate.pdf'), createAttachment('unique.pdf')],
      setErrors,
      ADDENDUMS_ATTACHMENT_TYPE as AttachmentType,
    );

    expect(result).toHaveLength(1);
    expect(result[0].file.name).toBe('unique.pdf');
    expect(setErrors).toHaveBeenCalled();
  });
});

describe('validateFiles – max attachments number', () => {
  it('limits total number of attachments and reports overflow', () => {
    const setErrors = mockSetErrors();

    capEventSettingsStore.attachments.set(
      COVER_PAGES_ATTACHMENT_TYPE,
      Array.from({ length: MAX_ATTACHMENTS_NUMBER - 1 }, (_, i) =>
        createAttachment(`existing-${i}.pdf`),
      ) as Attachment[],
    );

    const newFiles = [createAttachment('new1.pdf'), createAttachment('new2.pdf')];

    const result = validateFiles(newFiles, setErrors, ADDENDUMS_ATTACHMENT_TYPE as AttachmentType);

    expect(result.length).toBe(1);
    expect(setErrors).toHaveBeenCalled();
  });
});
