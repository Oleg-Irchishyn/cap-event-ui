import React, { FC, useCallback, useMemo, useRef, useState } from 'react';
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
import { Accounts } from '@/api/referenceData';
import { ApplyText, ControlButton, TableControls } from '@/app/new/LineItems/styles';
import Image from 'next/image';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { observer } from 'mobx-react-lite';
import './cellComponents/grid-styles.css';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

const AccountFields = {
  capitalCategory: 'capitalCategory',
  callDistributionReason: 'callDistributionReason',
  defaultDescription: 'defaultDescription',
  insideCommitment: 'insideCommitment',
  amount: 'amount',
};

const AccountFieldTitles = {
  [AccountFields.capitalCategory]: 'Category',
  [AccountFields.callDistributionReason]: 'Call/Distribution Reason',
  [AccountFields.defaultDescription]: 'Call Line Description',
  [AccountFields.insideCommitment]: 'Inside CMNT',
  [AccountFields.amount]: 'Amount',
};

const getCellKey = (rowId: string, columnId: string) => `${rowId}-${columnId}`;

const prepareNewRow = (): LineItemRow => {
  return {
    id: Date.now().toString(),
    capitalCategory: '',
    callDistributionReason: '',
    defaultDescription: '',
    insideCommitment: '',
    amount: 0,
  };
};

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
    }
  | {
      isDisabled: true;
      level?: string;
      entityKey?: string;
      setDataToStoreCallback?: (key: string, data: LineItemRow[]) => void;
      testId: string;
    };

