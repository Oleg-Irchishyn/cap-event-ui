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
    allocationPreviewModalData: [],
    isAllocationPreviewModalOpen: true,
    isAllocationPreviewModalLoading: false,
    entitiesLineItem: new Map(),
  },
}));

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
});
