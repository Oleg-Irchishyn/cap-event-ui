import {
  AccountFieldIds,
  AccountFields,
  AccountFieldTitles,
  LineItemTypes,
  USER_PROVIDED_OPTION,
  YesNoOptions,
} from '@/app/new/LineItems/const';
import { DropdownSearchCell } from '@/app/new/LineItems/cellComponents/DropdownSearchCell';
import { EditableCallbackParams, ICellEditorParams } from 'ag-grid-community';
import { InvestmentDropdown } from '@/app/new/LineItems/cellComponents/InvestmentDropdown';
import { AmountCell } from '@/app/new/LineItems/cellComponents/AmountCell';
import { ActionsCell } from '@/app/new/LineItems/cellComponents/ActionsCell';
import { DateCell } from '@/app/new/LineItems/cellComponents/DateCell';
import { Account } from '@/clients/ReferenceData';
import { getBySelectedCategoryAndReason, getReasons } from '@/app/new/LineItems/utils';
import { entityDatesStore } from '@/stores';

const ALLOCATION_BASIS_MOCK_OPTIONS = [
  'Commitment',
  'Contribution Deal',
  'Contribution All',
  'Unfunded',
  'Contribution Deal Parent',
];

type ColumnDefProp = {
  accounts: Account[];
  isMultiLineItems: boolean;
  editableCallback: (params: EditableCallbackParams, requireEdit?: boolean) => boolean;
  level?: string;
  entityKey?: string;
};

export const getCategories = (accounts: Account[]) => {
  return Array.from(new Set(accounts.map((account) => account.capitalCategory)));
};

export const getAllocationBasisOptions = (level?: string) => {
  return [USER_PROVIDED_OPTION, ...ALLOCATION_BASIS_MOCK_OPTIONS].filter((item) => {
    if (level === LineItemTypes.group) {
      return true;
    }
    return item !== USER_PROVIDED_OPTION;
  });
};

export const cellEditorsParamsCallback = (
  params: ICellEditorParams,
  key: string,
  accounts: Account[],
  entityKey?: string,
) => {
  const selectedCategory = params.data?.capitalCategory;
  const selectedReason = params.data?.callDistributionReason;

  switch (key) {
    case AccountFields.callDistributionReason: {
      const possibleValues = getReasons(selectedCategory, accounts);
      return { options: possibleValues };
    }

    case AccountFields.defaultDescription: {
      const possibleValues = getBySelectedCategoryAndReason(
        selectedCategory,
        selectedReason,
        AccountFields.defaultDescription,
        accounts,
      );
      return {
        options: possibleValues,
        withAddingFromSearch: true,
        searchPlaceholder: 'Search or Add New',
      };
    }

    case AccountFields.insideCommitment: {
      const possibleValues = getBySelectedCategoryAndReason(
        selectedCategory,
        selectedReason,
        AccountFields.insideCommitment,
        accounts,
      );
      return { options: possibleValues };
    }

    case AccountFields.prFlag: {
      return {
        options: YesNoOptions,
        defaultValue: YesNoOptions[0],
      };
    }

    case AccountFields.prDate: {
      return { defaultValue: entityDatesStore.getEntityDueDate(entityKey ?? '') };
    }
  }
};

export const fundGroupColumnDef = ({
  accounts,
  isMultiLineItems,
  editableCallback,
  level = LineItemTypes.group,
  entityKey,
}: ColumnDefProp) => [
  ...(isMultiLineItems
    ? [
        {
          headerName: '',
          field: 'drag',
          rowDrag: true,
          flex: 1,
          maxWidth: 15,
          cellStyle: { padding: '0px' },
        },
      ]
    : []),
  {
    colId: AccountFieldIds[AccountFields.capitalCategory],
    headerName: AccountFieldTitles[AccountFields.capitalCategory],
    field: AccountFields.capitalCategory,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    flex: 1,
    cellEditorParams: { options: getCategories(accounts) },
    cellStyle: { padding: '0px' },
  },
  {
    colId: AccountFieldIds[AccountFields.callDistributionReason],
    headerName: AccountFieldTitles[AccountFields.callDistributionReason],
    field: AccountFields.callDistributionReason,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    flex: 1,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.callDistributionReason, accounts),
  },
  {
    colId: AccountFieldIds[AccountFields.defaultDescription],
    headerName: AccountFieldTitles[AccountFields.defaultDescription],
    field: AccountFields.defaultDescription,
    editable: editableCallback,
    flex: 1,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.defaultDescription, accounts),
  },
  {
    colId: AccountFieldIds[AccountFields.insideCommitment],
    headerName: AccountFieldTitles[AccountFields.insideCommitment],
    field: AccountFields.insideCommitment,
    editable: editableCallback,
    flex: 1,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.insideCommitment, accounts),
  },
  {
    colId: AccountFieldIds[AccountFields.investment],
    headerName: AccountFieldTitles[AccountFields.investment],
    field: AccountFields.investment,
    editable: editableCallback,
    flex: 1,
    cellRenderer: InvestmentDropdown,
    cellEditor: InvestmentDropdown,
    cellStyle: { padding: '0px' },
  },
  {
    colId: AccountFieldIds[AccountFields.allocationBasis],
    headerName: AccountFieldTitles[AccountFields.allocationBasis],
    field: AccountFields.allocationBasis,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    flex: 1,
    cellStyle: { padding: '0px' },
    cellEditorParams: {
      options: getAllocationBasisOptions(level),
    },
  },
  {
    colId: AccountFieldIds[AccountFields.amount],
    headerName: AccountFieldTitles[AccountFields.amount],
    field: AccountFields.amount,
    cellRenderer: AmountCell,
    editable: editableCallback,
    flex: 1,
    headerClass: 'custom-header',
    suppressKeyboardEvent: () => true,
  },
  {
    colId: AccountFieldIds[AccountFields.actions],
    headerName: AccountFieldTitles[AccountFields.actions],
    flex: 0.5,
    cellRenderer: ActionsCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: { level, entityKey: entityKey ?? '' },
  },
];

