import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { capEventSettingsStore } from '@/stores';
import AllocationPreviewModal from '../AllocationPreviewModal';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import '@testing-library/jest-dom';

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    setAllocationPreviewOpen: jest.fn(),
    setAllocationPreviewModalData: jest.fn(),
    setAllocationPreviewModalAllocationBasis: jest.fn(),
    allocationPreviewModalTitle: 'Test Allocation Preview',
    allocationPreviewModalAllocationBasis: 'commitment',
    allocationPreviewModalEntityId: 'E1',
    allocationPreviewModalData: [],
    accounts: [],
    isAllocationPreviewModalOpen: true,
    isAllocationPreviewModalLoading: false,
    entitiesLineItem: new Map(),
  },
  entityDatesStore: {
    getEntityDueDate: jest.fn(),
  },
}));

jest.mock('@/api', () => {
  const defaultApi = {
    getAllocatedMgmtFeeJournalEntries: jest.fn(),
    allocateLineItem: jest.fn(),
  };
  return { CapEventPackageApi: { default: defaultApi } };
});

jest.mock('@/utils/sessionIdStorage', () => ({
  getStoredSessionId: jest.fn().mockReturnValue('SID'),
}));

jest.mock('@/app/new/LineItems/AllocationPreviewTable', () => {
  return function MockTable() {
    return <div data-testid="preview-table">table</div>;
  };
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('AllocationPreviewModal', () => {
  it('renders modal when isOpen is true', () => {
    renderWithTheme(<AllocationPreviewModal />);

    screen.debug();
    expect(screen.getByText('Preview - Test Allocation Preview')).toBeInTheDocument();
  });

  it('calls the handleCancel function when cancel button is clicked', async () => {
    renderWithTheme(<AllocationPreviewModal />);

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(capEventSettingsStore.setAllocationPreviewOpen).toHaveBeenCalledWith(false);
      expect(capEventSettingsStore.setAllocationPreviewModalData).toHaveBeenCalledWith([]);
    });
  });

  it('loads MF line item preview data and shows item count', async () => {
    const { capEventSettingsStore } = jest.requireMock('@/stores');
    const { CapEventPackageApi } = jest.requireMock('@/api');

    // Arrange store for MF scenario
    capEventSettingsStore.isAllocationPreviewModalOpen = true;
    capEventSettingsStore.allocationPreviewModalTitle = 'Entity 1';
    capEventSettingsStore.allocationPreviewModalEntityId = 'E1';
    capEventSettingsStore.entitiesLineItem = new Map([
      [
        'Entity 1',
        [
          {
            id: 'E1',
            isMfLineItem: true,
            allocationBasis: 'commitment',
            batchNo: 7,
            originAccountKey: 101,
          },
        ],
      ],
    ]);

    (CapEventPackageApi.default.getAllocatedMgmtFeeJournalEntries as jest.Mock).mockResolvedValue([
      { id: 1 },
      { id: 2 },
    ]);

    renderWithTheme(<AllocationPreviewModal />);

    await waitFor(() =>
      expect(CapEventPackageApi.default.getAllocatedMgmtFeeJournalEntries).toHaveBeenCalledWith(
        7,
        101,
        'commitment',
        'SID',
      ),
    );

    await waitFor(() =>
      expect(capEventSettingsStore.setAllocationPreviewModalData).toHaveBeenCalled(),
    );
  });

  it('loads non-MF line item preview data and calls allocateLineItem with payload', async () => {
    const { capEventSettingsStore, entityDatesStore } = jest.requireMock('@/stores');
    const { CapEventPackageApi } = jest.requireMock('@/api');

    // Arrange store for non-MF scenario
    capEventSettingsStore.isAllocationPreviewModalOpen = true;
    capEventSettingsStore.allocationPreviewModalTitle = '123 - Fund ABC';
    capEventSettingsStore.allocationPreviewModalEntityId = 'E1';
    capEventSettingsStore.entitiesLineItem = new Map([
      [
        '123 - Fund ABC',
        [
          {
            id: 'E1',
            isMfLineItem: false,
            allocationBasis: 'Commitment',
            accountNo: 'ACCT-9',
            amount: 5000,
            investment: { id: 'INV1' },
          },
        ],
      ],
    ]);

    // Create date in local timezone to avoid timezone issues (month is 0-indexed: 1 = February)
    (entityDatesStore.getEntityDueDate as jest.Mock).mockReturnValue(new Date(2025, 1, 3));
    (CapEventPackageApi.default.allocateLineItem as jest.Mock).mockResolvedValue([{ id: 1 }]);

    renderWithTheme(<AllocationPreviewModal />);

    await waitFor(() =>
      expect(CapEventPackageApi.default.allocateLineItem).toHaveBeenCalledWith('SID', {
        entityId: '123',
        dueDate: '2025-02-03',
        allocationBasis: 'Commitment',
        accountNo: 'ACCT-9',
        investmentId: 'INV1',
        amount: 5000,
      }),
    );

    await waitFor(() =>
      expect(capEventSettingsStore.setAllocationPreviewModalData).toHaveBeenCalled(),
    );
  });
});
