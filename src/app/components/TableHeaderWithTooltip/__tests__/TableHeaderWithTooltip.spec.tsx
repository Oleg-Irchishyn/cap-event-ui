import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import TableHeaderWithTooltip from '@/app/components/TableHeaderWithTooltip';
import { theme } from '@/ui/globalStyles';
import { Column, IHeaderParams } from 'ag-grid-community';

jest.mock('@/app/components/Tooltip', () => ({
  __esModule: true,
  default: (props: { tooltipMessage: string; showTooltip: boolean }) => {
    return props.showTooltip ? <div data-testid="tooltip">{props.tooltipMessage}</div> : null;
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('TableHeaderWithTooltip', () => {
  const props: Partial<IHeaderParams> = {
    displayName: 'Amount',
    column: {
      getColDef: () => ({ headerComponentParams: { tooltipMessage: 'test tooltip' } }),
    } as Column,
  };

  it('renders header name correctly', () => {
    renderWithTheme(<TableHeaderWithTooltip {...(props as IHeaderParams)} />);

    expect(screen.getByText('Amount')).toBeInTheDocument();
  });

  it('shows tooltip on mouse enter and hides on mouse leave', () => {
    renderWithTheme(<TableHeaderWithTooltip {...(props as IHeaderParams)} />);
    const icon = screen.getByTestId('help-icon');

    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();

    fireEvent.mouseEnter(icon);
    expect(screen.queryByTestId('tooltip')).toBeInTheDocument();

    fireEvent.mouseLeave(icon);
    expect(screen.queryByTestId('tooltip')).not.toBeInTheDocument();
  });
});
