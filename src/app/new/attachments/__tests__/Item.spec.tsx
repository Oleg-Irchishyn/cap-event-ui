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
});
