import React, { FC, useCallback, useMemo, useRef } from 'react';
import {
  CellValueChangedEvent,
  ColDef,
  EditableCallbackParams,
  ICellEditorParams,
} from 'ag-grid-community';
import { DropdownSearchCell } from '@/app/new/LineItems/cellComponents/DropdownSearchCell';
import { AmountCell } from '@/app/new/LineItems/cellComponents/AmountCell';
import { capEventSettingsStore } from '@/stores';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ApplyText, ControlButton, TableControls } from '@/app/new/LineItems/styles';
import Image from 'next/image';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { observer } from 'mobx-react-lite';
import '@/app/new/grid-styles.css';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { ITEM_STATES } from '@/const/common';
import { Account } from '@/clients/ReferenceData';
import { InvestmentDropdown } from '@/app/new/LineItems/cellComponents/InvestmentDropdown';
import { AccountFields, AccountFiledIds, AccountFieldTitles } from '@/app/new/LineItems/const';

const getCellKey = (rowId: string, columnId: string) => `${rowId}-${columnId}`;

const hasAllValues = <T extends object>(obj: T) => {
  return Object.values(obj).every(Boolean);
};

type Props =
  | {
      isDisabled?: false;
      level: string;
      entityKey: string;
      setDataToStoreCallback: (key: string, data: LineItemRow[]) => void;
      testId: string;
      lineItems: LineItemRow[];
    }
  | {
      isDisabled: true;
      level?: string;
      entityKey?: string;
      setDataToStoreCallback?: (key: string, data: LineItemRow[]) => void;
      testId: string;
      lineItems?: LineItemRow[];
    };

