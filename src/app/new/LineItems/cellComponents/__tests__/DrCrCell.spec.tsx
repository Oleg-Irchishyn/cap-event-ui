import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { DrCrCell } from '@/app/new/LineItems/cellComponents/DrCrCell';
import { ICellRendererParams } from 'ag-grid-community';
import { theme } from '@/ui/globalStyles';

describe('DrCrCell', () => {
  const renderWithTheme = (props: Partial<ICellRendererParams> = {}) => {
    const baseProps = { value: undefined, data: {} } as unknown as ICellRendererParams;
    const merged = { ...baseProps, ...props } as ICellRendererParams;
    return render(
      <ThemeProvider theme={theme}>
        <DrCrCell {...merged} />
      </ThemeProvider>,
    );
  };

  it('shows "-" and is disabled when amount is 0', () => {
    renderWithTheme({ value: 0, data: {} });
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('-');
    expect(input).toBeDisabled();
  });

  it('shows "Dr" and is enabled when amount is negative', () => {
    renderWithTheme({ value: -123.45, data: {} });
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Dr');
    expect(input).toBeEnabled();
  });

  it('shows "Cr" and is enabled when amount is positive', () => {
    renderWithTheme({ value: 99.99, data: {} });
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Cr');
    expect(input).toBeEnabled();
  });
});
