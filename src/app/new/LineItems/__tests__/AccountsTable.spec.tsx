import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { ThemeProvider } from 'styled-components';
import { theme } from '@/ui/globalStyles';
import AccountsTable from '../AccountsTable';
import { capEventSettingsStore } from '@/stores';
import { ICellRendererParams } from 'ag-grid-community';
import { COMMITMENT_OPTION } from '@/const/allocationBasisOptions';

let __inheritedAllocationBasis: string | undefined;

jest.mock('@/stores', () => ({
  capEventSettingsStore: {
    accounts: [],
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
    isAllDueDatesFilled: jest.fn().mockReturnValue(true),
  },
}));

jest.mock('@/api', () => ({
  CapEventPackageApi: {
    default: {
      allocateEntities: jest.fn(),
    },
  },
}));

jest.mock('@/app/components/ConfigurationTable', () => {
  return function MockConfigurationTable({
    testId,
    columnDefs,
    rowData,
    onCellValueChanged,
    postSortRows,
  }: unknown) {
    const defs = (columnDefs as unknown as Array<Record<string, unknown>>) || [];
    const getDefByField = (field: string) => defs.find((d) => d.field === field);

    const evaluateEditable = (field: string, row: Record<string, unknown>) => {
      const def = getDefByField(field);
      if (!def) return undefined;
      const editable = def.editable;
      if (typeof editable === 'function') {
        return !!editable({
          data: row,
          colDef: def,
          column: { getColId: () => '1' },
        });
      }
      return !!editable;
    };

    const inheritedRow = {
      id: 'inherited-1',
      fundGroupLineItemInheritanceId: 'fg-1',
      capitalCategory: 'Cont - Other',
      callDistributionReason: 'Other',
      // Allow tests to inject allocation basis for inherited row
      allocationBasis: __inheritedAllocationBasis,
    };

    const normalRow = {
      id: 'row-1',
      capitalCategory: 'Cont - Other',
      callDistributionReason: 'Other',
    };

    const fieldsToCheck = [
      'callDistributionReason',
      'defaultDescription',
      'insideCommitment',
      'allocationBasis',
      'prDate',
      'prFlag',
      'investment',
      'amount',
    ];

    const editableInherited: Record<string, boolean | undefined> = {};
    const editableNormal: Record<string, boolean | undefined> = {};
    fieldsToCheck.forEach((f) => {
      editableInherited[f] = evaluateEditable(f, inheritedRow);
      editableNormal[f] = evaluateEditable(f, normalRow);
    });

    const [postSortIds, setPostSortIds] = React.useState<string[]>([]);
    const triggerPostSort = () => {
      if (typeof postSortRows !== 'function') return;
      const nodes = [
        { data: { id: 'row-1' } },
        { data: { id: 'total-row', isTotalRow: true } },
        { data: { id: 'row-2' } },
      ] as Array<{ data: Record<string, unknown> }>;
      // simulate AG Grid postSortRows hook
      (postSortRows as (args: { nodes: Array<{ data: Record<string, unknown> }> }) => void)({
        nodes,
      });
      setPostSortIds(
        nodes.map((n) => (typeof n.data.id === 'string' ? (n.data.id as string) : 'unknown')),
      );
    };

    return (
      <div data-testid={testId}>
        <div data-testid="column-defs">{JSON.stringify(columnDefs.length)}</div>
        <div data-testid="row-data">{JSON.stringify(rowData.length)}</div>
        <div data-testid="actions-cell-params">
          {(() => {
            const last = defs[defs.length - 1] || {};
            return JSON.stringify((last as { cellEditorParams?: unknown }).cellEditorParams ?? {});
          })()}
        </div>
        <div data-testid="editable-map-inherited">{JSON.stringify(editableInherited)}</div>
        <div data-testid="editable-map-normal">{JSON.stringify(editableNormal)}</div>
        <div data-testid="post-sort-result">{JSON.stringify(postSortIds)}</div>
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
        <button data-testid="trigger-post-sort" onClick={triggerPostSort}>
          Trigger Post Sort
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
  return function MockImage() {
    return <div data-testid="mock-next-image" />;
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

    it('disables immediately and prevents duplicate requests while applying', async () => {
      const props = {
        ...defaultProps,
        level: 'group',
      };

      const { capEventSettingsStore: store, entityDatesStore } = jest.requireMock('@/stores');

      store.fundGroupsLineItem = [{ id: 'fg-1', allocationBasis: COMMITMENT_OPTION, amount: 100 }];

      store.fundEntities = [{ id: 'e-1', label: 'Entity 1', state: 'S' }];

      entityDatesStore.getEntityDueDate.mockReturnValue(new Date('2024-01-01'));

      const { CapEventPackageApi } = jest.requireMock('@/api');

      let resolveAllocate!: (value?: unknown) => void;
      const pending = new Promise((res) => {
        resolveAllocate = res;
      });

      CapEventPackageApi.default.allocateEntities.mockReturnValue(pending);

      renderWithTheme(<AccountsTable {...props} />);

      const applyButton = screen.getByTestId('apply-test-accounts-table-test-entity');
      expect(applyButton).toHaveAttribute('data-is-disabled', 'false');

      fireEvent.click(applyButton);
      expect(applyButton).toHaveAttribute('data-is-disabled', 'true');

      fireEvent.click(applyButton);

      await waitFor(() =>
        expect(CapEventPackageApi.default.allocateEntities).toHaveBeenCalledTimes(1),
      );

      resolveAllocate({});
      await waitFor(() =>
        expect(screen.getByTestId('apply-test-accounts-table-test-entity')).toHaveAttribute(
          'data-is-disabled',
          'false',
        ),
      );
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

  describe('Commitment allocation mapping', () => {
    it('maps allocated amounts to correct fund group rows by id', async () => {
      const props = {
        ...defaultProps,
        level: 'group',
      };

      const { capEventSettingsStore: store, entityDatesStore } = jest.requireMock('@/stores');
      const { CapEventPackageApi } = jest.requireMock('@/api');

      store.fundGroupsLineItem = [
        { id: 'fg-1', allocationBasis: COMMITMENT_OPTION, amount: 9000 },
        { id: 'fg-2', allocationBasis: COMMITMENT_OPTION, amount: 4000 },
      ];

      store.fundEntities = [
        { id: '73301-02', label: '73301-02 - Entity 2', state: 'S' },
        { id: '73301-01', label: '73301-01 - Entity 1', state: 'S' },
      ];

      entityDatesStore.getEntityDueDate.mockReturnValue(new Date('2024-01-01'));

      CapEventPackageApi.default.allocateEntities
        .mockResolvedValueOnce({ '73301-01': 6000, '73301-02': 3000 })
        .mockResolvedValueOnce({ '73301-01': 1000, '73301-02': 3000 });

      renderWithTheme(<AccountsTable {...props} />);

      const applyButton = screen.getByTestId('apply-test-accounts-table-test-entity');
      fireEvent.click(applyButton);

      await waitFor(() =>
        expect(CapEventPackageApi.default.allocateEntities).toHaveBeenCalledTimes(2),
      );
      await waitFor(() => expect(store.setEntitiesLineItem).toHaveBeenCalledTimes(2));

      const firstCall = (store.setEntitiesLineItem as jest.Mock).mock.calls[0];
      expect(firstCall[0]).toContain('73301-02');
      const firstEntityRows = firstCall[1] as Array<Record<string, unknown>>;
      // Rows are created in the same order as capEventSettingsStore.fundGroupsLineItem
      const rowFg1Entity2 = firstEntityRows[0];
      const rowFg2Entity2 = firstEntityRows[1];
      expect(rowFg1Entity2?.amount).toBe(3000);
      expect(rowFg2Entity2?.amount).toBe(3000);

      const secondCall = (store.setEntitiesLineItem as jest.Mock).mock.calls[1];
      expect(secondCall[0]).toContain('73301-01');
      const secondEntityRows = secondCall[1] as Array<Record<string, unknown>>;
      const rowFg1Entity1 = secondEntityRows[0];
      const rowFg2Entity1 = secondEntityRows[1];
      expect(rowFg1Entity1?.amount).toBe(6000);
      expect(rowFg2Entity1?.amount).toBe(1000);
    });
  });

  describe('ActionsCell params for DuplicateRowCell', () => {
    it('passes correct params at group level', () => {
      const props = {
        ...defaultProps,
        level: 'group',
      };

      renderWithTheme(<AccountsTable {...props} />);
      const paramsJson = screen.getByTestId('actions-cell-params').textContent || '{}';
      const params = JSON.parse(paramsJson);
      expect(params.level).toBe('group');
      expect(params.entityKey).toBe('');
    });

    it('passes correct params at entity level', () => {
      const props = {
        ...defaultProps,
        level: 'entity',
        entityKey: 'entity-123',
      };

      renderWithTheme(<AccountsTable {...props} />);
      const paramsJson = screen.getByTestId('actions-cell-params').textContent || '{}';
      const params = JSON.parse(paramsJson);
      expect(params.level).toBe('entity');
      expect(params.entityKey).toBe('entity-123');
    });
  });

  describe('Editability for inherited rows', () => {
    it('disables Call/Distribution Reason, Notice Line Description, Inside CMNT and Investmentfor inherited rows', () => {
      renderWithTheme(<AccountsTable {...defaultProps} />);
      const inheritedJson = screen.getByTestId('editable-map-inherited').textContent || '{}';
      const inherited = JSON.parse(inheritedJson);

      expect(inherited.callDistributionReason).toBe(false);
      expect(inherited.defaultDescription).toBe(false);
      expect(inherited.insideCommitment).toBe(false);
      expect(inherited.investment).toBe(false);
    });

    it('allows other fields to follow normal rules on inherited rows', () => {
      renderWithTheme(<AccountsTable {...defaultProps} />);
      const inheritedJson = screen.getByTestId('editable-map-inherited').textContent || '{}';
      const inherited = JSON.parse(inheritedJson);

      expect(inherited.allocationBasis).toBe(true);
      expect(inherited.prDate).toBe(true);
      expect(inherited.prFlag).toBe(true);
      expect(inherited.amount).toBe(true);
    });

    it('keeps those fields editable for non-inherited rows when applicable', () => {
      renderWithTheme(<AccountsTable {...defaultProps} />);
      const normalJson = screen.getByTestId('editable-map-normal').textContent || '{}';
      const normal = JSON.parse(normalJson);

      expect(normal.callDistributionReason).toBe(true);
      expect(normal.defaultDescription).toBe(true);
      expect(normal.insideCommitment).toBe(true);
    });
  });

  describe('Total row post-sort behavior', () => {
    it('moves total row to the end after sorting', () => {
      renderWithTheme(<AccountsTable {...defaultProps} />);

      fireEvent.click(screen.getByTestId('trigger-post-sort'));

      const resultJson = screen.getByTestId('post-sort-result').textContent || '[]';
      const ids = JSON.parse(resultJson) as string[];

      expect(ids.length).toBe(3);
      expect(ids[ids.length - 1]).toBe('total-row');
    });
  });
  describe('Amount editability on inherited rows for Commitment basis', () => {
    it('disables Amount for inherited rows when allocation basis is Commitment', () => {
      __inheritedAllocationBasis = COMMITMENT_OPTION;

      renderWithTheme(<AccountsTable {...defaultProps} />);

      const inheritedJson = screen.getByTestId('editable-map-inherited').textContent || '{}';
      const inherited = JSON.parse(inheritedJson);

      expect(inherited.amount).toBe(false);
      __inheritedAllocationBasis = undefined;
    });
  });
});
