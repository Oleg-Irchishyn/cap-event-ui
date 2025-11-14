import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import Item from '@/app/new/attachments/Item';
import { capEventSettingsStore } from '@/stores';

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    toggleAttachmentCheckbox: jest.fn(),
  },
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('Item', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('shows checkbox only for pdf/docx files', () => {
    const { rerender } = renderWithTheme(
      <Item
        id="1"
        checked={false}
        fileNumber={1}
        fileName="document.pdf"
        removeFile={jest.fn()}
        isDragging={false}
      />,
    );
    expect(screen.getByRole('checkbox')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <Item
          id="2"
          checked={false}
          fileNumber={1}
          fileName="image.png"
          removeFile={jest.fn()}
          isDragging={false}
        />
      </ThemeProvider>,
    );
    expect(screen.queryByRole('checkbox')).not.toBeInTheDocument();
  });

  it('calls removeFile when delete button is clicked', () => {
    const removeFile = jest.fn();
    renderWithTheme(
      <Item
        id="3"
        checked={false}
        fileNumber={1}
        fileName="doc.pdf"
        removeFile={removeFile}
        isDragging={false}
      />,
    );

    const deleteBtn = screen.getByLabelText(/delete/i);
    fireEvent.click(deleteBtn);
    expect(removeFile).toHaveBeenCalledWith('3');
  });

  it('toggles checkbox via store when clicked', () => {
    renderWithTheme(
      <Item
        id="4"
        checked={false}
        fileNumber={1}
        fileName="notice.docx"
        removeFile={jest.fn()}
        isDragging={false}
      />,
    );

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(capEventSettingsStore.toggleAttachmentCheckbox).toHaveBeenCalledWith('4');
  });
});
