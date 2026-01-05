import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DropArea from '@/app/new/attachments/DropArea';
import { capEventSettingsStore } from '@/stores';
import type { Attachment, AttachmentType } from '../types';
import { DragEndEvent } from '@dnd-kit/core';
import {
  ADDENDUMS_ATTACHMENT_TYPE,
  ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  COVER_PAGES_ATTACHMENT_TYPE,
  MAX_ATTACHMENTS_NUMBER,
} from '@/const/attachments';

jest.mock('@/app/new/attachments/EmptyFileArea', () => ({
  __esModule: true,
  default: () => <div data-testid="empty-file-area" />,
}));

jest.mock('@/app/new/attachments/FileList', () => ({
  __esModule: true,
  default: () => <div data-testid="file-list" />,
}));

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    attachments: new Map(),
  },
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('DropArea', () => {
  const handleDrop = (_e: React.DragEvent<HTMLDivElement>, _id: AttachmentType) => {};
  const handleDragEnd = (_e: DragEndEvent, _id: AttachmentType) => {};
  const handleDragOver = (_e: React.DragEvent<HTMLDivElement>, _id: AttachmentType) => {};
  const handleDragLeave = (_id: AttachmentType) => {};
  const updatedFileList = (_files: Attachment[], _id: AttachmentType) => {};
  const handleRemoveFile = (_name: string, _id: AttachmentType) => {};

  beforeEach(() => {
    (capEventSettingsStore as { attachments: Map<AttachmentType, Attachment[]> }).attachments =
      new Map([
        [COVER_PAGES_ATTACHMENT_TYPE, [] as unknown as Attachment[]],
        [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
        [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
      ]);
  });

  it('renders title, hint and EmptyFileArea when no files exist', () => {
    renderWithTheme(
      <DropArea
        areaId={COVER_PAGES_ATTACHMENT_TYPE}
        isDragOver={false}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        updatedFileList={updatedFileList}
        handleRemoveFile={handleRemoveFile}
      />,
    );

    expect(screen.getByText('Cover Page(s)')).toBeInTheDocument();
    expect(screen.getByText('Attachment(s) to be added before Notice')).toBeInTheDocument();
    expect(screen.getByTestId('empty-file-area')).toBeInTheDocument();
    expect(screen.queryByTestId('file-list')).not.toBeInTheDocument();
  });

  it('renders FileList when files exist for the area', () => {
    (capEventSettingsStore as { attachments: Map<AttachmentType, Attachment[]> }).attachments =
      new Map([
        [COVER_PAGES_ATTACHMENT_TYPE, [{ file: { name: 'a.pdf' } }] as unknown as Attachment[]],
        [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
        [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
      ]);

    renderWithTheme(
      <DropArea
        areaId={COVER_PAGES_ATTACHMENT_TYPE}
        isDragOver={false}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        updatedFileList={updatedFileList}
        handleRemoveFile={handleRemoveFile}
      />,
    );

    expect(screen.getByTestId('file-list')).toBeInTheDocument();
    expect(screen.queryByTestId('empty-file-area')).not.toBeInTheDocument();
  });

  it('renders an overlay cover when sibling area reaches max attachments', () => {
    const many = new Array(MAX_ATTACHMENTS_NUMBER).fill(null).map((_, i) => ({
      file: { name: `f${i}.pdf` },
    })) as unknown as Attachment[];

    (capEventSettingsStore as { attachments: Map<AttachmentType, Attachment[]> }).attachments =
      new Map([
        [COVER_PAGES_ATTACHMENT_TYPE, [] as unknown as Attachment[]],
        [ADDENDUMS_ATTACHMENT_TYPE, many],
        [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
      ]);

    const { baseElement } = renderWithTheme(
      <DropArea
        areaId={COVER_PAGES_ATTACHMENT_TYPE}
        isDragOver={false}
        handleDrop={handleDrop}
        handleDragEnd={handleDragEnd}
        handleDragOver={handleDragOver}
        handleDragLeave={handleDragLeave}
        updatedFileList={updatedFileList}
        handleRemoveFile={handleRemoveFile}
      />,
    );

    const container = baseElement.querySelector('[data-files-count="false"]') as HTMLElement;
    expect(container).toBeInTheDocument();
    expect(container.childElementCount).toBeGreaterThanOrEqual(2);
  });
});