export const entityColumnDef = ({
  accounts,
  isMultiLineItems,
  editableCallback,
  level = LineItemTypes.entity,
  entityKey,
}: ColumnDefProp) => [
  ...(isMultiLineItems
    ? [
        {
          headerName: '',
          field: 'drag',
          rowDrag: true,
          flex: 1,
          maxWidth: 15,
          cellStyle: { padding: '0px' },
        },
      ]
    : []),
  {
    colId: AccountFieldIds[AccountFields.capitalCategory],
    headerName: AccountFieldTitles[AccountFields.capitalCategory],
    field: AccountFields.capitalCategory,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    flex: 1,
    cellEditorParams: { options: getCategories(accounts) },
    cellStyle: { padding: '0px' },
  },
  {
    colId: AccountFieldIds[AccountFields.callDistributionReason],
    headerName: AccountFieldTitles[AccountFields.callDistributionReason],
    field: AccountFields.callDistributionReason,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    flex: 1,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.callDistributionReason, accounts),
  },
  {
    colId: AccountFieldIds[AccountFields.defaultDescription],
    headerName: AccountFieldTitles[AccountFields.defaultDescription],
    field: AccountFields.defaultDescription,
    editable: editableCallback,
    flex: 1,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.defaultDescription, accounts),
  },
  {
    colId: AccountFieldIds[AccountFields.insideCommitment],
    headerName: AccountFieldTitles[AccountFields.insideCommitment],
    field: AccountFields.insideCommitment,
    editable: editableCallback,
    flex: 1,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.insideCommitment, accounts),
  },
  {
    colId: AccountFieldIds[AccountFields.investment],
    headerName: AccountFieldTitles[AccountFields.investment],
    field: AccountFields.investment,
    editable: editableCallback,
    flex: 1,
    cellRenderer: InvestmentDropdown,
    cellEditor: InvestmentDropdown,
    cellStyle: { padding: '0px' },
  },
  {
    colId: AccountFieldIds[AccountFields.prDate],
    headerName: AccountFieldTitles[AccountFields.prDate],
    field: AccountFields.prDate,
    editable: editableCallback,
    cellRenderer: DateCell,
    cellEditor: DateCell,
    cellStyle: { padding: '0px' },
    maxWidth: 120,
    // Satisfy AG Grid object data type requirements
    valueFormatter: ({ value }: { value: unknown }) =>
      value instanceof Date ? value.toLocaleDateString() : ((value as string) ?? ''),
    valueParser: (params: { newValue: unknown }) => params.newValue,
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.prDate, accounts, entityKey),
  },
  {
    colId: AccountFieldIds[AccountFields.prFlag],
    headerName: AccountFieldTitles[AccountFields.prFlag],
    field: AccountFields.prFlag,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    maxWidth: 100,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.prFlag, accounts, entityKey),
  },
  {
    colId: AccountFieldIds[AccountFields.allocationBasis],
    headerName: AccountFieldTitles[AccountFields.allocationBasis],
    field: AccountFields.allocationBasis,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    flex: 1,
    cellStyle: { padding: '0px' },
    cellEditorParams: {
      options: getAllocationBasisOptions(level),
    },
  },
  {
    colId: AccountFieldIds[AccountFields.amount],
    headerName: AccountFieldTitles[AccountFields.amount],
    field: AccountFields.amount,
    cellRenderer: AmountCell,
    editable: editableCallback,
    flex: 1,
    headerClass: 'custom-header',
    suppressKeyboardEvent: () => true,
  },
  {
    colId: AccountFieldIds[AccountFields.actions],
    headerName: AccountFieldTitles[AccountFields.actions],
    flex: 0.5,
    cellRenderer: ActionsCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: { level, entityKey: entityKey ?? '' },
  },
];
