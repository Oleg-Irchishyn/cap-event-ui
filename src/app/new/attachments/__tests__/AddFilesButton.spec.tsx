import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import AddFilesButton from '@/app/new/attachments/AddFilesButton';
import { capEventSettingsStore } from '@/stores';
import type { Attachment, AttachmentType } from '@/app/new/attachments/types';
import {
  ADDENDUMS_ATTACHMENT_TYPE,
  ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  COVER_PAGES_ATTACHMENT_TYPE,
} from '@/const/attachments';

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    attachments: new Map(),
  },
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AddFilesButton', () => {
  beforeEach(() => {
    (capEventSettingsStore as { attachments: Map<AttachmentType, Attachment[]> }).attachments =
      new Map([
        [COVER_PAGES_ATTACHMENT_TYPE, [] as unknown as Attachment[]],
        [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
        [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
      ]);
  });

  it('renders Browse with correct accept formats', () => {
    renderWithTheme(<AddFilesButton areaId="addendums" updatedFileList={jest.fn()} />);

    const fileInput = screen.getByLabelText(/Browse/i) as HTMLInputElement;

    expect(screen.getByText(/Browse/i)).toBeInTheDocument();
    expect(screen.getByText(/Drop file\(s\) here or/i)).toBeInTheDocument();
    expect(fileInput?.accept).toContain('.pdf');
    expect(fileInput?.accept).toContain('.docx');
  });

  it('calls updatedFileList with existing and newly selected files', () => {
    const updatedFileList = jest.fn();
    (capEventSettingsStore as { attachments: Map<AttachmentType, Attachment[]> }).attachments =
      new Map([
        [
          COVER_PAGES_ATTACHMENT_TYPE,
          [
            { file: new File(['a'], 'existing.pdf', { type: 'application/pdf' }) },
          ] as unknown as Attachment[],
        ],
        [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
        [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
      ]);

    renderWithTheme(
      <AddFilesButton areaId={COVER_PAGES_ATTACHMENT_TYPE} updatedFileList={updatedFileList} />,
    );

    const input = screen.getByLabelText(/Browse/i) as HTMLInputElement;
    const file1 = new File(['x'], 'new1.pdf', { type: 'application/pdf' });
    const file2 = new File(['y'], 'new2.docx', { type: 'application/vnd.openxmlformats' });

    const fileList = {
      0: file1,
      1: file2,
      length: 2,
      item: (index: number) => (index === 0 ? file1 : index === 1 ? file2 : null),
    } as unknown as FileList;
    Object.defineProperty(input, 'files', { value: fileList });

    fireEvent.change(input);

    expect(updatedFileList).toHaveBeenCalledTimes(1);
    const arg = updatedFileList.mock.calls[0][0] as Attachment[];
    expect(arg.length).toBe(3);
    expect(arg.some((a) => a.file.name === 'existing.pdf')).toBe(true);
    expect(arg.some((a) => a.file.name === 'new1.pdf')).toBe(true);
    expect(arg.some((a) => a.file.name === 'new2.docx')).toBe(true);
  });

  it('renders Browse label and helper text', () => {
    renderWithTheme(
      <AddFilesButton areaId={COVER_PAGES_ATTACHMENT_TYPE} updatedFileList={jest.fn()} />,
    );

    expect(screen.getByText(/Browse/i)).toBeInTheDocument();
    expect(screen.getByText(/Drop file\(s\) here or/i)).toBeInTheDocument();
  });
});
