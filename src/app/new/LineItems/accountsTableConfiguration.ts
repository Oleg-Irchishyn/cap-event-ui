import {
  AccountFieldIds,
  AccountFields,
  AccountFieldTitles,
  LineItemTypes,
  OtherAccountFieldIds,
  OtherAccountFields,
  OtherAccountFieldTitles,
  USER_PROVIDED_OPTION,
  YesNoOptions,
  NOTICE_LINE_DESCRIPTION_INPUT_PROPS,
} from '@/app/new/LineItems/const';
import { DropdownSearchCell } from '@/app/new/LineItems/cellComponents/DropdownSearchCell';
import {
  EditableCallbackParams,
  ICellEditorParams,
  ColDef,
  ICellRendererParams,
} from 'ag-grid-community';
import { InvestmentDropdown } from '@/app/new/LineItems/cellComponents/InvestmentDropdown';
import { AmountCell } from '@/app/new/LineItems/cellComponents/AmountCell';
import { ActionsCell } from '@/app/new/LineItems/cellComponents/ActionsCell';
import { DateCell } from '@/app/new/LineItems/cellComponents/DateCell';
import { TotalRowAmountCell } from '@/app/new/LineItems/cellComponents/TotalRowAmountCell';
import { TotalRowCategoryCell } from '@/app/new/LineItems/cellComponents/TotalRowCategoryCell';
import { DrCrCell } from '@/app/new/LineItems/cellComponents/DrCrCell';
import { Account } from '@/clients/ReferenceData';
import {
  getBySelectedCategoryAndReason,
  getKeyValuesByAccountName,
  getReasons,
} from '@/app/new/LineItems/utils';
import { entityDatesStore } from '@/stores';
import { TableHeaderWithTooltip } from '@/app/components/TableHeaderWithTooltip/TableHeaderWithTooltip';
import { TextInputCell } from '@/app/new/LineItems/cellComponents/TextInputCell';
import DeleteCell from '@/app/new/LineItems/cellComponents/DeleteCell';

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

