import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import ListView from '../ListView';
import { ITEM_STATES } from '@/const/common';

jest.mock('../DropdownMenu', () => {
  const mock = jest.fn(() => null);
  return {
    __esModule: true,
    default: mock,
  };
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ListView - Sorting', () => {
  it('should render items sorted A–Z by label (case and accent insensitive)', () => {
    const items = [
      { label: 'zeta', state: ITEM_STATES.OPTIONAL },
      { label: 'Beta', state: ITEM_STATES.OPTIONAL },
      { label: 'Álvaro', state: ITEM_STATES.OPTIONAL },
      { label: 'alpha', state: ITEM_STATES.OPTIONAL },
    ];

    const { container } = renderWithTheme(
      <ListView
        testId="list-view"
        items={items}
        itemClickHandler={() => () => {}}
        isLoadingItems={false}
        checkbox={false}
        withSearch={false}
        onSearchChangeHandler={() => {}}
        searchText=""
        withControls={false}
        withDescription={false}
        isSelectAllAvailable={false}
        isDeselectAllAvailable={false}
        isHideAlternativeButton={true}
        noDataText=""
      />,
    );

    const nodes = container.querySelectorAll('[data-is-withbackground]');
    const labels = Array.from(nodes).map((node) => (node.textContent || '').trim());

    expect(labels).toEqual(['alpha', 'Álvaro', 'Beta', 'zeta']);
  });

  it('should render loader content instead of items when isLoadingItems is true', () => {
    renderWithTheme(
      <ListView
        testId="list-view"
        items={[
          { label: 'zeta', state: ITEM_STATES.OPTIONAL },
          { label: 'alpha', state: ITEM_STATES.OPTIONAL },
        ]}
        itemClickHandler={() => () => {}}
        isLoadingItems
        checkbox={false}
        withSearch={false}
        onSearchChangeHandler={() => {}}
        searchText=""
        withControls={false}
        withDescription={false}
        isSelectAllAvailable={false}
        isDeselectAllAvailable={false}
        isHideAlternativeButton
        noDataText=""
      />,
    );

    expect(screen.queryByText('alpha')).not.toBeInTheDocument();
    expect(screen.queryByText('zeta')).not.toBeInTheDocument();
  });

  it('should render No Data text when items empty and noDataText provided', () => {
    const { container } = renderWithTheme(
      <ListView
        testId="list-view"
        items={[]}
        itemClickHandler={() => () => {}}
        isLoadingItems={false}
        checkbox={false}
        withSearch={false}
        onSearchChangeHandler={() => {}}
        searchText=""
        withControls={false}
        withDescription={false}
        isSelectAllAvailable={false}
        isDeselectAllAvailable={false}
        isHideAlternativeButton
        noDataText="No Data Available"
      />,
    );

    expect(container).toHaveTextContent('No Data Available');
  });

  it('should render checkbox and descriptions when flags are enabled', () => {
    renderWithTheme(
      <ListView
        testId="list-view"
        items={[
          {
            label: 'alpha',
            description: 'desc',
            additionalDescription: 'more',
            state: ITEM_STATES.OPTIONAL,
          },
        ]}
        itemClickHandler={() => () => {}}
        isLoadingItems={false}
        checkbox
        withSearch={false}
        onSearchChangeHandler={() => {}}
        searchText=""
        withControls={false}
        withDescription
        isSelectAllAvailable={false}
        isDeselectAllAvailable={false}
        isHideAlternativeButton
        noDataText=""
      />,
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
    expect(screen.getByText('more')).toBeInTheDocument();
  });

  it('should invoke item click handler on item click and pass item', () => {
    const onItem = jest.fn();
    const onClick = jest.fn();
    onItem.mockReturnValue(onClick);

    renderWithTheme(
      <ListView
        testId="list-view"
        items={[{ label: 'alpha', state: ITEM_STATES.OPTIONAL }]}
        itemClickHandler={onItem}
        isLoadingItems={false}
        checkbox={false}
        withSearch={false}
        onSearchChangeHandler={() => {}}
        searchText=""
        withControls={false}
        withDescription={false}
        isSelectAllAvailable={false}
        isDeselectAllAvailable={false}
        isHideAlternativeButton
        noDataText=""
      />,
    );

    fireEvent.click(screen.getByText('alpha'));

    expect(onItem).toHaveBeenCalledWith({ label: 'alpha', state: ITEM_STATES.OPTIONAL });
    expect(onClick).toHaveBeenCalled();
  });
});
