import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import FileList from '@/app/new/attachments/FileList';
import { capEventSettingsStore } from '@/stores';
import { Attachment, AttachmentType } from '../types';
import {
  ADDENDUMS_ATTACHMENT_TYPE,
  ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  COVER_PAGES_ATTACHMENT_TYPE,
} from '@/const/attachments';

jest.mock('@/app/new/attachments/SortableItem', () => {
  const Component = ({ id }: { id: string }) => <div data-testid="sortable-item">{id}</div>;
  return { __esModule: true, default: Component };
});

jest.mock('@/app/new/attachments/AddFilesButton', () => ({
  __esModule: true,
  default: () => <button data-testid="add-files-button" />,
}));

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    attachments: new Map(),
  },
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('FileList', () => {
  beforeEach(() => {
    type MockStore = { attachments: Map<AttachmentType, Attachment[]> };
    (capEventSettingsStore as unknown as MockStore).attachments = new Map([
      [COVER_PAGES_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
    ]);
  });

  it('renders SortableItem for each attachment', () => {
    type MockStore = { attachments: Map<AttachmentType, Attachment[]> };
    (capEventSettingsStore as unknown as MockStore).attachments = new Map([
      [
        COVER_PAGES_ATTACHMENT_TYPE,
        [{ file: { name: 'a.pdf' } }, { file: { name: 'b.pdf' } }] as unknown as Attachment[],
      ],
      [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
    ]);

    renderWithTheme(
      <FileList
        areaId={COVER_PAGES_ATTACHMENT_TYPE}
        handleDragEnd={jest.fn()}
        handleRemoveFile={jest.fn()}
        updatedFileList={jest.fn()}
      />,
    );

    const items = screen.getAllByTestId('sortable-item');
    expect(items.length).toBe(2);
    expect(items[0]).toHaveTextContent('a.pdf');
    expect(items[1]).toHaveTextContent('b.pdf');
  });

  it('shows AddFilesButton when attachments less than 20', () => {
    type MockStore = { attachments: Map<AttachmentType, Attachment[]> };
    (capEventSettingsStore as unknown as MockStore).attachments = new Map([
      [
        COVER_PAGES_ATTACHMENT_TYPE,
        [{ name: 'a.pdf' }, { name: 'b.pdf' }] as unknown as Attachment[],
      ],
      [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
    ]);

    renderWithTheme(
      <FileList
        areaId={ADDENDUMS_ATTACHMENT_TYPE}
        handleDragEnd={jest.fn()}
        handleRemoveFile={jest.fn()}
        updatedFileList={jest.fn()}
      />,
    );

    expect(screen.getByTestId('add-files-button')).toBeInTheDocument();
  });

  it('hides AddFilesButton when attachments reach 20', () => {
    const list = new Array(20)
      .fill(null)
      .map((_, i) => ({ file: { name: `f${i}.pdf` }, checked: false }));
    type MockStore = { attachments: Map<AttachmentType, Attachment[]> };
    (capEventSettingsStore as unknown as MockStore).attachments = new Map([
      [COVER_PAGES_ATTACHMENT_TYPE, list as unknown as Attachment[]],
      [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
    ]);

    renderWithTheme(
      <FileList
        areaId={ADDENDUMS_ATTACHMENT_TYPE}
        handleDragEnd={jest.fn()}
        handleRemoveFile={jest.fn()}
        updatedFileList={jest.fn()}
      />,
    );

    expect(screen.queryByTestId('add-files-button')).not.toBeInTheDocument();
  });
});
