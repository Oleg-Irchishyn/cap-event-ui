import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DistributionJsonParseField from '@/app/allocation-distribution/DistributionJsonParseField';

const renderWithTheme = (children: React.ReactNode) => {
  render(<ThemeProvider theme={theme}>{children}</ThemeProvider>);
};

describe('DistributionJsonParseField', () => {
  it('renders label and textarea with placeholder', () => {
    renderWithTheme(
      <DistributionJsonParseField payload="" onSetPayload={() => {}} testId="parse" />,
    );

    expect(screen.getByText('Allocation Distribution JSON')).toBeTruthy();
    const textarea = screen.getByTestId('textarea-parse') as HTMLTextAreaElement;
    expect(textarea.placeholder).toBe('Paste JSON here');
  });

  it('shows counter with payload length', () => {
    renderWithTheme(
      <DistributionJsonParseField payload="abc" onSetPayload={() => {}} testId="parse" />,
    );

    expect(screen.getByText('3 of 20000')).toBeTruthy();
  });

  it('calls onSetPayload on user input', async () => {
    const onSetPayload = jest.fn();

    renderWithTheme(
      <DistributionJsonParseField payload="" onSetPayload={onSetPayload} testId="parse" />,
    );

    const textarea = screen.getByTestId('textarea-parse') as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: '{"x":2}' } });
    expect(onSetPayload).toHaveBeenCalled();
  });
});
