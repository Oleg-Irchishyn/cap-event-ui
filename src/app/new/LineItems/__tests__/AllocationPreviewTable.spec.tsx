import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import AllocationPreviewTable from '../AllocationPreviewTable';
import { AllocationPreviewTableData } from '../types';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { capEventSettingsStore } from '@/stores';

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    allocationPreviewModalAllocationBasis: 'commitment',
    isAllocationPreviewModalLoading: false,
  },
}));

const mockGetAllocationPreviewColumnDefs: jest.Mock = jest.fn(() => []);
jest.mock('@/utils/getAllocationPreviewColumnDefs', () => ({
  getAllocationPreviewColumnDefs: (
    fieldName: string,
    allocationBasis: string,
    isLoading?: boolean,
  ) => {
    mockGetAllocationPreviewColumnDefs(fieldName, allocationBasis, isLoading);
    return [];
  },
}));

const mockDefineColumnForAllocationPreview: jest.Mock = jest.fn(() => 'someField');
jest.mock('@/utils/definedColumnForAllocationPreview', () => ({
  defineColumnForAllocationPreview: (allocationBasis: string) => {
    mockDefineColumnForAllocationPreview(allocationBasis);
    return 'someField';
  },
}));

jest.mock('@/app/components/ConfigurationTable', () => {
  return {
    __esModule: true,
    default: ({
      testId,
      rowData,
      isLoading,
    }: {
      testId: string;
      rowData: unknown[];
      isLoading?: boolean;
    }) => (
      <div
        data-testid={prepareDataTestId('table-wrapper', testId)}
        data-row-count={Array.isArray(rowData) ? rowData.length : 0}
        data-loading={!!isLoading}
      />
    ),
  };
});

const makeRow = (
  overrides: Partial<AllocationPreviewTableData> = {},
): AllocationPreviewTableData => ({
  optOut: false,
  readOnly: false,
  rounded: false,
  investor: '',
  classID: '',
  additionalInvestorType: '',
  customerId: '',
  customerName: '',
  department: '',
  commitment: 0,
  investedCapital: 0,
  unfunded: 0,
  managementFee: 0,
  managementFeePercentage: 0,
  amount: 0,
  originalAmount: 0,
  allocatedAmount: 0,
  allocatedAmountNotRounded: 0,
  isTransferEntry: false,
  trType: 0,
  hasZeroCtb: false,
  investorToRound: false,
  location: '',
  dataPoints: '',
  isAggregated: false,
  lineItemAmount: 0,
  ...overrides,
});

describe('AllocationPreviewTable', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capEventSettingsStore.allocationPreviewModalAllocationBasis = 'commitment';
    capEventSettingsStore.isAllocationPreviewModalLoading = false;
  });

  test('renders wrapper with composed test id', () => {
    render(<AllocationPreviewTable rows={[makeRow()]} />);
    const testId = prepareDataTestId(
      'table-wrapper',
      prepareDataTestId('table', 'allocation-preview-table'),
    );
    expect(screen.getByTestId(testId)).toBeInTheDocument();
  });

  test('passes provided rows when not loading', () => {
    const rows = [makeRow({ investor: 'A' }), makeRow({ investor: 'B' })];
    capEventSettingsStore.isAllocationPreviewModalLoading = false;

    render(<AllocationPreviewTable rows={rows} />);

    const testId = prepareDataTestId(
      'table-wrapper',
      prepareDataTestId('table', 'allocation-preview-table'),
    );
    const wrapper = screen.getByTestId(testId);
    expect(wrapper).toHaveAttribute('data-row-count', '2');
  });

  test('renders 5 placeholder rows when loading and no rows provided', () => {
    capEventSettingsStore.isAllocationPreviewModalLoading = true;

    render(<AllocationPreviewTable rows={[]} />);

    const testId = prepareDataTestId(
      'table-wrapper',
      prepareDataTestId('table', 'allocation-preview-table'),
    );
    const wrapper = screen.getByTestId(testId);
    expect(wrapper).toHaveAttribute('data-row-count', '5');
  });

  test('forwards loading flag to table based on store', () => {
    capEventSettingsStore.isAllocationPreviewModalLoading = true;

    render(<AllocationPreviewTable rows={[]} />);

    const testId = prepareDataTestId(
      'table-wrapper',
      prepareDataTestId('table', 'allocation-preview-table'),
    );
    const wrapper = screen.getByTestId(testId);
    expect(wrapper).toHaveAttribute('data-loading', 'true');
  });

  test('builds column defs using derived field name and basis', () => {
    capEventSettingsStore.isAllocationPreviewModalLoading = false;
    capEventSettingsStore.allocationPreviewModalAllocationBasis = 'investedCapital';

    render(<AllocationPreviewTable rows={[makeRow()]} />);

    expect(mockDefineColumnForAllocationPreview).toHaveBeenCalledWith('investedCapital');

    expect(mockGetAllocationPreviewColumnDefs).toHaveBeenCalledWith(
      'someField',
      'investedCapital',
      false,
    );
  });
});
