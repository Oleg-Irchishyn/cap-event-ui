import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import ButtonsGroup from '@/app/new/ButtonsGroup';
import { theme } from '@/ui/globalStyles';
import { capEventSettingsStore } from '@/stores';
import { LineItemRow } from '@/app/new/LineItems/types';

jest.mock('next/navigation', () => ({
  useRouter: () => ({ push: jest.fn() }),
  useServerInsertedHTML: jest.fn(),
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
});
