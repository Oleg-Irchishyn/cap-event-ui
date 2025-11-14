import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import SortableItem from '@/app/new/attachments/SortableItem';

jest.mock('@dnd-kit/sortable', () => ({
  useSortable: jest.fn(() => ({
    isDragging: false,
    attributes: {},
    listeners: {},
    setNodeRef: jest.fn(),
    transform: null,
    transition: null,
  })),
}));

const mockedItem = jest.fn((props: Record<string, unknown>) => (
  <div data-testid="item-proxy" {...props} />
));
jest.mock('@/app/new/attachments/Item', () => ({
  __esModule: true,
  default: (props: Record<string, unknown>) => mockedItem(props),
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('SortableItem', () => {
  beforeEach(() => {
    mockedItem.mockClear();
  });

  it('renders Item with passed props', () => {
    renderWithTheme(
      <SortableItem
        id="id-1"
        checked={false}
        fileNumber={1}
        fileName="file.pdf"
        removeFile={jest.fn()}
      />,
    );

    expect(mockedItem).toHaveBeenCalled();
    const call = mockedItem.mock.calls[0][0];
    expect(call.id).toBe('id-1');
    expect(call.fileName).toBe('file.pdf');
  });

  it('passes withOpacity=true when dragging', () => {
    const { useSortable } = jest.requireMock('@dnd-kit/sortable');
    useSortable.mockReturnValueOnce({
      isDragging: true,
      attributes: {},
      listeners: {},
      setNodeRef: jest.fn(),
      transform: null,
      transition: null,
    });

    renderWithTheme(
      <SortableItem
        id="id-2"
        checked={false}
        fileNumber={2}
        fileName="file2.pdf"
        removeFile={jest.fn()}
      />,
    );

    const call = mockedItem.mock.calls[0][0];
    expect(call.withOpacity).toBe(true);
  });
});
