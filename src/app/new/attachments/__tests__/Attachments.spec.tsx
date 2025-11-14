import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import Attachments from '@/app/new/attachments/Attachments';
import { capEventSettingsStore } from '@/stores';

jest.mock('@/app/components/AlertPopup/AlertPopup', () => ({
  __esModule: true,
  default: ({ isAlertOpen }: { isAlertOpen: boolean }) =>
    isAlertOpen ? <div data-testid="attachments-alert" /> : null,
}));

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    attachments: [],
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
      attachments: Array<{ file: { name: string }; checked: boolean }>;
      attachmentErrors: Array<{ message: string }>;
    };
    const store = capEventSettingsStore as unknown as MockStore;
    store.attachments = [];
    store.attachmentErrors = [];
  });

  it('renders EmptyFileArea when no attachments', () => {
    renderWithTheme(<Attachments />);
    expect(screen.getByText(/Max 20 files; Up to 5MB per file/i)).toBeInTheDocument();
  });

  it('renders FileList header and counter when attachments exist', () => {
    type MockStore = { attachments: Array<{ file: { name: string }; checked: boolean }> };
    (capEventSettingsStore as unknown as MockStore).attachments = [
      { file: { name: 'a.pdf' }, checked: true },
      { file: { name: 'b.pdf' }, checked: false },
    ];

    renderWithTheme(<Attachments />);

    expect(
      screen.getByText(/Select file\(s\) that have to be added to the Notices/i),
    ).toBeInTheDocument();
    expect(screen.getByText(/Used 2 of 20 attachments, 1 added to Notices/i)).toBeInTheDocument();
  });

  it('shows alert when there are attachment errors', () => {
    type MockStore = { attachmentErrors: Array<{ message: string }> };
    (capEventSettingsStore as unknown as MockStore).attachmentErrors = [{ message: 'error' }];
    renderWithTheme(<Attachments />);
    expect(screen.getByTestId('attachments-alert')).toBeInTheDocument();
  });
});
