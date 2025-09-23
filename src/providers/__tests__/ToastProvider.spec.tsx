import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import ToastProvider, { useToast } from '@/providers/ToastProvider';

const renderWithProviders = (ui: React.ReactNode) =>
  render(
    <ThemeProvider theme={theme}>
      <ToastProvider>{ui}</ToastProvider>
    </ThemeProvider>,
  );

const TestButtons = () => {
  const toast = useToast();
  return (
    <div>
      <button onClick={() => toast.success('Done')}>success</button>
      <button onClick={() => toast.error('Boom')}>error</button>
    </div>
  );
};

describe('ToastProvider', () => {
  it('shows success toast when triggered via hook', async () => {
    renderWithProviders(<TestButtons />);
    fireEvent.click(screen.getByText('success'));
    await waitFor(() => {
      expect(screen.getByText('Done')).toBeTruthy();
    });
  });

  it('applies inline styles from theme (font-size and color)', async () => {
    renderWithProviders(<TestButtons />);
    fireEvent.click(screen.getByText('success'));

    await waitFor(() => {
      const toastEl = document.querySelector('.Toastify__toast') as HTMLElement | null;
      expect(toastEl).toBeTruthy();
      if (toastEl) {
        expect(toastEl.style.fontSize).toBe('14px');
        const hex = theme.colors.textPrimary;
        const toRgb = (h: string) =>
          `rgb(${parseInt(h.slice(1, 3), 16)}, ${parseInt(h.slice(3, 5), 16)}, ${parseInt(
            h.slice(5, 7),
            16,
          )})`;
        expect(toastEl.style.color).toBe(toRgb(hex));
      }
    });
  });

  it('shows error toast when triggered via hook', async () => {
    renderWithProviders(<TestButtons />);
    fireEvent.click(screen.getByText('error'));
    await waitFor(() => {
      expect(screen.getByText('Boom')).toBeTruthy();
    });
  });
});
