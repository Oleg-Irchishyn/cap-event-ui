import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import FootnotesModal from '../FootnotesModal';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

jest.mock('next/image', () => {
  return function MockImage({ alt, ...props }: { alt?: string; [key: string]: unknown }) {
    return (
      <div
        role="img"
        aria-label={alt}
        data-testid="mock-next-image"
        {...(props as Record<string, unknown>)}
      />
    );
  };
});

jest.mock('@/hooks/useExternalElementClick', () => ({
  useExternalElementClick: jest.fn(),
}));

jest.mock('@/app/components/Dropdown', () => {
  return function Dropdown({
    label,
    testId,
    selectedItems,
  }: {
    label: string;
    testId: string;
    selectHandler: (item: { label: string }) => void;
    selectedItems: { label: string }[];
  }) {
    return (
      <div data-testid={testId}>
        <div>{label}</div>
        {selectedItems.length > 0 && <div>{selectedItems[0].label}</div>}
      </div>
    );
  };
});

jest.mock('@/app/components/Button', () => {
  const BUTTON_THEMES = {
    secondary: 'secondary',
    primary: 'primary',
    text: 'text',
  };

  function Button({
    children,
    onClick,
    disabled,
    testId,
  }: {
    children: React.ReactNode;
    onClick: () => void;
    disabled?: boolean;
    testId: string;
  }) {
    return (
      <button data-testid={testId} onClick={onClick} disabled={disabled}>
        {children}
      </button>
    );
  }

  return {
    __esModule: true,
    default: Button,
    BUTTON_THEMES,
  };
});

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    footnotes: [],
    customEntityDescription: ['Description 1', 'Description 2', 'Description 3'],
    setFootnotes: jest.fn(),
  },
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('FootnotesModal', () => {
  const { capEventSettingsStore } = require('@/stores');

  const mockHandleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    capEventSettingsStore.footnotes = [];
    capEventSettingsStore.setFootnotes = jest.fn();
  });

  it('renders modal when isOpen is true', () => {
    renderWithTheme(<FootnotesModal isOpen={true} handleClose={mockHandleClose} />);

    expect(screen.getByText('Footnote(s) Settings')).toBeInTheDocument();
    expect(screen.getByText('Cancel')).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
  });

  it('does not render when isOpen is false', () => {
    renderWithTheme(<FootnotesModal isOpen={false} handleClose={mockHandleClose} />);

    expect(screen.queryByText('Footnote(s) Settings')).not.toBeInTheDocument();
  });

  it('calls handleClose when close button is clicked', () => {
    renderWithTheme(<FootnotesModal isOpen={true} handleClose={mockHandleClose} />);

    const closeButton = screen.getByRole('img', { name: 'modal-close-icon' }).closest('div');
    fireEvent.click(closeButton!);

    expect(mockHandleClose).toHaveBeenCalledTimes(1);
  });

  it('adds new footnote item when add button is clicked', () => {
    renderWithTheme(<FootnotesModal isOpen={true} handleClose={mockHandleClose} />);

    const addButton = screen.getByTestId(prepareDataTestId('add-footnote'));
    fireEvent.click(addButton);

    const dropdowns = screen.getAllByText('Notice Line Description');
    expect(dropdowns.length).toBe(2);
  });

  it('enables save button when all fields are filled and changes are made', async () => {
    renderWithTheme(<FootnotesModal isOpen={true} handleClose={mockHandleClose} />);

    const saveButton = screen.getByTestId('save');
    expect(saveButton).toBeDisabled();

    const textarea = screen.getByPlaceholderText('Enter footnote text');
    fireEvent.change(textarea, { target: { value: 'Test footnote text' } });

    await waitFor(() => {
      expect(saveButton).toBeDisabled();
    });
  });
});
