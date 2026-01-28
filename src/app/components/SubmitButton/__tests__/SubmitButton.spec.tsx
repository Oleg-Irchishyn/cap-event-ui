import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import SubmitButton from '../SubmitButton';
import { CapEventStatus } from '@/clients/CapEventPackage';

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
}));

const mockToast = {
  success: jest.fn(),
  error: jest.fn(),
};

jest.mock('@/providers/ToastProvider', () => ({
  useToast: () => mockToast,
}));

jest.mock('@/utils/formatDate', () => ({
  formatDate: jest.fn((date: Date | null) => (date ? '2024-01-01' : '')),
}));

const mockSubmit = jest.fn();

jest.mock('@/api', () => ({
  CapEventPackageApi: {
    default: {
      submit: (...args: unknown[]) => mockSubmit(...args),
    },
  },
}));

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    getAllocationBasisId: jest.fn(),
    resetStore: jest.fn(),
    investments: [{ id: 'inv1', name: 'Investment 1', title: 'Investment 1 Title', type: 'Type1' }],
    fundEntities: [
      { id: 'ent1', label: 'Entity 1', name: 'Entity 1', state: 'SELECTED' },
      { id: 'ent2', label: 'Entity 2', name: 'Entity 2', state: 'NOT_SELECTED' },
    ],
    eventTypes: [{ id: 'type1', state: 'SELECTED' }],
    sponsors: [{ id: 'sponsor1', state: 'SELECTED' }],
    fundGroups: [{ id: 'group1', state: 'SELECTED' }],
    fundGroupsLineItem: [
      {
        inheritanceId: 'fgli1',
        investment: 'Investment 1',
        allocationBasis: 'Basis1',
        amount: 1000,
        accountNo: 'ACC001',
        capitalCategory: 'Category1',
        callDistributionReason: 'Reason1',
        defaultDescription: 'Description1',
        insideCommitment: 'Yes',
      },
    ],
    entitiesLineItem: new Map([
      [
        'Entity 1',
        [
          {
            investment: 'Investment 1',
            allocationBasis: 'Basis1',
            amount: 500,
            fundGroupLineItemInheritanceId: 'fgli1',
            prDate: new Date('2024-01-01'),
            prFlag: 'Yes',
            accountNo: 'ACC002',
            capitalCategory: 'Category2',
            callDistributionReason: 'Reason2',
            defaultDescription: 'Description2',
            insideCommitment: 'No',
          },
        ],
      ],
    ]),
  },
  entityDatesStore: {
    resetAllDates: jest.fn(),
    noticeDate: new Date('2024-01-01'),
    entityDates: {
      'Entity 1': {
        noticeDate: new Date('2024-01-01'),
        dueDate: new Date('2024-01-15'),
      },
    },
  },
  previewScreenStore: {
    isLoading: false,
    rows: [{ id: 'row-1', isAggregated: true }],
    hasAggregatedLineItems: jest.fn(() => true),
    withAggregatedLineItems: jest.fn((payload: unknown) => payload),
  },
}));

const renderWithTheme = (ui: React.ReactElement) =>
  render(<ThemeProvider theme={theme}>{ui}</ThemeProvider>);

