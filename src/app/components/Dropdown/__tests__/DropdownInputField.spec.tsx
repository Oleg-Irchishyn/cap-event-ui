import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import DropdownInputField from '../DropdownInputField';
import type { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { ITEM_STATES } from '@/const/common';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('DropdownInputField', () => {
  it('shows placeholder when no selections and triggers open on click', () => {
    const open = jest.fn();

    renderWithTheme(
      <DropdownInputField
        testId="dd-input"
        isOpen={false}
        isError={false}
        isReadOnly={false}
        isDisabled={false}
        placeholder="Pick option"
        selectedItems={[]}
        isMultiSelect={false}
        openDropdownHandler={open}
        isCompact={false}
      />,
    );

    expect(screen.getByText('Pick option')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Pick option'));
    expect(open).toHaveBeenCalled();
  });

  it('shows single-select visible label with displayName precedence', () => {
    renderWithTheme(
      <DropdownInputField
        testId="dd-input"
        isOpen={false}
        isError={false}
        isReadOnly={false}
        isDisabled={false}
        placeholder="Choose"
        selectedItems={[{ label: 'Label', displayName: 'Display', state: ITEM_STATES.SELECTED }]}
        isMultiSelect={false}
        openDropdownHandler={() => {}}
        isCompact={false}
      />,
    );

    expect(screen.getByText('Display')).toBeInTheDocument();
    expect(screen.queryByText('Label')).not.toBeInTheDocument();
  });

  it('renders multi-select chips and calls deselect handler', () => {
    const onDeselect: (item: DropdownItemType<unknown>, isDisabled?: boolean) => () => void = jest
      .fn()
      .mockReturnValue(jest.fn());

    renderWithTheme(
      <DropdownInputField
        testId="dd-input"
        isOpen={false}
        isError={false}
        isReadOnly={false}
        isDisabled={false}
        placeholder="Choose"
        selectedItems={[
          { id: '1', label: 'A', state: ITEM_STATES.SELECTED },
          { id: '2', label: 'B', state: ITEM_STATES.SELECTED },
        ]}
        isMultiSelect
        onDeselectItemClickHandler={onDeselect}
        openDropdownHandler={() => {}}
        isCompact={false}
      />,
    );

    fireEvent.click(screen.getByTestId('dd-input-RemoveButton-A'));
    expect(onDeselect).toHaveBeenCalledWith(
      expect.objectContaining({ label: 'A', state: ITEM_STATES.SELECTED }),
      undefined,
    );
  });

  it('shows hidden options counter for more than 9 items', () => {
    const items: DropdownItemType[] = Array.from({ length: 12 }).map((_, i) => ({
      id: `${i}`,
      label: `L${i}`,
      state: ITEM_STATES.SELECTED,
    }));

    renderWithTheme(
      <DropdownInputField
        testId="dd-input"
        isOpen={false}
        isError={false}
        isReadOnly={false}
        isDisabled={false}
        placeholder="Choose"
        selectedItems={items}
        isMultiSelect
        openDropdownHandler={() => {}}
        isCompact={false}
      />,
    );

    expect(screen.getByTestId('dd-input-HiddenOptions-HiddenOptionsCounter')).toHaveTextContent(
      '+12',
    );
  });

  it('does not open when read-only', () => {
    const open = jest.fn();

    renderWithTheme(
      <DropdownInputField
        testId="dd-input"
        isOpen={false}
        isError={false}
        isReadOnly
        isDisabled={false}
        placeholder="Choose"
        selectedItems={[]}
        isMultiSelect={false}
        openDropdownHandler={open}
        isCompact={false}
      />,
    );

    fireEvent.click(screen.getByText('Choose'));
    expect(open).not.toHaveBeenCalled();
  });
});
