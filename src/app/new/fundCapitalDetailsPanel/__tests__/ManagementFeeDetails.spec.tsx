import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManagementFeeDetails from '../ManagementFeeDetails';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import { CapEventLineItem } from '@/clients/CapEventPackage';
import { LineItemRow } from '@/app/new/LineItems/types';

jest.mock('@/api', () => {
  const CapEventPackageApi = { default: { getMgmtFeeLineItems: jest.fn() } };
  return {
    CapEventPackageApi,
  };
});

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    mgmtJournalEntries: {
      'entity-1': [
        {
          amount: 1000,
          batchDate: '2025-01-15',
          batchTitle: 'Q1 Management Fee',
          batchNo: 123,
          description: 'Q1 Management Fee Description',
        },
        {
          amount: 2000,
          batchDate: '2025-02-15',
          batchTitle: 'Q2 Management Fee',
          batchNo: 456,
          description: 'Q2 Management Fee Description',
        },
      ],
    },
    entitiesLineItem: new Map(),
    setEntitiesLineItem: jest.fn(),
  },
}));

import { capEventSettingsStore } from '@/stores';
import { CapEventPackageApi } from '@/api';

const mockCapEventPackageApi = CapEventPackageApi as jest.Mocked<typeof CapEventPackageApi>;
const mockCapEventSettingsStore = capEventSettingsStore as unknown as {
  mgmtJournalEntries: Record<
    string,
    Array<{ amount: number; batchDate: string; batchNo: number; description: string }>
  >;
  entitiesLineItem: Map<string, LineItemRow[]>;
  setEntitiesLineItem: jest.Mock;
};

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('ManagementFeeDetails', () => {
  const defaultProps = {
    entityId: 'entity-1',
    entityLabel: 'entity-1',
  };

  beforeEach(() => {
    jest.clearAllMocks();

    mockCapEventSettingsStore.entitiesLineItem.clear();
    (mockCapEventPackageApi.default.getMgmtFeeLineItems as jest.Mock).mockResolvedValue([]);
  });

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

  describe('handleSelectMFItem - with batchNo', () => {
    it('should fetch fee line items and merge with existing non-mgmtFee items when batchNo is provided', async () => {
      const entityLabel = 'test-entity';
      const batchNo = 123;

      // Setup existing line items in store (mix of mgmtFee and non-mgmtFee)
      const existingLineItems: LineItemRow[] = [
        {
          id: '1',
          amount: 100,
          accountNo: 'ACC-001',
          capitalCategory: 'Category1',
          callDistributionReason: 'Reason1',
          defaultDescription: 'Desc1',
          insideCommitment: 'Yes',
          investment: 'Investment1',
          allocationBasis: 'basis1',
          mgmtFee: false,
        },
        {
          id: '2',
          amount: 200,
          accountNo: 'ACC-002',
          capitalCategory: 'Category2',
          callDistributionReason: 'Reason2',
          defaultDescription: 'Desc2',
          insideCommitment: 'No',
          investment: 'Investment2',
          allocationBasis: 'basis2',
          mgmtFee: true, // This should be filtered out
        },
      ];
      mockCapEventSettingsStore.entitiesLineItem.set(entityLabel, existingLineItems);

      // Mock API response
      const mockMgmtFeeLineItems: CapEventLineItem[] = [
        {
          id: '3',
          amount: 300,
          prDate: '2025-01-15',
          prFlag: true,
          allocationBasis: 'basis3',
          account: {
            accountNo: 'ACC-003',
            category: 'Category3',
            reason: 'Reason3',
            description: 'Desc3',
            insideCmnt: true,
          },
          investment: {
            id: 'INV-001',
            title: 'Investment Title',
            name: 'Investment Name',
          },
        },
      ];
      (mockCapEventPackageApi.default.getMgmtFeeLineItems as jest.Mock).mockResolvedValue(
        mockMgmtFeeLineItems,
      );

      renderWithTheme(<ManagementFeeDetails entityId="entity-1" entityLabel={entityLabel} />);

      // Select "Yes" to show the MF dropdown
      fireEvent.click(screen.getByText('No'));
      const yesOption = await waitFor(() => screen.getByText('Yes'));
      fireEvent.click(yesOption);

      // Wait for the MF dropdown to appear
      await waitFor(() => {
        expect(screen.getByText('MF Calculated Amount')).toBeInTheDocument();
      });

      // Find all buttons and click the one associated with MF dropdown (the second dropdown)
      const buttons = screen.getAllByRole('button');
      // The MF dropdown button should be after the Include MF dropdown button
      const mfDropdownButton = buttons[1];
      fireEvent.click(mfDropdownButton);

      // Wait for dropdown to open and find the first MF item (formatted as "1,000")
      // The item should appear in a list view with testId "mgmt-entries"
      const firstMFOption = await waitFor(
        () => {
          const listView = screen.getByTestId('mgmt-entries');
          return listView.querySelector('[data-testid*="1,000"]') || screen.getByText('1,000');
        },
        { timeout: 3000 },
      );
      fireEvent.click(firstMFOption);

      // Wait for the API call
      await waitFor(() => {
        expect(mockCapEventPackageApi.default.getMgmtFeeLineItems).toHaveBeenCalledWith(
          batchNo,
          '',
        );
      });

      // Verify setEntitiesLineItem was called with merged items
      await waitFor(() => {
        expect(mockCapEventSettingsStore.setEntitiesLineItem).toHaveBeenCalledWith(
          entityLabel,
          expect.arrayContaining([
            // Should include the non-mgmtFee item
            expect.objectContaining({
              id: '1',
              mgmtFee: false,
            }),
            // Should include the new mgmtFee item (converted from CapEventLineItem)
            expect.objectContaining({
              id: '3',
              mgmtFee: true,
              accountNo: 'ACC-003',
              capitalCategory: 'Category3',
              prFlag: 'Yes',
            }),
          ]),
        );
      });

      // Verify the mgmtFee item from existing items was filtered out
      const callArgs = mockCapEventSettingsStore.setEntitiesLineItem.mock.calls[0];
      const mergedItems = callArgs[1] as LineItemRow[];
      expect(mergedItems.find((item) => item.id === '2')).toBeUndefined();
    });
  });
});
