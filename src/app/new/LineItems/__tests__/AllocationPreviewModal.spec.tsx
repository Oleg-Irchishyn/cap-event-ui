import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { capEventSettingsStore } from '@/stores';
import { AllocationPreviewTableData } from '../types';
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
    allocationPreviewModalData: [],
    isAllocationPreviewModalOpen: true,
    isAllocationPreviewModalLoading: false,
  },
}));

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

describe('AllocationPreviewModal', () => {
  const mockData: AllocationPreviewTableData[] = [
    {
      optOut: false,
      readOnly: false,
      rounded: true,
      investor: 'Investor 1',
      classID: 'class1',
      additionalInvestorType: 'Type A',
      customerId: 'CUST123',
      customerName: 'Customer One',
      department: 'Sales',
      commitment: 100000,
      investedCapital: 50000,
      unfunded: 20000,
      managementFee: 5000,
      managementFeePercentage: 5,
      amount: 20000,
      originalAmount: 20000,
      allocatedAmount: 15000,
      allocatedAmountNotRounded: 14800,
      isTransferEntry: false,
      trType: 1,
      hasZeroCtb: false,
      investorToRound: false,
      location: 'US',
      dataPoints: 'Data Point A',
      isAggregated: false,
      lineItemAmount: 20000,
    },
  ];

  it('renders modal when isOpen is true', () => {
    renderWithTheme(
      <AllocationPreviewModal isOpen={true} title="Test Allocation Preview" data={mockData} />,
    );

    screen.debug();
    expect(screen.getByText('Preview - Test Allocation Preview')).toBeInTheDocument();
  });

  it('does not render modal when isOpen is false', () => {
    renderWithTheme(
      <AllocationPreviewModal isOpen={false} title="Test Allocation Preview" data={mockData} />,
    );

    expect(screen.queryByText('Preview - Test Allocation Preview')).toBeNull();
  });

  it('calls the handleCancel function when cancel button is clicked', async () => {
    renderWithTheme(
      <AllocationPreviewModal isOpen={true} title="Test Allocation Preview" data={mockData} />,
    );

    const cancelButton = screen.getByText('Cancel');
    fireEvent.click(cancelButton);

    await waitFor(() => {
      expect(capEventSettingsStore.setAllocationPreviewOpen).toHaveBeenCalledWith(false);
      expect(capEventSettingsStore.setAllocationPreviewModalData).toHaveBeenCalledWith([]);
      expect(capEventSettingsStore.setAllocationPreviewModalAllocationBasis).toHaveBeenCalledWith(
        '',
      );
    });
  });
});
