import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DropdownMenu from '../DropdownMenu';
import type { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { ITEM_STATES } from '@/const/common';

jest.mock('@/app/components/SearchBox', () => ({
  __esModule: true,
  default: ({ testId }: { testId: string }) => <input data-testid={testId} />,
}));

jest.mock('../ListItem', () => ({
  __esModule: true,
  default: ({
    item,
    itemClickHandler,
  }: {
    item: DropdownItemType<unknown>;
    itemClickHandler?: (item: DropdownItemType<unknown>) => () => void;
  }) => {
    const onClick = itemClickHandler ? itemClickHandler(item) : undefined;
    return (
      <div role="listitem" onClick={onClick}>
        {item.label}
      </div>
    );
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('DropdownMenu', () => {
  it('renders search box when withSearch is true', () => {
    renderWithTheme(
      <DropdownMenu
        testId="menu"
        withSearch
        searchText=""
        onSearchChangeHandler={() => {}}
        withControls={false}
        isSelectAllAvailable
        isDeselectAllAvailable
        isHideAlternativeButton
      />,
    );

    expect(screen.getByTestId('menu-SearchBox')).toBeInTheDocument();
  });

  it('renders controls and triggers handlers', () => {
    const onSelectAll = jest.fn();
    const onDeselectAll = jest.fn();

    renderWithTheme(
      <DropdownMenu
        testId="menu"
        withSearch={false}
        searchText=""
        onSearchChangeHandler={() => {}}
        withControls
        isSelectAllAvailable
        isDeselectAllAvailable
        onSelectAllHandler={onSelectAll}
        onDeselectAllHandler={onDeselectAll}
        isHideAlternativeButton={false}
      />,
    );

    const selectAll = screen.getByTestId('menu-SelectAllButton');
    const deselectAll = screen.getByTestId('menu-DeselectButton');

    fireEvent.click(selectAll);
    fireEvent.click(deselectAll);

    expect(onSelectAll).toHaveBeenCalledTimes(1);
    expect(onDeselectAll).toHaveBeenCalledTimes(1);
  });

  it('disables control handlers when unavailable', () => {
    const onSelectAll = jest.fn();
    const onDeselectAll = jest.fn();

    renderWithTheme(
      <DropdownMenu
        testId="menu"
        withSearch={false}
        searchText=""
        onSearchChangeHandler={() => {}}
        withControls
        isSelectAllAvailable={false}
        isDeselectAllAvailable={false}
        onSelectAllHandler={onSelectAll}
        onDeselectAllHandler={onDeselectAll}
        isHideAlternativeButton
      />,
    );

    fireEvent.click(screen.getByTestId('menu-SelectAllButton'));
    fireEvent.click(screen.getByTestId('menu-DeselectButton'));

    expect(onSelectAll).not.toHaveBeenCalled();
    expect(onDeselectAll).not.toHaveBeenCalled();
  });

  it('renders additional filters and triggers onAdditionalFilterChange', () => {
    const onAdditional: (item: DropdownItemType<unknown>) => () => void = jest
      .fn()
      .mockReturnValue(jest.fn());

    renderWithTheme(
      <DropdownMenu
        testId="menu"
        withSearch={false}
        searchText=""
        onSearchChangeHandler={() => {}}
        withControls={false}
        isSelectAllAvailable
        isDeselectAllAvailable
        isHideAlternativeButton
        additionalFilters={[
          { label: 'A', state: ITEM_STATES.OPTIONAL },
          { label: 'B', state: ITEM_STATES.OPTIONAL },
        ]}
        onAdditionalFilterChange={onAdditional}
      />,
    );

    fireEvent.click(screen.getByText('A'));
    expect(onAdditional).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'A', state: ITEM_STATES.OPTIONAL }),
    );
  });

  it('shows/hides AlternativeButton based on isHideAlternativeButton', () => {
    const { rerender } = renderWithTheme(
      <DropdownMenu
        testId="menu"
        withSearch={false}
        searchText=""
        onSearchChangeHandler={() => {}}
        withControls
        isSelectAllAvailable
        isDeselectAllAvailable
        isHideAlternativeButton
      />,
    );

    expect(screen.queryByTestId('menu-AlternativeButton')).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <DropdownMenu
          testId="menu"
          withSearch={false}
          searchText=""
          onSearchChangeHandler={() => {}}
          withControls
          isSelectAllAvailable
          isDeselectAllAvailable
          isHideAlternativeButton={false}
        />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('menu-AlternativeButton')).toBeInTheDocument();
  });
});