const AccountsTable: FC<Props> = ({
  isDisabled,
  setDataToStoreCallback,
  entityKey,
  level,
  testId,
}) => {
  const accounts = useMemo(
    () => capEventSettingsStore.accounts?.filter((account) => hasAllValues(account)) || [],
    [],
  );
  const editableCellRef = useRef<{ [key: string]: boolean }>({ '0-0': true });
  const [rowData, setRowData] = useState<LineItemRow[]>([prepareNewRow()]);

  const getCategories = () => {
    return Array.from(new Set(accounts.map((account) => account.capitalCategory)));
  };

  const categoryOptions = getCategories();

  const editableCallback = useCallback(
    (params: EditableCallbackParams, requireEdit?: boolean) => {
      if (isDisabled) return false;
      if (requireEdit) return true;

      const columnId = params.column?.getColId() || '';
      const rowId = params.node.id || '';
      const key = getCellKey(rowId, columnId);
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
                account[keyValueToReturn as keyof Accounts],
            )
            .map((account) => account[keyValueToReturn as keyof Accounts]),
        ),
      );
    },
    [accounts],
  );

  const cellEditorsParamsCallback = useCallback(
    (params: ICellEditorParams, key: string) => {
      const selectedCategory = params.data.capitalCategory;
      const selectedReason = params.data.callDistributionReason;

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
          return { options: possibleValues, withAddingFromSearch: true };
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
    const rowId = String(rowData.length);
    const key = getCellKey(rowId, '0');
    editableCellRef.current[key] = true;

    setRowData((prev) => [...prev, newRow]);
  }, [rowData.length]);

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent) => {
      const { data, colDef, newValue, rowIndex } = params;
      const fieldName = colDef.field || '-';
      const cellKeysToUnBlock: string[] = [];
      const cellKeysToBlock: string[] = [];

      setRowData((prev) => {
        const updatedData = prev.map((row) => {
          if (row.id === data.id) {
            const updatedRow = { ...row, [fieldName]: newValue };

            // If capitalCategory changed, also clear dependent fields
            if (fieldName === AccountFields.capitalCategory) {
              updatedRow.defaultDescription = '';
              updatedRow.insideCommitment = '';

              const reasons = getReasons(newValue);

              if (reasons?.length === 1) {
                updatedRow.callDistributionReason = reasons[0];
                cellKeysToUnBlock.push(getCellKey(String(rowIndex), '1'));

                const descriptions = getBySelectedCategoryAndReason(
                  newValue,
                  reasons[0],
                  AccountFields.defaultDescription,
                );

                if (descriptions.length === 1) {
                  updatedRow.defaultDescription = descriptions[0];
                  cellKeysToUnBlock.push(getCellKey(String(rowIndex), '2'));
                }

                const commitments = getBySelectedCategoryAndReason(
                  newValue,
                  reasons[0],
                  AccountFields.insideCommitment,
                );

                if (commitments.length === 1) {
                  updatedRow.insideCommitment = commitments[0];
                  cellKeysToUnBlock.push(getCellKey(String(rowIndex), '3'));
                }
              } else {
                updatedRow.callDistributionReason = '';
                cellKeysToBlock.push(
                  getCellKey(String(rowIndex), '2'),
                  getCellKey(String(rowIndex), '3'),
                );
              }
            }

            // If callDistReason changed, also clear dependent fields
            if (fieldName === AccountFields.callDistributionReason) {
              updatedRow.defaultDescription = '';
              updatedRow.insideCommitment = '';

              const descriptions = getBySelectedCategoryAndReason(
                updatedRow.capitalCategory,
                newValue,
                AccountFields.defaultDescription,
              );

              if (descriptions.length === 1) {
                updatedRow.defaultDescription = descriptions[0];
                cellKeysToUnBlock.push(getCellKey(String(rowIndex), '2'));
              }

              const commitments = getBySelectedCategoryAndReason(
                updatedRow.capitalCategory,
                newValue,
                AccountFields.insideCommitment,
              );

              if (commitments.length === 1) {
                updatedRow.insideCommitment = commitments[0];
                cellKeysToUnBlock.push(getCellKey(String(rowIndex), '3'));
              }
            }

            return updatedRow;
          }
          return row;
        });

        // Call the callback with the updated data
        setDataToStoreCallback?.(entityKey || '-', updatedData);
        return updatedData;
      });

      const rowId = params.node.id || '';
      const nextColumnId = Number(params.column.getColId()) + 1;
      const key = getCellKey(rowId, String(nextColumnId));
      editableCellRef.current[key] = true;
      cellKeysToBlock.forEach((key) => (editableCellRef.current[key] = false));
      cellKeysToUnBlock.forEach((key) => (editableCellRef.current[key] = true));
    },
    [entityKey, getBySelectedCategoryAndReason, getReasons, setDataToStoreCallback],
  );

  const isDataChanged = true;

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
          data-is-disabled={isDisabled}
          data-is-clickable={isDataChanged}
          onClick={isDataChanged ? addNewRow : () => {}}
        >
          <Image
            src={isDataChanged ? 'icons/checkmark-green.svg' : 'icons/checkmark.svg'}
            alt="checkmark"
            width={13}
            height={13}
            priority={true}
          />
          <ApplyText data-is-active={isDataChanged}>Apply</ApplyText>
        </ControlButton>
      )}
    </TableControls>
  );

  const columnDefs = useMemo<ColDef[]>(
    () => [
      {
        colId: '0',
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
        colId: '1',
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
        colId: '2',
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
        colId: '3',
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
        colId: '4',
        headerName: AccountFieldTitles[AccountFields.amount],
        field: AccountFields.amount,
        cellRenderer: AmountCell,
        editable: false,
        flex: 1,
        headerClass: 'custom-header',
        cellRendererParams: (params: EditableCallbackParams) => editableCallback(params, true),
      },
    ],
    [categoryOptions, editableCallback, cellEditorsParamsCallback],
  );

  return (
    <>
      <ConfigurationTable
        testId={testId}
        columnDefs={columnDefs}
        rowData={rowData}
        onCellValueChanged={onCellValueChanged}
      />
      {TableFooter}
    </>
  );
};

export default observer(AccountsTable);
