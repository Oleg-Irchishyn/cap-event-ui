import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import SaveDraftButton from '../SaveDraftButton';

const mockPush = jest.fn();
jest.mock('next/router', () => ({
  __esModule: true,
  default: { push: (...args: unknown[]) => mockPush(...args) },
}));

const mockToast = { success: jest.fn(), error: jest.fn?.() ?? jest.fn() };
jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => mockToast,
}));

const mockCreateDraft = jest.fn();
jest.mock('@/api', () => ({
  CapEventPackageApi: {
    default: {
      createDraft: (...args: unknown[]) => mockCreateDraft(...args),
    },
  },
}));

jest.mock('@/stores', () => {
  const preview = {
    buildPayload: jest.fn(),
    withAggregatedLineItems: jest.fn((x: unknown) => x),
  };
  return {
    previewScreenStore: preview,
    capEventSettingsStore: { resetStore: jest.fn() },
    entityDatesStore: { resetAllDates: jest.fn() },
  };
});

const mockUseSaveDraft = jest.fn(() => ({ isSaveDraftDisabled: false }));
jest.mock('@/hooks/useSaveDraftButton', () => ({
  __esModule: true,
  default: () => mockUseSaveDraft(),
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('SaveDraftButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUseSaveDraft.mockReturnValue({ isSaveDraftDisabled: false });
  });

  it('renders with correct label', () => {
    renderWithTheme(<SaveDraftButton />);
    const button = screen.getByTestId('save-draft');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Save Draft')).toBeInTheDocument();
  });

  it('is disabled when hook returns disabled', () => {
    mockUseSaveDraft.mockReturnValue({ isSaveDraftDisabled: true });
    renderWithTheme(<SaveDraftButton />);
    const button = screen.getByTestId('save-draft');
    expect(button).toBeDisabled();
  });

  it('calls API, shows toast, and navigates on successful save', async () => {
    mockUseSaveDraft.mockReturnValue({ isSaveDraftDisabled: false });
    const stores = require('@/stores');
    stores.previewScreenStore.buildPayload.mockReturnValue({ foo: 'bar' });
    stores.previewScreenStore.withAggregatedLineItems.mockImplementation((x: unknown) => ({
      ...(x as object),
      aggregated: true,
    }));
    mockCreateDraft.mockResolvedValue({ ok: true });

    renderWithTheme(<SaveDraftButton />);
    const button = screen.getByTestId('save-draft');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockCreateDraft).toHaveBeenCalledTimes(1);
      expect(mockCreateDraft).toHaveBeenCalledWith({ foo: 'bar', aggregated: true });
      expect(mockToast.success).toHaveBeenCalledWith('Successfully Saved');
      expect(mockPush).toHaveBeenCalled();
    });
  });
});
