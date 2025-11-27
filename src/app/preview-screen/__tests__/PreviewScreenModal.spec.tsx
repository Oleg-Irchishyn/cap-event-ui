import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import PreviewScreenModal from '@/app/preview-screen/PreviewScreenModal';
import { PreviewScreenRow } from '@/app/preview-screen/types';

jest.mock('docx-preview', () => ({
  renderAsync: jest.fn().mockResolvedValue(undefined),
}));

const { renderAsync } = jest.requireMock('docx-preview');

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

    expect(screen.getByTestId('title-preview-screen-modal')).toHaveTextContent('Notice Preview');
  });

  it('renders Notice preview container', () => {
    renderWithTheme();

    const container = screen.getByTestId('notice-preview-preview-screen-modal');
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

  it('shows loader when noticePreviewDoc is null', async () => {
    renderWithTheme(mockSelectedRow, mockCloseModal, null);

    expect(await screen.findByTestId('loader-preview-screen-modal')).toBeInTheDocument();
  });

  it('renders docx content container', () => {
    renderWithTheme();

    expect(screen.getByTestId('docx-preview-screen-modal')).toBeInTheDocument();
  });

  it('calls docx renderer and hides loader after render resolves', async () => {
    const doc = new Blob(['test'], {
      type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    });

    renderWithTheme(mockSelectedRow, mockCloseModal, doc);

    // Loader appears while rendering
    expect(await screen.findByTestId('loader-preview-screen-modal')).toBeInTheDocument();

    // Renderer is called with provided doc
    expect(renderAsync).toHaveBeenCalledTimes(1);
    expect(renderAsync).toHaveBeenCalledWith(
      doc,
      expect.any(HTMLElement),
      undefined,
      expect.objectContaining({ className: 'docx-preview' }),
    );

    // After render resolves, loader disappears
    await waitFor(() => {
      expect(screen.queryByTestId('loader-preview-screen-modal')).not.toBeInTheDocument();
    });
  });
});
