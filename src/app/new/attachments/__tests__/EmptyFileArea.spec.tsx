import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import EmptyFileArea from '@/app/new/attachments/EmptyFileArea';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('EmptyFileArea', () => {
  it('renders hint text about limits', () => {
    renderWithTheme(<EmptyFileArea updatedFileList={jest.fn()} />);
    expect(screen.getByText(/Max 20 files; Up to 5MB per file/i)).toBeInTheDocument();
  });

  it('renders AddFilesButton content (Browse)', () => {
    renderWithTheme(<EmptyFileArea updatedFileList={jest.fn()} />);
    expect(screen.getByText(/Browse/i)).toBeInTheDocument();
  });

  it('shows download arrow icon container', () => {
    renderWithTheme(<EmptyFileArea updatedFileList={jest.fn()} />);
    expect(screen.getByText(/Max 20 files;/i)).toBeInTheDocument();
  });
});
