import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DropAreaDivider from '@/app/new/attachments/DropAreaDivider';

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('DropAreaDivider', () => {
  it('renders without crashing', () => {
    const { baseElement } = renderWithTheme(<DropAreaDivider />);
    expect(baseElement).toBeInTheDocument();
  });

  it('renders both icons (PDF and DOCX)', () => {
    const { container } = renderWithTheme(<DropAreaDivider />);
    const root = container.firstChild as HTMLElement;
    const inner = root?.firstChild as HTMLElement;
    expect(inner).toBeInTheDocument();
    expect(inner.childElementCount).toBeGreaterThanOrEqual(2);
  });
});
