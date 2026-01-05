import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import Attachments from '@/app/new/attachments/Attachments';
import { capEventSettingsStore } from '@/stores';
import { Attachment, AttachmentType } from '../types';
import {
  ADDENDUMS_ATTACHMENT_TYPE,
  ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  COVER_PAGES_ATTACHMENT_TYPE,
} from '@/const/attachments';

jest.mock('@/app/components/AlertPopup/AlertPopup', () => ({
  __esModule: true,
  default: ({ isAlertOpen }: { isAlertOpen: boolean }) =>
    isAlertOpen ? <div data-testid="attachments-alert" /> : null,
}));

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    attachments: new Map(),
    setAttachments: jest.fn(),
    attachmentErrors: [],
    setAttachmentErrors: jest.fn(),
  },
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Attachments', () => {
  beforeEach(() => {
    type MockStore = {
      attachments: Map<AttachmentType, Attachment[]>;
      attachmentErrors: Array<{ message: string }>;
    };
    const store = capEventSettingsStore as unknown as MockStore;
    store.attachments = new Map([
      [COVER_PAGES_ATTACHMENT_TYPE, [] as unknown as Attachment[]],
      [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
    ]);
    store.attachmentErrors = [];
  });

  it('renders 3 areas', () => {
    renderWithTheme(<Attachments />);

    expect(screen.getByText('Cover Page(s)')).toBeInTheDocument();
    expect(screen.getByText('Addendum(s)')).toBeInTheDocument();
    expect(screen.getByText('Additional Supportive Doc(s)')).toBeInTheDocument();
  });

  it('renders FileList header and counter when attachments exist', () => {
    type MockStore = { attachments: Map<AttachmentType, Attachment[]> };
    (capEventSettingsStore as unknown as MockStore).attachments = new Map([
      [
        COVER_PAGES_ATTACHMENT_TYPE,
        [{ file: { name: 'a.pdf' } }, { file: { name: 'b.pdf' } }] as unknown as Attachment[],
      ],
      [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
    ]);

    renderWithTheme(<Attachments />);

    expect(screen.getByText('Cover Page(s)')).toBeInTheDocument();
    expect(screen.getByText(/Used 2 of 20 attachments/i)).toBeInTheDocument();
  });

  it('shows alert when there are attachment errors', () => {
    type MockStore = { attachmentErrors: Array<{ message: string }> };
    (capEventSettingsStore as unknown as MockStore).attachmentErrors = [{ message: 'error' }];
    renderWithTheme(<Attachments />);
    expect(screen.getByTestId('attachments-alert')).toBeInTheDocument();
  });
});
