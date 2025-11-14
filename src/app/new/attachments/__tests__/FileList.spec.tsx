import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import FileList from '@/app/new/attachments/FileList';
import { capEventSettingsStore } from '@/stores';
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
    attachments: [],
  },
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('FileList', () => {
  beforeEach(() => {
    type MockStore = { attachments: Array<{ file: { name: string }; checked: boolean }> };
    (capEventSettingsStore as unknown as MockStore).attachments = [];
  });

  it('renders SortableItem for each attachment', () => {
    type MockStore = { attachments: Array<{ file: { name: string }; checked: boolean }> };
    (capEventSettingsStore as unknown as MockStore).attachments = [
      { file: { name: 'a.pdf' }, checked: true },
      { file: { name: 'b.pdf' }, checked: false },
    ];

    renderWithTheme(
      <FileList
        checkedFilesNumber={1}
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
    type MockStore = { attachments: Array<{ file: { name: string }; checked: boolean }> };
    (capEventSettingsStore as unknown as MockStore).attachments = new Array(5)
      .fill(null)
      .map((_, i) => ({ file: { name: `f${i}.pdf` }, checked: false }));

    renderWithTheme(
      <FileList
        checkedFilesNumber={0}
        handleDragEnd={jest.fn()}
        handleRemoveFile={jest.fn()}
        updatedFileList={jest.fn()}
      />,
    );

    expect(screen.getByTestId('add-files-button')).toBeInTheDocument();
  });

  it('hides AddFilesButton when attachments reach 20', () => {
    type MockStore = { attachments: Array<{ file: { name: string }; checked: boolean }> };
    (capEventSettingsStore as unknown as MockStore).attachments = new Array(20)
      .fill(null)
      .map((_, i) => ({ file: { name: `f${i}.pdf` }, checked: false }));

    renderWithTheme(
      <FileList
        checkedFilesNumber={0}
        handleDragEnd={jest.fn()}
        handleRemoveFile={jest.fn()}
        updatedFileList={jest.fn()}
      />,
    );

    expect(screen.queryByTestId('add-files-button')).not.toBeInTheDocument();
  });
});
