import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import PreviewScreenModal from '@/app/preview-screen/PreviewScreenModal';
import { PreviewScreenRow } from '@/app/preview-screen/types';

const mockCloseModal = jest.fn();

const mockCreateObjectURL = jest.fn();
const mockRevokeObjectURL = jest.fn();

global.URL.createObjectURL = mockCreateObjectURL;
global.URL.revokeObjectURL = mockRevokeObjectURL;

const createTestBlob = (data: BlobPart, type: string) => {
  return new Blob([data], { type: type });
};

const mockSelectedRow: PreviewScreenRow = {
  id: 'test-id',
  investor: 'Test Investor',
  entityId: 'entity-123',
  entityName: 'Test Entity',
  description: 'Test Description',
  allocatedAmount: 1000,
  isAggregated: true,
};

const renderWithTheme = (
  selectedRow: PreviewScreenRow | null = mockSelectedRow,
  closeModal = mockCloseModal,
  noticePreviewDoc: Blob | null = null,
  isLoading: boolean = false,
) =>
  render(
    <ThemeProvider theme={theme}>
      <PreviewScreenModal
        selectedRow={selectedRow}
        closeModal={closeModal}
        noticePreviewDoc={noticePreviewDoc}
        isLoading={isLoading}
      />
    </ThemeProvider>,
  );

describe('PreviewScreenModal', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockCreateObjectURL.mockReturnValue('blob:mock-url');
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
    renderWithTheme(mockSelectedRow, mockCloseModal, null, true);

    expect(await screen.findByTestId('loader-preview-screen-modal')).toBeInTheDocument();
  });

  it('renders pdf content container', async () => {
    const blob = createTestBlob('test-blob', 'application/pdf');
    renderWithTheme(mockSelectedRow, mockCloseModal, blob, false);

    expect(mockCreateObjectURL).toHaveBeenCalled();
    const iframe = screen.getByTestId('pdf-preview-screen-modal');
    expect(iframe).toBeInTheDocument();
  });
});
