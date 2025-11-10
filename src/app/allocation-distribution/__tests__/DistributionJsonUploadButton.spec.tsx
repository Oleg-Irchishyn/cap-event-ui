import { render, screen } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DistributionJsonUploadButton from '@/app/allocation-distribution/DistributionJsonUploadButton';

const renderWithTheme = (children: React.ReactNode) => {
  render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

describe('DistributionJsonUploadButton', () => {
  it('renders Upload label when not loading', () => {
    renderWithTheme(
      <DistributionJsonUploadButton
        isLoading={false}
        payload='{ "a": 1 }'
        handleUpload={async () => {}}
        testId="upload"
      />,
    );

    const btn = screen.getByTestId('button-upload') as HTMLButtonElement;
    expect(btn.textContent || '').toContain('Upload');
    expect(btn.disabled).toBe(false);
  });

  it('renders Uploading… and disables when loading', () => {
    renderWithTheme(
      <DistributionJsonUploadButton
        isLoading={true}
        payload='{ "a": 1 }'
        handleUpload={async () => {}}
        testId="upload"
      />,
    );

    const btn = screen.getByTestId('button-upload') as HTMLButtonElement;
    expect(btn.textContent || '').toContain('Uploading…');
    expect(btn.disabled).toBe(true);
  });

  it('disables button when payload is empty or whitespace', () => {
    renderWithTheme(
      <DistributionJsonUploadButton
        isLoading={false}
        payload="   "
        handleUpload={async () => {}}
        testId="upload"
      />,
    );

    const btn = screen.getByTestId('button-upload') as HTMLButtonElement;
    expect(btn.disabled).toBe(true);
  });
});
