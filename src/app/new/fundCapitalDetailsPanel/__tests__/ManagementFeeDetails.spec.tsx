import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManagementFeeDetails from '../ManagementFeeDetails';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    mgmtJournalEntries: {
      'entity-1': [
        {
          amount: 1000,
          batchDate: '2025-01-15',
          batchTitle: 'Q1 Management Fee',
          batchNo: 'BATCH-001',
        },
        {
          amount: 2000,
          batchDate: '2025-02-15',
          batchTitle: 'Q2 Management Fee',
          batchNo: 'BATCH-002',
        },
      ],
    },
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ManagementFeeDetails', () => {
  const defaultProps = {
    entityId: 'entity-1',
  };

  it('renders the "Include Uncalled Mgmt Fee" dropdown with default "No" selected', () => {
    renderWithTheme(<ManagementFeeDetails {...defaultProps} />);

    expect(screen.getByText('Include Uncalled Mgmt Fee')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.queryByText('MF Calculated Amount')).not.toBeInTheDocument();
  });

  it('shows the MF Calculated Amount dropdown when "Yes" is selected', async () => {
    renderWithTheme(<ManagementFeeDetails {...defaultProps} />);

    // Click on "No" to open the dropdown
    fireEvent.click(screen.getByText('No'));

    // Wait for dropdown to open and click on "Yes" option
    const yesOption = await waitFor(() => screen.getByText('Yes'));
    fireEvent.click(yesOption);

    // Verify the second dropdown appears
    await waitFor(() => {
      expect(screen.getByText('MF Calculated Amount')).toBeInTheDocument();
      expect(screen.getByText('(2 items available)')).toBeInTheDocument();
    });
  });
});
