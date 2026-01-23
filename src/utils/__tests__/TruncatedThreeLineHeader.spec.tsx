import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { IHeaderParams } from 'ag-grid-community';
import { TruncatedThreeLineHeader } from '@/utils/getPreviewScreenColumnDefs';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';

const createHeaderParams = (overrides?: Partial<IHeaderParams>): IHeaderParams => {
  return {
    column: {
      getColDef: () => ({
        headerComponentParams: {
          defaultDescription: 'Default Desc',
          callDistributionReason: 'Call Reason',
          investmentTitle: 'Investment Title',
        },
      }),
    } as unknown,
    progressSort: jest.fn(),
    ...overrides,
  } as IHeaderParams;
};

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('TruncatedThreeLineHeader component', () => {
  it('renders header text from headerComponentParams', () => {
    const params = createHeaderParams();
    renderWithTheme(<TruncatedThreeLineHeader {...params} />);
    expect(screen.getByText('Default Desc')).toBeInTheDocument();
    expect(screen.getByText('Call Reason')).toBeInTheDocument();
    expect(screen.getByText('Investment Title')).toBeInTheDocument();
  });

  it('calls progressSort(false) on click', () => {
    const progressSort = jest.fn();
    const params = createHeaderParams({ progressSort });
    renderWithTheme(<TruncatedThreeLineHeader {...params} />);

    fireEvent.click(screen.getByText('Default Desc'));

    expect(progressSort).toHaveBeenCalledTimes(1);
    expect(progressSort).toHaveBeenCalledWith(false);
  });

  it('calls progressSort(true) on shift-click', () => {
    const progressSort = jest.fn();
    const params = createHeaderParams({ progressSort });
    renderWithTheme(<TruncatedThreeLineHeader {...params} />);

    fireEvent.click(screen.getByText('Default Desc'), {
      shiftKey: true,
    });

    expect(progressSort).toHaveBeenCalledTimes(1);
    expect(progressSort).toHaveBeenCalledWith(true);
  });
});
