import { fireEvent, render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import SearchBox from '../SearchBox';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

jest.mock('next/image', () => {
  return function MockImage() {
    return <div data-testid="mock-next-image" />;
  };
});

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('SearchBox', () => {
  const mockSearchCallback = jest.fn();
  const mockClearCallback = jest.fn();
  const testId = 'test-search';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders search input with placeholder and calls searchCallback when text changes', () => {
    renderWithTheme(
      <SearchBox
        testId={testId}
        searchText=""
        searchCallback={mockSearchCallback}
        clearCallbackHandler={mockClearCallback}
        placeholder="Search items"
      />,
    );

    const input = screen.getByTestId(testId);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('placeholder', 'Search items');

    fireEvent.change(input, { target: { value: 'test query' } });
    expect(mockSearchCallback).toHaveBeenCalledWith('test query');
  });

  it('displays searchText value in input', () => {
    renderWithTheme(
      <SearchBox
        testId={testId}
        searchText="current search"
        searchCallback={mockSearchCallback}
        clearCallbackHandler={mockClearCallback}
      />,
    );

    const input = screen.getByTestId(testId) as HTMLInputElement;
    expect(input.value).toBe('current search');
  });

  it('shows clear icon when searchText is not empty and calls clearCallbackHandler when clicked', () => {
    const { container } = renderWithTheme(
      <SearchBox
        testId={testId}
        searchText="some text"
        searchCallback={mockSearchCallback}
        clearCallbackHandler={mockClearCallback}
      />,
    );

    const clearIcon = container.querySelector('img[src="/cap-event/icons/cross.svg"]');
    expect(clearIcon).toBeInTheDocument();

    fireEvent.click(clearIcon!);
    expect(mockClearCallback).toHaveBeenCalledTimes(1);
  });

  it('does not show clear icon when searchText is empty', () => {
    const { container } = renderWithTheme(
      <SearchBox
        testId={testId}
        searchText=""
        searchCallback={mockSearchCallback}
        clearCallbackHandler={mockClearCallback}
      />,
    );

    const clearIcon = container.querySelector('img[src="/cap-event/icons/cross.svg"]');
    expect(clearIcon).not.toBeInTheDocument();
  });

  it('applies custom width and uses default placeholder when not provided', () => {
    renderWithTheme(
      <SearchBox
        testId={testId}
        searchText=""
        searchCallback={mockSearchCallback}
        clearCallbackHandler={mockClearCallback}
        width={500}
      />,
    );

    const wrapper = screen.getByTestId(prepareDataTestId(testId, 'SearchBox'));
    expect(wrapper).toBeInTheDocument();

    const input = screen.getByTestId(testId);
    expect(input).toHaveAttribute('placeholder', 'Search');
  });
});
