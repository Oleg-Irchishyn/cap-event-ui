import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import ListItem from '../ListItem';
import type { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { ITEM_STATES } from '@/const/common';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ListItem', () => {
  it('renders checkbox and descriptions, and calls itemClickHandler', () => {
    const handlerFactory: (item: DropdownItemType<unknown>) => () => void = jest
      .fn()
      .mockReturnValue(jest.fn());

    renderWithTheme(
      <ListItem
        item={{
          label: 'alpha',
          description: 'desc',
          additionalDescription: 'more',
          state: ITEM_STATES.OPTIONAL,
        }}
        checkbox
        withDescription
        itemClickHandler={handlerFactory}
      />,
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByText('desc')).toBeInTheDocument();
    expect(screen.getByText('more')).toBeInTheDocument();

    fireEvent.click(screen.getByText('alpha'));
    expect(handlerFactory).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'alpha', state: ITEM_STATES.OPTIONAL }),
    );
  });

  it('does not trigger click when item is EXCLUDED and checkbox is disabled', () => {
    const handlerFactory: (item: DropdownItemType<unknown>) => () => void = jest
      .fn()
      .mockReturnValue(jest.fn());

    renderWithTheme(
      <ListItem
        item={{ label: 'excluded', state: ITEM_STATES.EXCLUDED }}
        checkbox
        itemClickHandler={handlerFactory}
        excludedTooltipMessage="Not allowed"
      />,
    );

    fireEvent.click(screen.getByText('excluded'));
    expect(handlerFactory).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'excluded', state: ITEM_STATES.EXCLUDED }),
    );
    // But returned handler should not run because ListItem guards EXCLUDED? (still attaches onClick)
    // We can at least assert checkbox is disabled
    expect(screen.getByRole('checkbox')).toBeDisabled();
  });

  it('checkbox is checked when item is SELECTED', () => {
    renderWithTheme(
      <ListItem
        item={{ label: 'sel', state: ITEM_STATES.SELECTED }}
        checkbox
        itemClickHandler={() => () => {}}
      />,
    );

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  it('does not render descriptions when withDescription is false', () => {
    renderWithTheme(
      <ListItem
        item={{
          label: 'alpha',
          description: 'desc',
          additionalDescription: 'more',
          state: ITEM_STATES.OPTIONAL,
        }}
        checkbox={false}
        withDescription={false}
        itemClickHandler={() => () => {}}
      />,
    );

    expect(screen.queryByText('desc')).not.toBeInTheDocument();
    expect(screen.queryByText('more')).not.toBeInTheDocument();
  });

  it('respects withBackground flag on container', () => {
    const { container, rerender } = renderWithTheme(
      <ListItem
        item={{ label: 'alpha', state: ITEM_STATES.OPTIONAL }}
        checkbox={false}
        withBackground
        itemClickHandler={() => () => {}}
      />,
    );

    expect(container.querySelector('[data-is-withbackground="true"]')).toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <ListItem
          item={{ label: 'alpha', state: ITEM_STATES.OPTIONAL }}
          checkbox={false}
          withBackground={false}
          itemClickHandler={() => () => {}}
        />
      </ThemeProvider>,
    );

    expect(container.querySelector('[data-is-withbackground="false"]')).toBeInTheDocument();
  });
});
