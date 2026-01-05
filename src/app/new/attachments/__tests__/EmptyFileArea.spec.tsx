import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import EmptyFileArea from '@/app/new/attachments/EmptyFileArea';
import { COVER_PAGES_ATTACHMENT_TYPE } from '@/const/attachments';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('EmptyFileArea', () => {
  it('renders hint text about limits', () => {
    renderWithTheme(
      <EmptyFileArea areaId="additionalSupportiveFiles" updatedFileList={jest.fn()} />,
    );
    expect(screen.getByText('Drop file(s) here or')).toBeInTheDocument();
  });

  it('renders AddFilesButton content (Browse)', () => {
    renderWithTheme(
      <EmptyFileArea areaId={COVER_PAGES_ATTACHMENT_TYPE} updatedFileList={jest.fn()} />,
    );
    expect(screen.getByText(/Browse/i)).toBeInTheDocument();
  });

  it('shows download arrow icon container', () => {
    renderWithTheme(<EmptyFileArea areaId="addendums" updatedFileList={jest.fn()} />);
    expect(screen.getByAltText('download-icon')).toBeInTheDocument();
  });
});