export const getAccountNames = (accounts: Account[]) => {
  return Array.from(new Set(accounts.map((account) => account.accountName)));
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

export const otherCellEditorsParamsCallback = (
  params: ICellEditorParams,
  key: string,
  accounts: Account[],
  entityKey?: string,
) => {
  const accountName = params.data?.accountName;

  switch (key) {
    case OtherAccountFields.defaultDescription: {
      const possibleValues = getKeyValuesByAccountName(
        accountName,
        OtherAccountFields.defaultDescription,
        accounts,
      );

      return { options: possibleValues };
    }

    case OtherAccountFields.insideCommitment: {
      const possibleValues = getKeyValuesByAccountName(
        accountName,
        OtherAccountFields.insideCommitment,
        accounts,
      );

      return { options: possibleValues };
    }

    case OtherAccountFields.prFlag: {
      return {
        options: YesNoOptions,
        defaultValue: YesNoOptions[0],
      };
    }

    case OtherAccountFields.prDate: {
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
}: ColumnDefProp): ColDef[] => [
  ...(isMultiLineItems
    ? [
        {
          headerName: '',
          field: 'drag',
          rowDrag: (params: { data?: { isTotalRow?: boolean } }) => !params.data?.isTotalRow,
          pinned: 'left' as const,
          resizable: false,
          width: 15,
          cellStyle: { padding: '0px 10px' },
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
    pinned: 'left',
    resizable: true,
    minWidth: 100,
    initialWidth: 190,
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
    pinned: 'left',
    resizable: true,
    minWidth: 100,
    initialWidth: 190,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.callDistributionReason, accounts),
  },
  {
    colId: AccountFieldIds[AccountFields.defaultDescription],
    headerName: AccountFieldTitles[AccountFields.defaultDescription],
    field: AccountFields.defaultDescription,
    editable: editableCallback,
    pinned: 'left',
    minWidth: 100,
    initialWidth: 190,
    resizable: true,
    cellRenderer: TextInputCell,
    cellEditor: TextInputCell,
    cellRendererParams: NOTICE_LINE_DESCRIPTION_INPUT_PROPS,
    cellStyle: { padding: '0px' },
    suppressKeyboardEvent: () => true,
    cellEditorParams: (params: ICellEditorParams) => ({
      ...cellEditorsParamsCallback(params, AccountFields.defaultDescription, accounts),
      ...NOTICE_LINE_DESCRIPTION_INPUT_PROPS,
    }),
  },
  {
    colId: AccountFieldIds[AccountFields.insideCommitment],
    headerName: AccountFieldTitles[AccountFields.insideCommitment],
    field: AccountFields.insideCommitment,
    editable: editableCallback,
    minWidth: 164,
    flex: 1,
    resizable: true,
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
    minWidth: 190,
    flex: 1,
    resizable: true,
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
    minWidth: 190,
    flex: 1,
    resizable: true,
    cellStyle: { padding: '0px' },
    cellEditorParams: {
      options: getAllocationBasisOptions(level),
    },
  },
  {
    colId: AccountFieldIds[AccountFields.amount],
    headerName: AccountFieldTitles[AccountFields.amount],
    headerComponent: TableHeaderWithTooltip,
    headerComponentParams: {
      headerAlignment: 'flex-end',
      tooltipMessage:
        'Input Contributions as positive amounts, and Distributions as negative amounts',
    },
    field: AccountFields.amount,
    cellRendererSelector: (params: ICellRendererParams) =>
      params.data?.isTotalRow ? { component: TotalRowAmountCell } : { component: AmountCell },
    editable: editableCallback,
    pinned: 'right',
    minWidth: 100,
    initialWidth: 120,
    resizable: true,
    headerClass: 'custom-header',
    cellStyle: { padding: '0px 8px' },
    suppressKeyboardEvent: () => true,
  },
  {
    colId: AccountFieldIds[AccountFields.drCr],
    headerName: AccountFieldTitles[AccountFields.drCr],
    field: AccountFields.drCr,
    valueGetter: ({ data }) => data?.amount,
    cellRenderer: DrCrCell,
    editable: false,
    pinned: 'right',
    minWidth: 40,
    initialWidth: 52,
    resizable: true,
    cellStyle: { padding: '0px' },
    suppressKeyboardEvent: () => true,
  },
  {
    colId: AccountFieldIds[AccountFields.actions],
    headerName: AccountFieldTitles[AccountFields.actions],
    pinned: 'right',
    minWidth: 50,
    initialWidth: 96,
    resizable: true,
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
}: ColumnDefProp): ColDef[] => [
  ...(isMultiLineItems
    ? [
        {
          headerName: '',
          field: 'drag',
          rowDrag: (params: { data?: { isTotalRow?: boolean } }) => !params.data?.isTotalRow,
          pinned: 'left' as const,
          resizable: false,
          width: 15,
          cellStyle: { padding: '0 10px' },
        },
      ]
    : []),
  {
    colId: AccountFieldIds[AccountFields.capitalCategory],
    headerName: AccountFieldTitles[AccountFields.capitalCategory],
    field: AccountFields.capitalCategory,
    cellRendererSelector: (params: ICellRendererParams) =>
      params.data?.isTotalRow
        ? { component: TotalRowCategoryCell }
        : { component: DropdownSearchCell },
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    pinned: 'left',
    minWidth: 100,
    initialWidth: 190,
    resizable: true,
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
    pinned: 'left',
    minWidth: 100,
    initialWidth: 190,
    resizable: true,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      cellEditorsParamsCallback(params, AccountFields.callDistributionReason, accounts),
  },
  {
    colId: AccountFieldIds[AccountFields.defaultDescription],
    headerName: AccountFieldTitles[AccountFields.defaultDescription],
    field: AccountFields.defaultDescription,
    editable: editableCallback,
    pinned: 'left',
    minWidth: 100,
    initialWidth: 190,
    resizable: true,
    cellRenderer: TextInputCell,
    cellEditor: TextInputCell,
    cellRendererParams: NOTICE_LINE_DESCRIPTION_INPUT_PROPS,
    cellStyle: { padding: '0px' },
    suppressKeyboardEvent: () => true,
    cellEditorParams: (params: ICellEditorParams) => ({
      ...cellEditorsParamsCallback(params, AccountFields.defaultDescription, accounts),
      ...NOTICE_LINE_DESCRIPTION_INPUT_PROPS,
    }),
  },
  {
    colId: AccountFieldIds[AccountFields.insideCommitment],
    headerName: AccountFieldTitles[AccountFields.insideCommitment],
    field: AccountFields.insideCommitment,
    editable: editableCallback,
    minWidth: 164,
    flex: 1,
    resizable: true,
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
    minWidth: 190,
    flex: 1,
    resizable: true,
    cellRenderer: InvestmentDropdown,
    cellEditor: InvestmentDropdown,
    cellStyle: { padding: '0px' },
  },
  {
    colId: AccountFieldIds[AccountFields.prDate],
    headerName: AccountFieldTitles[AccountFields.prDate],
    field: AccountFields.prDate,
    headerComponent: TableHeaderWithTooltip,
    headerComponentParams: {
      tooltipMessage: 'Preferred Return Date',
    },
    editable: editableCallback,
    cellRenderer: DateCell,
    cellEditor: DateCell,
    cellStyle: { padding: '0px' },
    minWidth: 100,
    maxWidth: 120,
    resizable: true,
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
    headerComponent: TableHeaderWithTooltip,
    headerComponentParams: {
      tooltipMessage: 'Preferred Return Inclusion',
    },
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    minWidth: 100,
    maxWidth: 120,
    resizable: true,
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
    minWidth: 190,
    flex: 1,
    resizable: true,
    cellStyle: { padding: '0px' },
    cellEditorParams: {
      options: getAllocationBasisOptions(level),
    },
  },
  {
    colId: AccountFieldIds[AccountFields.amount],
    headerName: AccountFieldTitles[AccountFields.amount],
    headerComponent: TableHeaderWithTooltip,
    headerComponentParams: {
      headerAlignment: 'flex-end',
      tooltipMessage:
        'Input Contributions as positive amounts, and Distributions as negative amounts',
    },
    field: AccountFields.amount,
    cellRendererSelector: (params: ICellRendererParams) =>
      params.data?.isTotalRow ? { component: TotalRowAmountCell } : { component: AmountCell },
    editable: editableCallback,
    pinned: 'right',
    minWidth: 100,
    initialWidth: 120,
    resizable: true,
    cellStyle: { padding: '0px 8xp' },
    headerClass: 'custom-header',
    suppressKeyboardEvent: () => true,
  },
  {
    colId: AccountFieldIds[AccountFields.drCr],
    headerName: AccountFieldTitles[AccountFields.drCr],
    field: AccountFields.drCr,
    valueGetter: ({ data }) => data?.amount,
    cellRenderer: DrCrCell,
    editable: false,
    pinned: 'right',
    minWidth: 40,
    initialWidth: 52,
    resizable: true,
    cellStyle: { padding: '0px' },
    suppressKeyboardEvent: () => true,
  },
  {
    colId: AccountFieldIds[AccountFields.actions],
    headerName: AccountFieldTitles[AccountFields.actions],
    pinned: 'right',
    minWidth: 50,
    initialWidth: 96,
    resizable: true,
    cellRenderer: ActionsCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: { level, entityKey: entityKey ?? '' },
  },
];

export const otherEntityColumnDef = ({
  accounts,
  isMultiLineItems,
  editableCallback,
  level = LineItemTypes.entity,
  entityKey,
}: ColumnDefProp): ColDef[] => [
  ...(isMultiLineItems
    ? [
        {
          headerName: '',
          field: 'drag',
          rowDrag: (params: { data?: { isTotalRow?: boolean } }) => !params.data?.isTotalRow,
          pinned: 'left' as const,
          resizable: false,
          width: 15,
          cellStyle: { padding: '0 10px' },
        },
      ]
    : []),
  {
    colId: OtherAccountFieldIds[OtherAccountFields.accountName],
    headerName: OtherAccountFieldTitles[OtherAccountFields.accountName],
    field: OtherAccountFields.accountName,
    cellRendererSelector: (params: ICellRendererParams) =>
      params.data?.isTotalRow
        ? { component: TotalRowCategoryCell }
        : { component: DropdownSearchCell },
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    pinned: 'left',
    minWidth: 100,
    initialWidth: 190,
    resizable: true,
    cellEditorParams: { options: getAccountNames(accounts) },
    cellStyle: { padding: '0px' },
  },
  {
    colId: OtherAccountFieldIds[OtherAccountFields.defaultDescription],
    headerName: OtherAccountFieldTitles[OtherAccountFields.defaultDescription],
    field: OtherAccountFields.defaultDescription,
    editable: editableCallback,
    pinned: 'left',
    minWidth: 100,
    initialWidth: 190,
    resizable: true,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      otherCellEditorsParamsCallback(params, OtherAccountFields.defaultDescription, accounts),
  },
  {
    colId: OtherAccountFieldIds[OtherAccountFields.insideCommitment],
    headerName: OtherAccountFieldTitles[OtherAccountFields.insideCommitment],
    field: OtherAccountFields.insideCommitment,
    editable: editableCallback,
    minWidth: 164,
    flex: 1,
    resizable: true,
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      otherCellEditorsParamsCallback(params, OtherAccountFields.insideCommitment, accounts),
  },
  {
    colId: OtherAccountFieldIds[OtherAccountFields.investment],
    headerName: OtherAccountFieldTitles[OtherAccountFields.investment],
    field: OtherAccountFields.investment,
    editable: editableCallback,
    minWidth: 190,
    flex: 1,
    resizable: true,
    cellRenderer: InvestmentDropdown,
    cellEditor: InvestmentDropdown,
    cellStyle: { padding: '0px' },
  },
  {
    colId: OtherAccountFieldIds[OtherAccountFields.prDate],
    headerName: OtherAccountFieldTitles[OtherAccountFields.prDate],
    field: OtherAccountFields.prDate,
    headerComponent: TableHeaderWithTooltip,
    headerComponentParams: {
      tooltipMessage: 'Preferred Return Date',
    },
    editable: editableCallback,
    cellRenderer: DateCell,
    cellEditor: DateCell,
    cellStyle: { padding: '0px' },
    minWidth: 100,
    maxWidth: 120,
    resizable: true,
    // Satisfy AG Grid object data type requirements
    valueFormatter: ({ value }: { value: unknown }) =>
      value instanceof Date ? value.toLocaleDateString() : ((value as string) ?? ''),
    valueParser: (params: { newValue: unknown }) => params.newValue,
    cellEditorParams: (params: ICellEditorParams) =>
      otherCellEditorsParamsCallback(params, OtherAccountFields.prDate, accounts, entityKey),
  },
  {
    colId: OtherAccountFieldIds[OtherAccountFields.prFlag],
    headerName: OtherAccountFieldTitles[OtherAccountFields.prFlag],
    field: OtherAccountFields.prFlag,
    headerComponent: TableHeaderWithTooltip,
    headerComponentParams: {
      tooltipMessage: 'Preferred Return Inclusion',
    },
    cellRenderer: DropdownSearchCell,
    cellEditor: DropdownSearchCell,
    editable: editableCallback,
    minWidth: 100,
    maxWidth: 120,
    resizable: true,
    cellStyle: { padding: '0px' },
    cellEditorParams: (params: ICellEditorParams) =>
      otherCellEditorsParamsCallback(params, OtherAccountFields.prFlag, accounts, entityKey),
  },
  {
    colId: OtherAccountFieldIds[OtherAccountFields.actions],
    headerName: OtherAccountFieldTitles[OtherAccountFields.actions],
    pinned: 'right',
    minWidth: 50,
    initialWidth: 96,
    resizable: true,
    cellRenderer: DeleteCell,
    cellStyle: { padding: '0px' },
    cellEditorParams: { level, entityKey: entityKey ?? '', isOtherTable: true },
  },
];
