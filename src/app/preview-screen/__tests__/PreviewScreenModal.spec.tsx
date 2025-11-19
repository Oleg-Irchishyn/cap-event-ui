import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import PreviewScreenModal from '@/app/preview-screen/PreviewScreenModal';
import { PreviewScreenRow } from '@/app/preview-screen/types';

jest.mock('docx-preview', () => ({
  renderAsync: jest.fn().mockResolvedValue(undefined),
}));

const mockCloseModal = jest.fn();

const mockSelectedRow: PreviewScreenRow = {
  id: 'test-id',
  investor: 'Test Investor',
  entityId: 'entity-123',
  entityName: 'Test Entity',
  description: 'Test Description',
  allocatedAmount: 1000,
  isAggregated: true,
  ceBoxFileId: 'file-123',
};

const renderWithTheme = (
  selectedRow: PreviewScreenRow | null = mockSelectedRow,
  closeModal = mockCloseModal,
  noticePreviewDoc: Blob | null = null,
) =>
  render(
    <ThemeProvider theme={theme}>
      <PreviewScreenModal
        selectedRow={selectedRow}
        closeModal={closeModal}
        noticePreviewDoc={noticePreviewDoc}
      />
    </ThemeProvider>,
  );

describe('PreviewScreenModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders modal with correct title', () => {
    renderWithTheme();

    expect(screen.getByTestId('title-details-modal')).toHaveTextContent('Notice Preview');
  });

  it('renders Notice preview container', () => {
    renderWithTheme();

    const container = screen.getByTestId('notice-preview-details-modal');
    expect(container).toBeInTheDocument();
  });

  it('renders close button', () => {
    renderWithTheme();

    const closeButton = screen.getByRole('button');
    expect(closeButton).toBeInTheDocument();
  });

  it('calls closeModal when close button is clicked', () => {
    renderWithTheme();

    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);

    expect(mockCloseModal).toHaveBeenCalledTimes(1);
  });

  it('handles null noticePreviewDoc gracefully by showing loading text', async () => {
    renderWithTheme(mockSelectedRow, mockCloseModal, null);

    expect(await screen.findByText('Loading Notice preview...')).toBeInTheDocument();
  });
});
