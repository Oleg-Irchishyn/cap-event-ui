import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import ButtonsGroup from '@/app/components/ButtonsGroup/ButtonsGroup';
import { theme } from '@/ui/globalStyles';
import { capEventSettingsStore } from '@/stores';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ROUTES } from '@/const/routes';
import type CapEventSettingsStore from '@/stores/CapEventSettingsStore';

const mockUsePathname = jest.fn();

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useServerInsertedHTML: jest.fn(),
  usePathname: () => mockUsePathname(),
}));

jest.mock('@/app/new/FootnotesModal', () => ({
  __esModule: true,
  default: ({ isOpen, handleClose }: { isOpen: boolean; handleClose: () => void }) =>
    isOpen ? (
      <div data-testid="footnotes-modal">
        <button onClick={handleClose}>Close</button>
      </div>
    ) : null,
}));

jest.mock('@/app/components/ContinueButton', () => ({
  __esModule: true,
  default: () => (
    <button data-testid="preview-screen" disabled>
      Continue
    </button>
  ),
}));

jest.mock('@/app/components/SubmitButton', () => ({
  __esModule: true,
  default: () => <button data-testid="cap-event-submit">Submit</button>,
}));

jest.mock('@/stores', () => {
  return {
    capEventSettingsStore: {
      entitiesLineItem: new Map(),
      fundGroupsLineItem: [],
      fundEntities: [],
      customEntityDescription: [],
      setFootnotes: jest.fn(),
      isGeneralSettingsEmpty: jest.fn(() => true),
      hasAttachmentErrors: false,
    },
    entityDatesStore: {
      noticeDate: null,
      hasDifferentDates: false,
      getEntityDueDate: jest.fn(() => new Date()),
      getEntityNoticeDate: jest.fn(() => new Date()),
      getEntityDueDateInputValidity: jest.fn(() => true),
      getEntityNoticeDateInputValidity: jest.fn(() => true),
    },
  };
});

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('ButtonsGroup', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockUsePathname.mockReturnValue('/new');
    (capEventSettingsStore.entitiesLineItem as Map<string, LineItemRow[]>).clear();
    (capEventSettingsStore.fundGroupsLineItem as LineItemRow[]) = [];
  });

  it('renders all buttons', () => {
    renderWithTheme(<ButtonsGroup />);

    expect(screen.getByTestId('cancel')).toBeInTheDocument();
    expect(screen.getByTestId('footnotes')).toBeInTheDocument();
    expect(screen.getByTestId('delete')).toBeInTheDocument();
    expect(screen.getByTestId('save-draft')).toBeInTheDocument();
    expect(screen.getByTestId('preview-screen')).toBeInTheDocument();
  });

  it('has disabled buttons by default', () => {
    renderWithTheme(<ButtonsGroup />);

    expect(screen.getByTestId('cancel')).toBeDisabled();
    expect(screen.getByTestId('delete')).toBeDisabled();
    expect(screen.getByTestId('save-draft')).toBeDisabled();
    expect(screen.getByTestId('preview-screen')).toBeDisabled();
    expect(screen.getByTestId('footnotes')).toBeDisabled();
  });

  it('enables Footnotes when fund group has a description', () => {
    (capEventSettingsStore.fundGroupsLineItem as LineItemRow[]) = [
      { defaultDescription: 'Desc FG' } as LineItemRow,
    ];

    renderWithTheme(<ButtonsGroup />);

    expect(screen.getByTestId('footnotes')).not.toBeDisabled();
  });

  it('enables Footnotes when any entity has a description', () => {
    (capEventSettingsStore.entitiesLineItem as Map<string, LineItemRow[]>).set('Entity A', [
      { defaultDescription: 'Entity Desc' } as LineItemRow,
    ]);

    renderWithTheme(<ButtonsGroup />);

    expect(screen.getByTestId('footnotes')).not.toBeDisabled();
  });

  it('opens FootnotesModal on click and closes on modal close', () => {
    (capEventSettingsStore.fundGroupsLineItem as LineItemRow[]) = [
      { defaultDescription: 'Desc FG' } as LineItemRow,
    ];
    renderWithTheme(<ButtonsGroup />);

    const footnotesBtn = screen.getByTestId('footnotes');
    fireEvent.click(footnotesBtn);
    expect(screen.getByTestId('footnotes-modal')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Close'));
    expect(screen.queryByTestId('footnotes-modal')).not.toBeInTheDocument();
  });

  describe('renderButton', () => {
    it('renders ContinueButton when path is /new', () => {
      mockUsePathname.mockReturnValue(ROUTES.NEW_CAP_EVENT.path);

      renderWithTheme(<ButtonsGroup />);

      expect(screen.getByTestId('preview-screen')).toBeInTheDocument();
      expect(screen.queryByTestId('cap-event-submit')).not.toBeInTheDocument();
    });

    it('renders SubmitButton when path is /preview-screen', () => {
      mockUsePathname.mockReturnValue(ROUTES.PREVIEW_SCREEN.path);

      renderWithTheme(<ButtonsGroup />);

      expect(screen.getByTestId('cap-event-submit')).toBeInTheDocument();
      expect(screen.queryByTestId('preview-screen')).not.toBeInTheDocument();
    });
  });

  describe('isCancelDisabled logic', () => {
    it('enables Cancel on preview-screen route', () => {
      mockUsePathname.mockReturnValue(ROUTES.PREVIEW_SCREEN.path);

      renderWithTheme(<ButtonsGroup />);

      expect(screen.getByTestId('cancel')).not.toBeDisabled();
    });

    it('disables Cancel when snapshot exists and no changes', () => {
      mockUsePathname.mockReturnValue(ROUTES.NEW_CAP_EVENT.path);
      const settingsStore = capEventSettingsStore as unknown as CapEventSettingsStore;
      settingsStore.initialStateSnapshot = { foo: 'bar', nested: { a: 1 } };
      const collectMock = jest
        .fn<ReturnType<CapEventSettingsStore['collectFields']>, []>()
        .mockReturnValue({ foo: 'bar', nested: { a: 1 } } as unknown as ReturnType<
          CapEventSettingsStore['collectFields']
        >);
      settingsStore.collectFields = collectMock;

      renderWithTheme(<ButtonsGroup />);

      expect(screen.getByTestId('cancel')).toBeDisabled();
    });

    it('enables Cancel when snapshot exists and there are changes', () => {
      mockUsePathname.mockReturnValue(ROUTES.NEW_CAP_EVENT.path);
      const settingsStore = capEventSettingsStore as unknown as CapEventSettingsStore;
      settingsStore.initialStateSnapshot = { foo: 'bar', nested: { a: 1 } };
      const collectMock = jest
        .fn<ReturnType<CapEventSettingsStore['collectFields']>, []>()
        .mockReturnValue({ foo: 'baz', nested: { a: 2 } } as unknown as ReturnType<
          CapEventSettingsStore['collectFields']
        >);
      settingsStore.collectFields = collectMock;

      renderWithTheme(<ButtonsGroup />);

      expect(screen.getByTestId('cancel')).not.toBeDisabled();
    });
  });
});
