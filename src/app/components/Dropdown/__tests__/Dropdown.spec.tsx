import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import Dropdown from '../Dropdown';
import { ITEM_STATES } from '@/const/common';

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('Dropdown', () => {
  it('opens on click and closes on second click', () => {
    const selectHandler = jest.fn();

    renderWithTheme(
      <Dropdown
        testId="dd"
        items={[{ label: 'A', state: ITEM_STATES.OPTIONAL }]}
        selectedItems={[]}
        selectHandler={selectHandler}
        placeholder="Choose"
        label="Label"
      />,
    );

    // Closed initially; ListView is not rendered
    expect(screen.queryByTestId('dd')).not.toBeInTheDocument();

    // Click to open
    fireEvent.click(screen.getByText('Choose'));
    // Now ListView should be rendered with testId
    expect(screen.getByTestId('dd')).toBeInTheDocument();

    // Click again to close
    fireEvent.click(screen.getByText('Choose'));
    expect(screen.queryByTestId('dd')).not.toBeInTheDocument();
  });

  it('shows error label when errorMessage provided', () => {
    renderWithTheme(
      <Dropdown
        testId="dd"
        items={[]}
        selectedItems={[]}
        selectHandler={() => {}}
        placeholder="Choose"
        label="Label"
        errorMessage="Error occurred"
      />,
    );

    expect(screen.getByText('Error occurred')).toBeInTheDocument();
  });

  it('selecting single item calls handler and closes', () => {
    const onSelect = jest.fn();

    renderWithTheme(
      <Dropdown
        testId="dd"
        items={[{ label: 'A', state: ITEM_STATES.OPTIONAL }]}
        selectedItems={[]}
        selectHandler={onSelect}
        placeholder="Choose"
        label="Label"
      />,
    );

    fireEvent.click(screen.getByText('Choose'));
    fireEvent.click(screen.getByText('A'));

    expect(onSelect).toHaveBeenCalledWith(expect.objectContaining({ label: 'A' }));
    expect(screen.queryByTestId('dd')).not.toBeInTheDocument();
  });

  it('multi-select remains open after selecting an item', () => {
    const onSelect = jest.fn();

    renderWithTheme(
      <Dropdown
        testId="dd"
        items={[{ label: 'A', state: ITEM_STATES.OPTIONAL }]}
        selectedItems={[]}
        isMultiSelect
        checkbox
        selectHandler={onSelect}
        placeholder="Choose"
        label="Label"
      />,
    );

    fireEvent.click(screen.getByText('Choose'));
    fireEvent.click(screen.getByText('A'));

    expect(onSelect).toHaveBeenCalled();
    expect(screen.getByTestId('dd')).toBeInTheDocument();
  });

  it('does not open when disabled or read-only', () => {
    const { rerender } = renderWithTheme(
      <Dropdown
        testId="dd"
        items={[{ label: 'A', state: ITEM_STATES.OPTIONAL }]}
        selectedItems={[]}
        selectHandler={() => {}}
        placeholder="Choose"
        label="Label"
        isDisabled
      />,
    );

    fireEvent.click(screen.getByText('Choose'));
    expect(screen.queryByTestId('dd')).not.toBeInTheDocument();

    rerender(
      <ThemeProvider theme={theme}>
        <Dropdown
          testId="dd"
          items={[{ label: 'A', state: ITEM_STATES.OPTIONAL }]}
          selectedItems={[]}
          selectHandler={() => {}}
          placeholder="Choose"
          label="Label"
          isReadOnly
        />
      </ThemeProvider>,
    );

    fireEvent.click(screen.getByText('Choose'));
    expect(screen.queryByTestId('dd')).not.toBeInTheDocument();
  });

  it('onOpenChange(false) returning false prevents closing', () => {
    const onOpenChange = jest.fn().mockImplementation((isOpen: boolean) => (isOpen ? true : false));

    renderWithTheme(
      <Dropdown
        testId="dd"
        items={[{ label: 'A', state: ITEM_STATES.OPTIONAL }]}
        selectedItems={[]}
        selectHandler={() => {}}
        placeholder="Choose"
        label="Label"
        onOpenChange={onOpenChange}
      />,
    );

    fireEvent.click(screen.getByText('Choose')); // open
    expect(screen.getByTestId('dd')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Choose')); // attempt close, blocked
    expect(screen.getByTestId('dd')).toBeInTheDocument();
  });
});
