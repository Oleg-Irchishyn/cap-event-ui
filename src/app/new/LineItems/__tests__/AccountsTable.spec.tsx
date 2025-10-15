import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import AccountsTable from '../AccountsTable';
import { capEventSettingsStore } from '@/stores';
import { ICellRendererParams } from 'ag-grid-community';

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    accounts: [],
    fundGroupsLineItem: [],
    isFundGroupLineItemsFilled: true,
    isFundGroupLineItemsChanged: true,
    fundGroupsLineItem: [],
    fundGroupsStateAfterApply: [],
    entitiesLineItem: new Map(),
    fundEntities: [],
    setFundGroupsLineItem: jest.fn(),
    setEntitiesLineItem: jest.fn(),
    setFundGroupsStateAfterApply: jest.fn(),
  },
  entityDatesStore: {
    getEntityDueDate: jest.fn(),
  },
}));

jest.mock('@/app/components/ConfigurationTable', () => {
  return function MockConfigurationTable({
    testId,
    columnDefs,
    rowData,
    onCellValueChanged,
  }: unknown) {
    return (
      <div data-testid={testId}>
        <div data-testid="column-defs">{JSON.stringify(columnDefs.length)}</div>
        <div data-testid="row-data">{JSON.stringify(rowData.length)}</div>
        <button
          data-testid="trigger-cell-change"
          onClick={() => {
            onCellValueChanged({
              data: { id: '1', capitalCategory: 'Test Category' },
              colDef: { field: 'capitalCategory' },
              newValue: 'New Category',
              rowIndex: 0,
              node: { id: '1' },
              column: { getColId: () => '0' },
            });
          }}
        >
          Trigger Cell Change
        </button>
      </div>
    );
  };
});

jest.mock('@/app/new/LineItems/cellComponents/DropdownSearchCell', () => {
  return function MockDropdownSearchCell(props: ICellRendererParams) {
    return <div data-testid="dropdown-search-cell">{props.value || 'Empty'}</div>;
  };
});

jest.mock('@/app/new/LineItems/cellComponents/AmountCell', () => {
  return function MockAmountCell(props: ICellRendererParams) {
    return <div data-testid="amount-cell">{props.value || 0}</div>;
  };
});

jest.mock('next/image', () => {
  return function MockImage({ src, alt, ...props }: unknown) {
    return <img src={src} alt={alt} {...props} />;
  };
});

const renderWithTheme = (component: React.ReactElement) => {
  return render(<ThemeProvider theme={theme}>{component}</ThemeProvider>);
};

const mockCapEventSettingsStore = capEventSettingsStore;

describe('AccountsTable', () => {
  const mockAccounts = [
    {
      accountNo: '1234-PL',
      capitalCategory: 'Cont - Other',
      callDistributionReason: 'Other',
      defaultDescription: 'Description for Other',
      insideCommitment: 'YES',
    },
    {
      accountNo: '567-GL',
      capitalCategory: 'Cont - Investments',
      callDistributionReason: 'Investments',
      defaultDescription: 'Description for Investments',
      insideCommitment: 'NO',
    },
    {
      accountNo: '890-RE',
      capitalCategory: 'Cont - Other',
      callDistributionReason: 'Distributions',
      defaultDescription: 'Description for Distributions',
      insideCommitment: 'YES',
    },
  ];

  const defaultProps = {
    testId: 'test-accounts-table',
    level: 'entity',
    entityKey: 'test-entity',
    setDataToStoreCallback: jest.fn(),
    lineItems: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCapEventSettingsStore.accounts = mockAccounts;
  });

  describe('Add new row functionality', () => {
    it('should add new row when add button is clicked', () => {
      renderWithTheme(<AccountsTable {...defaultProps} />);

      const addButton = screen.getByTestId('add-new-row-test-accounts-table-test-entity');
      fireEvent.click(addButton);

      expect(defaultProps.setDataToStoreCallback).toHaveBeenCalledTimes(1);
      const call = (defaultProps.setDataToStoreCallback as jest.Mock).mock.calls[0];
      expect(call[0]).toBe('test-entity');
      expect(call[1]).toHaveLength(1);
    });

    it('should not add new row when disabled', () => {
      const props = {
        ...defaultProps,
        isDisabled: true,
      };

      renderWithTheme(<AccountsTable {...props} />);

      const addButton = screen.getByTestId('add-new-row-test-accounts-table-test-entity');
      fireEvent.click(addButton);

      expect(defaultProps.setDataToStoreCallback).not.toHaveBeenCalled();
    });

    it('should show correct button state when disabled', () => {
      const props = {
        ...defaultProps,
        isDisabled: true,
      };

      renderWithTheme(<AccountsTable {...props} />);

      const addButton = screen.getByTestId('add-new-row-test-accounts-table-test-entity');
      expect(addButton).toHaveAttribute('data-is-disabled', 'true');
    });
  });

  describe('Apply button functionality', () => {
    it('should show apply button when level is group', () => {
      const props = {
        ...defaultProps,
        level: 'group',
      };

      renderWithTheme(<AccountsTable {...props} />);

      const applyButton = screen.getByTestId('apply-test-accounts-table-test-entity');
      expect(applyButton).toBeInTheDocument();
    });

    it('should not show apply button when level is not group', () => {
      renderWithTheme(<AccountsTable {...defaultProps} />);

      expect(screen.queryByTestId('apply-test-accounts-table-test-entity')).not.toBeInTheDocument();
    });

    it('should show apply button as clickable when data is changed', () => {
      const props = {
        ...defaultProps,
        level: 'group',
      };

      renderWithTheme(<AccountsTable {...props} />);

      const applyButton = screen.getByTestId('apply-test-accounts-table-test-entity');
      expect(applyButton).toHaveAttribute('data-is-disabled', 'false');
    });
  });

  describe('Cell value changes', () => {
    it('should handle cell value changes and call setDataToStoreCallback', () => {
      const setDataToStoreCallback = jest.fn();
      const props = {
        ...defaultProps,
        setDataToStoreCallback,
      };

      renderWithTheme(<AccountsTable {...props} />);

      const triggerButton = screen.getByTestId('trigger-cell-change');
      fireEvent.click(triggerButton);

      expect(setDataToStoreCallback).toHaveBeenCalledWith('test-entity', expect.any(Array));
    });
  });
});
