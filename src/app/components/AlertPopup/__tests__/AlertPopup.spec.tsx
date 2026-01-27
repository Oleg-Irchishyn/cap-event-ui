import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import AlertPopup from '../AlertPopup';
import { DragNDropError } from '@/app/new/attachments/types';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('AlertPopup', () => {
  const mockHandleAlertClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('does not render when isAlertOpen is false', () => {
    renderWithTheme(
      <AlertPopup isAlertOpen={false} status="error" handleAlertClose={mockHandleAlertClose} />,
    );

    expect(screen.queryByText('Error!')).not.toBeInTheDocument();
  });

  it('displays correct status text for error and success', () => {
    const { rerender } = renderWithTheme(
      <AlertPopup isAlertOpen={true} status="error" handleAlertClose={mockHandleAlertClose} />,
    );

    expect(screen.getByText('Error!')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <AlertPopup isAlertOpen={true} status="success" handleAlertClose={mockHandleAlertClose} />
      </ThemeProvider>,
    );

    expect(screen.getByText('Success')).toBeInTheDocument();
  });

  it('renders error message and details when errors are provided', () => {
    const errors: DragNDropError[] = [
      {
        message: 'Test error message',
        details: 'Error details here',
        files: [
          {
            fileName: 'test-file.pdf',
            fileSize: 5 * 1024 * 1024,
          },
        ],
      },
    ];

    renderWithTheme(
      <AlertPopup
        isAlertOpen={true}
        status="error"
        errors={errors}
        handleAlertClose={mockHandleAlertClose}
      />,
    );

    expect(screen.getByText('Test error message')).toBeInTheDocument();
    expect(screen.getByText('Error details here')).toBeInTheDocument();
    expect(screen.getByText('test-file.pdf')).toBeInTheDocument();
    expect(screen.getByText(/5\.00 MB/)).toBeInTheDocument();
  });

  it('renders file name with formatted file size when fileSize is provided', () => {
    const errors: DragNDropError[] = [
      {
        message: 'Test error',
        files: [
          {
            fileName: 'document.pdf',
            fileSize: 3 * 1024 * 1024,
          },
          {
            fileName: 'file-without-size.pdf',
          },
        ],
      },
    ];

    renderWithTheme(
      <AlertPopup
        isAlertOpen={true}
        status="error"
        errors={errors}
        handleAlertClose={mockHandleAlertClose}
      />,
    );

    expect(screen.getByText('document.pdf')).toBeInTheDocument();
    expect(screen.getByText(/3\.00 MB/)).toBeInTheDocument();
    expect(screen.getByText('file-without-size.pdf')).toBeInTheDocument();
  });

  it('calls handleAlertClose when close button is clicked', () => {
    const { container } = renderWithTheme(
      <AlertPopup isAlertOpen={true} status="error" handleAlertClose={mockHandleAlertClose} />,
    );

    const closeButton = container.querySelector('button');
    fireEvent.click(closeButton!);

    expect(mockHandleAlertClose).toHaveBeenCalledTimes(1);
  });
});