const AccountsTable: FC<Props> = ({
  isDisabled,
  setDataToStoreCallback,
  entityKey,
  level,
  testId,
  lineItems = [prepareNewRow()],
}) => {
  const accounts = useMemo(
    () => capEventSettingsStore.accounts?.filter((account) => hasAllValues(account)) || [],
    [capEventSettingsStore.accounts],
  );
  const editableCellRef = useRef<{ [key: string]: boolean }>({ '0-0': true });

  const getCategories = () => {
    return Array.from(new Set(accounts.map((account) => account.capitalCategory)));
  };

  const categoryOptions = getCategories();

  const editableCallback = useCallback(
    (params: EditableCallbackParams, requireEdit?: boolean) => {
      if (isDisabled) return false;
      if (level === 'entity' && params.colDef.field === AccountFields.allocationBasis) return true;
      if (params.data.inheritedId) return false;
      if (requireEdit) return true;

      const columnId = params.column?.getColId() || '';
      const rowId = params.data.id || '';
      const key = getCellKey(rowId, columnId);

      if (!params.data.inheritedId && columnId === '0') return true;

      return editableCellRef.current[key];
    },
    [isDisabled],
  );

  const getReasons = useCallback(
    (selectedCategory: string) => {
      return Array.from(
        new Set(
          accounts
            .filter(
              (account) =>
                account.capitalCategory === selectedCategory && account.callDistributionReason,
            )
            .map((account) => account.callDistributionReason),
        ),
      );
    },
    [accounts],
  );

  const getBySelectedCategoryAndReason = useCallback(
    (selectedCategory: string, selectedReason: string, keyValueToReturn: string) => {
      return Array.from(
        new Set(
          accounts
            .filter(
              (account) =>
                account.capitalCategory === selectedCategory &&
                account.callDistributionReason === selectedReason &&
                account[keyValueToReturn as keyof Account],
            )
            .map((account) => account[keyValueToReturn as keyof Account]),
        ),
      );
    },
    [accounts],
  );

  const cellEditorsParamsCallback = useCallback(
    (params: ICellEditorParams, key: string) => {
      const selectedCategory = params.data?.capitalCategory;
      const selectedReason = params.data?.callDistributionReason;

      switch (key) {
        case AccountFields.callDistributionReason: {
          const possibleValues = getReasons(selectedCategory);
          return { options: possibleValues };
        }

        case AccountFields.defaultDescription: {
          const possibleValues = getBySelectedCategoryAndReason(
            selectedCategory,
            selectedReason,
            AccountFields.defaultDescription,
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
          );
          return { options: possibleValues };
        }
      }
    },
    [getBySelectedCategoryAndReason, getReasons],
  );

  const addNewRow = useCallback(() => {
    const newRow = prepareNewRow();
    const key = getCellKey(newRow.id, '0');
    editableCellRef.current[key] = true;

    setDataToStoreCallback?.(entityKey || '-', [...lineItems, newRow]);
  }, [lineItems, entityKey, setDataToStoreCallback]);

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent) => {
      const { data, colDef, newValue } = params;
      const fieldName = colDef.field || '-';
      const cellKeysToUnBlock: string[] = [];
      const cellKeysToBlock: string[] = [];

      const updatedData = lineItems.map((row) => {
        if (row.id === data.id) {
          const updatedRow = { ...row, [fieldName]: newValue };

          // If capitalCategory changed, also clear dependent fields
          if (fieldName === AccountFields.capitalCategory) {
            updatedRow.defaultDescription = '';
            updatedRow.insideCommitment = '';
            updatedRow.allocationBasis = '';

            cellKeysToUnBlock.push(getCellKey(data.id, AccountFiledIds[AccountFields.investment]));
            cellKeysToUnBlock.push(
              getCellKey(data.id, AccountFiledIds[AccountFields.allocationBasis]),
            );

            const reasons = getReasons(newValue);

            if (reasons?.length === 1 && reasons[0]) {
              updatedRow.callDistributionReason = reasons[0];
              cellKeysToUnBlock.push(
                getCellKey(data.id, AccountFiledIds[AccountFields.callDistributionReason]),
              );

              const descriptions = getBySelectedCategoryAndReason(
                newValue,
                reasons[0],
                AccountFields.defaultDescription,
              );

              if (descriptions.length === 1 && descriptions[0]) {
                updatedRow.defaultDescription = descriptions[0];
                cellKeysToUnBlock.push(
                  getCellKey(data.id, AccountFiledIds[AccountFields.defaultDescription]),
                );
              }

              const commitments = getBySelectedCategoryAndReason(
                newValue,
                reasons[0],
                AccountFields.insideCommitment,
              );

              if (commitments.length === 1 && commitments[0]) {
                updatedRow.insideCommitment = commitments[0];
                cellKeysToUnBlock.push(
                  getCellKey(data.id, AccountFiledIds[AccountFields.insideCommitment]),
                );
              }
            } else {
              updatedRow.callDistributionReason = '';
              cellKeysToBlock.push(
                getCellKey(data.id, AccountFiledIds[AccountFields.defaultDescription]),
                getCellKey(data.id, AccountFiledIds[AccountFields.insideCommitment]),
              );
            }
          }

          // If callDistReason changed, also clear dependent fields
          if (fieldName === AccountFields.callDistributionReason && updatedRow.capitalCategory) {
            updatedRow.defaultDescription = '';
            updatedRow.insideCommitment = '';

            const descriptions = getBySelectedCategoryAndReason(
              updatedRow.capitalCategory,
              newValue,
              AccountFields.defaultDescription,
            );

            if (descriptions.length === 1 && descriptions[0]) {
              updatedRow.defaultDescription = descriptions[0];
              cellKeysToUnBlock.push(
                getCellKey(data.id, AccountFiledIds[AccountFields.defaultDescription]),
              );
            }

            const commitments = getBySelectedCategoryAndReason(
              updatedRow.capitalCategory,
              newValue,
              AccountFields.insideCommitment,
            );

            if (commitments.length === 1 && commitments[0]) {
              updatedRow.insideCommitment = commitments[0];
              cellKeysToUnBlock.push(
                getCellKey(data.id, AccountFiledIds[AccountFields.insideCommitment]),
              );
            }
          }
          return updatedRow;
        }
        return row;
      });

      // Call the callback with the updated data
      setDataToStoreCallback?.(entityKey || '-', updatedData);

      const nextColumnId = Number(params.column.getColId()) + 1;
      const key = getCellKey(data.id, String(nextColumnId));
      editableCellRef.current[key] = true;
      cellKeysToBlock.forEach((key) => (editableCellRef.current[key] = false));
      cellKeysToUnBlock.forEach((key) => (editableCellRef.current[key] = true));
    },
    [lineItems, entityKey, getBySelectedCategoryAndReason, getReasons, setDataToStoreCallback],
  );

  const applyFundGroupChanges = () => {
    if (!capEventSettingsStore.isFundGroupLineItemsFilled) return;

    const selectedEntities = capEventSettingsStore.fundEntities.filter(
      (entity) => entity.state === ITEM_STATES.SELECTED,
    );

    selectedEntities.forEach((entity) => {
      capEventSettingsStore.setEntitiesLineItem(
        entity.label,
        capEventSettingsStore.fundGroupsLineItem.map((fgLineItem) => ({
          ...fgLineItem,
          inheritedId: fgLineItem.id,
        })),
        true,
      );
    });
  };

  const TableFooter = (
    <TableControls>
      <ControlButton
        data-testid={prepareDataTestId('add-new-row', testId, entityKey)}
        data-is-disabled={isDisabled}
        onClick={!isDisabled ? addNewRow : () => {}}
      >
        <Image
          src={isDisabled ? 'icons/plus-disabled.svg' : 'icons/plus.svg'}
          alt="plus"
          width={13}
          height={13}
          priority={true}
        />
        Add New Row
      </ControlButton>
      {level === 'group' && (
        <ControlButton
          data-testid={prepareDataTestId('apply', testId, entityKey)}
          data-is-disabled={!capEventSettingsStore.isFundGroupLineItemsFilled}
          onClick={applyFundGroupChanges}
        >
          <Image
            src={
              capEventSettingsStore.isFundGroupLineItemsFilled
                ? 'icons/checkmark-green.svg'
                : 'icons/checkmark.svg'
            }
            alt="checkmark"
            width={13}
            height={13}
            priority={true}
          />
          <ApplyText data-is-disabled={!capEventSettingsStore.isFundGroupLineItemsFilled}>
            Apply
          </ApplyText>
        </ControlButton>
      )}
    </TableControls>
  );

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        colId: AccountFiledIds[AccountFields.capitalCategory],
        headerName: AccountFieldTitles[AccountFields.capitalCategory],
        field: AccountFields.capitalCategory,
        cellRenderer: DropdownSearchCell,
        cellEditor: DropdownSearchCell,
        editable: editableCallback,
        flex: 1,
        cellEditorParams: { options: categoryOptions },
        cellStyle: { padding: '0px' },
      },
      {
        colId: AccountFiledIds[AccountFields.callDistributionReason],
        headerName: AccountFieldTitles[AccountFields.callDistributionReason],
        field: AccountFields.callDistributionReason,
        cellRenderer: DropdownSearchCell,
        cellEditor: DropdownSearchCell,
        editable: editableCallback,
        flex: 1,
        cellStyle: { padding: '0px' },
        cellEditorParams: (params: ICellEditorParams) =>
          cellEditorsParamsCallback(params, AccountFields.callDistributionReason),
      },
      {
        colId: AccountFiledIds[AccountFields.defaultDescription],
        headerName: AccountFieldTitles[AccountFields.defaultDescription],
        field: AccountFields.defaultDescription,
        editable: editableCallback,
        flex: 1,
        cellRenderer: DropdownSearchCell,
        cellEditor: DropdownSearchCell,
        cellStyle: { padding: '0px' },
        cellEditorParams: (params: ICellEditorParams) =>
          cellEditorsParamsCallback(params, AccountFields.defaultDescription),
      },
      {
        colId: AccountFiledIds[AccountFields.insideCommitment],
        headerName: AccountFieldTitles[AccountFields.insideCommitment],
        field: AccountFields.insideCommitment,
        editable: editableCallback,
        flex: 1,
        cellRenderer: DropdownSearchCell,
        cellEditor: DropdownSearchCell,
        cellStyle: { padding: '0px' },
        cellEditorParams: (params: ICellEditorParams) =>
          cellEditorsParamsCallback(params, AccountFields.insideCommitment),
      },
      {
        colId: AccountFiledIds[AccountFields.investment],
        headerName: AccountFieldTitles[AccountFields.investment],
        field: AccountFields.investment,
        editable: editableCallback,
        flex: 1,
        cellRenderer: InvestmentDropdown,
        cellEditor: InvestmentDropdown,
        cellStyle: { padding: '0px' },
      },
      {
        colId: AccountFiledIds[AccountFields.allocationBasis],
        headerName: AccountFieldTitles[AccountFields.allocationBasis],
        field: AccountFields.allocationBasis,
        cellRenderer: DropdownSearchCell,
        cellEditor: DropdownSearchCell,
        editable: editableCallback,
        flex: 1,
        cellStyle: { padding: '0px' },
        cellEditorParams: {
          options: [
            'Commitment',
            'Contribution Deal',
            'Contribution All',
            'Unfunded',
            'Contribution Deal Parent',
          ],
        },
      },
      {
        colId: AccountFiledIds[AccountFields.amount],
        headerName: AccountFieldTitles[AccountFields.amount],
        field: AccountFields.amount,
        cellRenderer: AmountCell,
        editable: false,
        flex: 1,
        headerClass: 'custom-header',
        suppressKeyboardEvent: () => true,
      },
    ],
    [categoryOptions, editableCallback, cellEditorsParamsCallback],
  );

  return (
    <>
      <ConfigurationTable
        testId={testId}
        isDisabled={isDisabled}
        columnDefs={columnDefs}
        rowData={lineItems || []}
        onCellValueChanged={onCellValueChanged}
      />
      {TableFooter}
    </>
  );
};

export default observer(AccountsTable);