describe('SubmitButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    const stores = require('@/stores');
    stores.previewScreenStore.isLoading = false;
    stores.previewScreenStore.rows = [{ id: 'row-1', isAggregated: true }];
  });

  it('renders submit button correctly', () => {
    renderWithTheme(<SubmitButton />);

    const button = screen.getByTestId('cap-event-submit');
    expect(button).toBeInTheDocument();
    expect(screen.getByText('Save')).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });

  it('calls API and shows success toast when submission is successful', async () => {
    mockSubmit.mockResolvedValue({ data: { status: CapEventStatus.Submitted } });

    renderWithTheme(<SubmitButton />);

    const button = screen.getByTestId('cap-event-submit');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockToast.success).toHaveBeenCalledWith('Successfully Saved');
    });

    const requestParams = mockSubmit.mock.calls[0][0];
    expect(requestParams).toHaveProperty('capEvent');
    expect(requestParams).toHaveProperty('sessionId');
    const requestBody = requestParams.capEvent;
    expect(requestBody).toHaveProperty('capEventType');
    expect(requestBody).toHaveProperty('sponsor');
    expect(requestBody).toHaveProperty('fundGroup');
    expect(requestBody).toHaveProperty('entities');
    expect(requestBody).toHaveProperty('noticeDate');
  });

  it('handles API errors gracefully without crashing', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockSubmit.mockRejectedValue(new Error('API Error'));

    renderWithTheme(<SubmitButton />);

    const button = screen.getByTestId('cap-event-submit');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
      expect(mockToast.success).not.toHaveBeenCalled();
    });

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('disables button and prevents duplicate submissions while request is in flight', async () => {
    let resolvePromise: (value?: unknown) => void = () => {};

    const pending = new Promise((res) => {
      resolvePromise = res;
    });

    mockSubmit.mockReturnValue(pending);

    renderWithTheme(<SubmitButton />);

    const button = screen.getByTestId('cap-event-submit');

    fireEvent.click(button);

    await waitFor(() => {
      expect(button).toBeDisabled();
    });

    fireEvent.click(button);
    expect(mockSubmit).toHaveBeenCalledTimes(1);

    resolvePromise({ data: { status: CapEventStatus.Submitted } });

    await waitFor(() => {
      expect(button).not.toBeDisabled();
    });
  });

  it('disables submit when aggregated line items are not ready', () => {
    const stores = require('@/stores');

    stores.previewScreenStore.isLoading = false;
    stores.previewScreenStore.rows = [];
    stores.previewScreenStore.hasAggregatedLineItems.mockReturnValueOnce(false);

    renderWithTheme(<SubmitButton />);

    const button = screen.getByTestId('cap-event-submit');
    expect(button).toBeDisabled();
  });

  it('disables submit while preview data is loading (skeletons)', () => {
    const stores = require('@/stores');
    stores.previewScreenStore.isLoading = true;
    stores.previewScreenStore.rows = [];

    renderWithTheme(<SubmitButton />);

    const button = screen.getByTestId('cap-event-submit');
    expect(button).toBeDisabled();
  });

  it('shows tooltip on hover when enabled and hides on mouse leave', () => {
    renderWithTheme(<SubmitButton />);

    expect(screen.queryByTestId('tooltip-submit-button-tooltip')).not.toBeInTheDocument();

    const button = screen.getByTestId('cap-event-submit');

    fireEvent.mouseEnter(button);

    const tooltip = screen.getByTestId('tooltip-submit-button-tooltip');
    expect(tooltip).toBeInTheDocument();
    expect(tooltip).toHaveTextContent('Save/Update Capital Event and Create/Update Case');

    fireEvent.mouseLeave(button);
    expect(screen.queryByTestId('tooltip-submit-button-tooltip')).not.toBeInTheDocument();
  });

  it('calls getAllocationBasisId for entity line items', async () => {
    const stores = require('@/stores');
    stores.previewScreenStore.isLoading = false;
    stores.previewScreenStore.rows = [{ id: 'row-1', isAggregated: true }];
    stores.capEventSettingsStore.getAllocationBasisId.mockReturnValue('DS-CMNT');
    stores.capEventSettingsStore.entitiesLineItem = new Map([
      [
        'Entity 1',
        [
          {
            investment: { id: 'inv1', name: 'Investment 1' },
            allocationBasis: 'Basis1',
            amount: 500,
            fundGroupLineItemInheritanceId: 'fgli1',
            prDate: new Date('2024-01-01'),
            prFlag: 'Yes',
            accountNo: 'ACC002',
            capitalCategory: 'Category2',
            callDistributionReason: 'Reason2',
            defaultDescription: 'Description2',
            insideCommitment: 'No',
          },
        ],
      ],
    ]);
    mockSubmit.mockResolvedValue({ data: { status: CapEventStatus.Submitted } });

    renderWithTheme(<SubmitButton />);

    const button = screen.getByTestId('cap-event-submit');
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSubmit).toHaveBeenCalledTimes(1);
    });

    expect(stores.capEventSettingsStore.getAllocationBasisId).toHaveBeenCalledWith('Basis1');
    const requestParams = mockSubmit.mock.calls[0][0];
    expect(requestParams).toHaveProperty('capEvent');
    const requestBody = requestParams.capEvent;
    expect(requestBody.capEventEntityLineItems[0].capEventLineItems[0]).toHaveProperty(
      'allocationBasisId',
      'DS-CMNT',
    );
  });
});
