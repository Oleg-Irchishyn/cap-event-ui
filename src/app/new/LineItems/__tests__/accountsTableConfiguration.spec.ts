import {
  getCategories,
  getAllocationBasisOptions,
  cellEditorsParamsCallback,
  fundGroupColumnDef,
  entityColumnDef,
  getAccountNames,
  otherCellEditorsParamsCallback,
  otherEntityColumnDef,
} from '../accountsTableConfiguration';
import { Account } from '@/clients/ReferenceData';
import { AccountFields, LineItemTypes, OtherAccountFields, USER_PROVIDED_OPTION } from '../const';
import { ICellEditorParams } from 'ag-grid-community';

jest.mock('@/stores', () => ({
  entityDatesStore: {
    getEntityDueDate: jest.fn(() => new Date('2024-01-01')),
  },
  capEventSettingsStore: {
    allocationBasis: [],
  },
}));

jest.mock('../utils', () => ({
  getReasons: jest.fn(() => ['Reason 1', 'Reason 2']),
  getBySelectedCategoryAndReason: jest.fn(() => ['Option 1', 'Option 2']),
  getKeyValuesByAccountName: jest.fn(() => ['Description 1', 'Description 2']),
}));

describe('accountsTableConfiguration', () => {
  const mockAccounts: Account[] = [
    {
      capitalCategory: 'Category A',
      callDistributionReason: 'Reason 1',
      accountName: 'Account 1',
      defaultDescription: 'Description 1',
    } as Account,
    {
      capitalCategory: 'Category B',
      callDistributionReason: 'Reason 2',
      accountName: 'Account 2',
      defaultDescription: 'Description 2',
    } as Account,
    {
      capitalCategory: 'Category A',
      callDistributionReason: 'Reason 3',
      accountName: 'Account 1',
      defaultDescription: 'Description 3',
    } as Account,
  ];

  const mockEditableCallback = jest.fn(() => true);

  describe('getCategories', () => {
    it('should return unique categories from accounts', () => {
      const result = getCategories(mockAccounts);

      expect(result).toEqual(['Category A', 'Category B']);
    });

    it('should return empty array when no accounts provided', () => {
      const result = getCategories([]);

      expect(result).toEqual([]);
    });
  });

  describe('getAllocationBasisOptions', () => {
    it('should include USER_PROVIDED_OPTION for group level', () => {
      const result = getAllocationBasisOptions(LineItemTypes.group);

      expect(result).toContain(USER_PROVIDED_OPTION);
    });

    it('should exclude USER_PROVIDED_OPTION for non-group level', () => {
      const result = getAllocationBasisOptions(LineItemTypes.entity);

      expect(result).not.toContain(USER_PROVIDED_OPTION);
    });

    it('should exclude USER_PROVIDED_OPTION when no level provided', () => {
      const result = getAllocationBasisOptions();

      expect(result).not.toContain(USER_PROVIDED_OPTION);
    });
  });

  describe('cellEditorsParamsCallback', () => {
    const mockParams = {
      data: { capitalCategory: 'Category A', callDistributionReason: 'Reason 1' },
    } as unknown as ICellEditorParams;

    it('should return correct params for callDistributionReason field', () => {
      const result = cellEditorsParamsCallback(
        mockParams,
        AccountFields.callDistributionReason,
        mockAccounts,
      );

      expect(result).toEqual({ options: ['Reason 1', 'Reason 2'] });
    });

    it('should return correct params for prFlag field', () => {
      const result = cellEditorsParamsCallback(mockParams, AccountFields.prFlag, mockAccounts);

      expect(result).toEqual({
        options: ['Yes', 'No'],
        defaultValue: 'Yes',
      });
    });

    it('should return correct params for prDate field', () => {
      const result = cellEditorsParamsCallback(
        mockParams,
        AccountFields.prDate,
        mockAccounts,
        'test-entity',
      );

      expect(result).toEqual({
        defaultValue: new Date('2024-01-01'),
      });
    });
  });

  describe('fundGroupColumnDef', () => {
    it('should return column definitions with drag column when isMultiLineItems is true', () => {
      const result = fundGroupColumnDef({
        accounts: mockAccounts,
        isMultiLineItems: true,
        editableCallback: mockEditableCallback,
      });

      expect(result[0]).toMatchObject({
        headerName: '',
        field: 'drag',
      });
      const rowDrag = (
        result[0] as unknown as {
          rowDrag: (params: { data?: { isTotalRow?: boolean } }) => boolean;
        }
      ).rowDrag;
      expect(typeof rowDrag).toBe('function');
      expect(rowDrag({ data: {} })).toBe(true);
      expect(rowDrag({ data: { isTotalRow: true } })).toBe(false);
    });

    it('should return column definitions without drag column when isMultiLineItems is false', () => {
      const result = fundGroupColumnDef({
        accounts: mockAccounts,
        isMultiLineItems: false,
        editableCallback: mockEditableCallback,
      });

      expect(result[0]).not.toMatchObject({
        field: 'drag',
      });
    });

    it('should include all required column fields', () => {
      const result = fundGroupColumnDef({
        accounts: mockAccounts,
        isMultiLineItems: false,
        editableCallback: mockEditableCallback,
      });

      const fields = result.map((col) => col.field).filter((field) => field !== undefined);

      expect(fields).toContain('capitalCategory');
      expect(fields).toContain('callDistributionReason');
      expect(fields).toContain('defaultDescription');
      expect(fields).toContain('insideCommitment');
      expect(fields).toContain('investment');
      expect(fields).toContain('allocationBasis');
      expect(fields).toContain('amount');

      // Check for actions column by looking for the column with ActionsCell renderer
      const actionsColumn = result.find((col) => col.cellRenderer?.name === 'ActionsCell');
      expect(actionsColumn).toBeDefined();
    });
  });

  describe('entityColumnDef', () => {
    it('should include prDate and prFlag columns for entity level', () => {
      const result = entityColumnDef({
        accounts: mockAccounts,
        isMultiLineItems: false,
        editableCallback: mockEditableCallback,
        level: LineItemTypes.entity,
        entityKey: 'test-entity',
      });

      const fields = result.map((col) => col.field);
      expect(fields).toContain('prDate');
      expect(fields).toContain('prFlag');
    });

    it('should include all required column fields for entity', () => {
      const result = entityColumnDef({
        accounts: mockAccounts,
        isMultiLineItems: false,
        editableCallback: mockEditableCallback,
      });

      const fields = result.map((col) => col.field).filter((field) => field !== undefined);

      expect(fields).toContain('capitalCategory');
      expect(fields).toContain('callDistributionReason');
      expect(fields).toContain('defaultDescription');
      expect(fields).toContain('insideCommitment');
      expect(fields).toContain('investment');
      expect(fields).toContain('prDate');
      expect(fields).toContain('prFlag');
      expect(fields).toContain('allocationBasis');
      expect(fields).toContain('amount');

      // Check for actions column by looking for the column with ActionsCell renderer
      const actionsColumn = result.find((col) => col.cellRenderer?.name === 'ActionsCell');
      expect(actionsColumn).toBeDefined();
    });
  });

  describe('getAccountNames', () => {
    it('should return unique account names', () => {
      const result = getAccountNames(mockAccounts);
      expect(result).toEqual(['Account 1', 'Account 2']);
    });
  });

  describe('otherCellEditorsParamsCallback', () => {
    const mockParams = {
      data: { accountName: 'Account 1', defaultDescription: 'Description 1' },
    } as unknown as ICellEditorParams;

    it('should return values for description', () => {
      const result = otherCellEditorsParamsCallback(
        mockParams,
        OtherAccountFields.defaultDescription,
        mockAccounts,
      );
      expect(result).toEqual({ options: ['Description 1', 'Description 2'] });
    });

    it('should return correct params for prFlag field', () => {
      const result = otherCellEditorsParamsCallback(
        mockParams,
        OtherAccountFields.prFlag,
        mockAccounts,
      );

      expect(result).toEqual({
        options: ['Yes', 'No'],
        defaultValue: 'Yes',
      });
    });

    it('should return correct params for prDate field', () => {
      const result = otherCellEditorsParamsCallback(
        mockParams,
        OtherAccountFields.prDate,
        mockAccounts,
        'test-entity',
      );

      expect(result).toEqual({
        defaultValue: new Date('2024-01-01'),
      });
    });
  });

  describe('otherEntityColumnDef', () => {
    it('should return column definitions without drag column when isMultiLineItems is false', () => {
      const result = otherEntityColumnDef({
        accounts: mockAccounts,
        isMultiLineItems: false,
        editableCallback: mockEditableCallback,
      });

      expect(result[0]).not.toMatchObject({
        field: 'drag',
      });
    });

    it('should return column definitions with drag column when isMultiLineItems is true', () => {
      const result = otherEntityColumnDef({
        accounts: mockAccounts,
        isMultiLineItems: true,
        editableCallback: mockEditableCallback,
      });

      expect(result[0]).toMatchObject({
        field: 'drag',
      });
    });
  });
});
