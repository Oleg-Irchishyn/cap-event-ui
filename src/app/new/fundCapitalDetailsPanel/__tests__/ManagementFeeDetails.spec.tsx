import React from 'react';
import { render, screen, fireEvent, waitFor, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import ManagementFeeDetails from '../ManagementFeeDetails';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';

jest.mock('@/api', () => ({
  CapEventPackageApi: {
    default: {
      getMgmtFeeLineItems: jest.fn(),
    },
  },
}));

jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => ({
    error: jest.fn(),
  }),
}));

jest.mock('@/utils/sessionIdStorage', () => ({
  getStoredSessionId: jest.fn().mockReturnValue('session-123'),
}));

jest.mock('@/utils/prepareNewRow', () => ({
  prepareNewRow: jest.fn(() => ({
    id: 'new-row-id',
    capitalCategory: '',
    callDistributionReason: '',
    defaultDescription: '',
    insideCommitment: '',
    investment: { name: '', id: '' },
    amount: 0,
    allocationBasis: '',
    accountNo: '',
  })),
}));

jest.mock('@/stores', () => {
  const state: {
    selectedMFItemBatchNo: Record<string, number | null>;
    includeMFOption: Record<string, 'Yes' | 'No'>;
    entitiesLineItem: Map<string, unknown[]>;
  } = {
    selectedMFItemBatchNo: {},
    includeMFOption: {},
    entitiesLineItem: new Map(),
  };

  const getSelectedMFItemBatchNo = (entityId: string) =>
    state.selectedMFItemBatchNo[entityId] ?? null;
  const getIncludeMFOption = (entityId: string) => state.includeMFOption[entityId] ?? 'No';
  const setSelectedMFItemBatchNo = (entityId: string, batchNo: number | null) => {
    state.selectedMFItemBatchNo[entityId] = batchNo;
  };
  const setIncludeMFOption = (entityId: string, option: 'Yes' | 'No') => {
    state.includeMFOption[entityId] = option;
  };

  return {
    capEventSettingsStore: {
      mgmtJournalEntries: {
        'entity-1': [
          {
            amount: 1000,
            batchDate: '2025-01-15',
            batchNo: 123,
            description: 'Q1 Management Fee',
          },
          {
            amount: 2000,
            batchDate: '2025-02-15',
            batchNo: 456,
            description: 'Q2 Management Fee',
          },
        ],
      },
      get entitiesLineItem() {
        return state.entitiesLineItem;
      },
      setEntitiesLineItem: jest.fn(),
      getSelectedMFItemBatchNo: jest.fn(getSelectedMFItemBatchNo),
      getIncludeMFOption: jest.fn(getIncludeMFOption),
      setSelectedMFItemBatchNo: jest.fn(setSelectedMFItemBatchNo),
      setIncludeMFOption: jest.fn(setIncludeMFOption),
      // Expose state for test access
      _testState: state,
    },
    entityDatesStore: {
      getEntityDueDate: jest.fn(() => new Date('2025-01-15')),
    },
  };
});

import { capEventSettingsStore } from '@/stores';
import { CapEventPackageApi } from '@/api';
import CapEventSettingsStore from '@/stores/CapEventSettingsStore';
import { LineItemRow } from '@/app/new/LineItems/types';

const mockStore = capEventSettingsStore as CapEventSettingsStore;
const mockApi = CapEventPackageApi.default.getMgmtFeeLineItems as jest.Mock;

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
    mockStore.entitiesLineItem.clear();
    mockStore.selectedMFItemBatchNo = {};
    mockStore.includeMFOption = {};

    // Ensure mocks always read from current state
    (mockStore.getSelectedMFItemBatchNo as jest.Mock).mockImplementation(
      (entityId: string) => mockStore.selectedMFItemBatchNo[entityId] ?? null,
    );
    (mockStore.getIncludeMFOption as jest.Mock).mockImplementation(
      (entityId: string) => mockStore.includeMFOption[entityId] ?? 'No',
    );
    (mockStore.setSelectedMFItemBatchNo as jest.Mock).mockImplementation(
      (entityId: string, batchNo: number | null) => {
        mockStore.selectedMFItemBatchNo[entityId] = batchNo;
      },
    );
    (mockStore.setIncludeMFOption as jest.Mock).mockImplementation(
      (entityId: string, option: 'Yes' | 'No') => {
        mockStore.includeMFOption[entityId] = option;
      },
    );

    mockApi.mockResolvedValue([]);
  });

  it('renders with default "No" option and hides MF dropdown', () => {
    renderWithTheme(<ManagementFeeDetails {...defaultProps} />);

    expect(screen.getByText('Include Uncalled Mgmt Fee')).toBeInTheDocument();
    expect(screen.getByText('No')).toBeInTheDocument();
    expect(screen.queryByText('MF Calculated Amount')).not.toBeInTheDocument();
  });

  it('clears MF selection and removes MF line items when changed from "Yes" to "No"', async () => {
    // Setup: Start with "Yes" selected and an MF item selected
    mockStore.includeMFOption['entity-1'] = 'Yes';
    mockStore.selectedMFItemBatchNo['entity-1'] = 123;
    mockStore.entitiesLineItem.set('entity-1', [
      { id: '1', isMfLineItem: false },
      { id: '2', isMfLineItem: true },
    ] as LineItemRow[]);

    renderWithTheme(<ManagementFeeDetails {...defaultProps} />);

    // Change to "No"
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    const noOption = await waitFor(() => screen.getByText('No'));
    await act(async () => {
      fireEvent.click(noOption);
    });

    // Verify MF selection was cleared
    await waitFor(() => {
      expect(mockStore.setSelectedMFItemBatchNo).toHaveBeenCalledWith('entity-1', null);
    });

    // Verify MF line items were removed
    await waitFor(() => {
      expect(mockStore.setEntitiesLineItem).toHaveBeenCalledWith(
        'entity-1',
        expect.arrayContaining([expect.objectContaining({ id: '1', isMfLineItem: false })]),
      );
    });

    const callArgs = (mockStore.setEntitiesLineItem as jest.Mock).mock.calls[0];
    const filteredItems = callArgs[1];
    expect(filteredItems.find((item: LineItemRow) => item?.isMfLineItem)).toBeUndefined();
  });
});
