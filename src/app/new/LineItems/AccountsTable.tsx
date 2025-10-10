import React, { FC, useCallback, useMemo, useRef } from 'react';
import { CellValueChangedEvent, EditableCallbackParams, DragStoppedEvent } from 'ag-grid-community';
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
import {
  AccountFields,
  AccountFieldIds,
  USER_PROVIDED_OPTION,
  LineItemTypes,
  YesNoOptions,
} from '@/app/new/LineItems/const';
import {
  entityColumnDef,
  fundGroupColumnDef,
} from '@/app/new/LineItems/accountsTableConfiguration';
import {
  getBySelectedCategoryAndReason,
  getReasons,
  isRowEmpty,
  isRowFilled,
} from '@/app/new/LineItems/utils';

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
      onDragStopped?: (e: DragStoppedEvent) => void;
    }
  | {
      isDisabled: true;
      level?: string;
      entityKey?: string;
      setDataToStoreCallback?: (key: string, data: LineItemRow[]) => void;
      testId: string;
      lineItems?: LineItemRow[];
      onDragStopped?: (e: DragStoppedEvent) => void;
    };

const AccountsTable: FC<Props> = ({
  isDisabled,
  setDataToStoreCallback,
  entityKey,
  level,
  testId,
  lineItems = [prepareNewRow(level)],
  onDragStopped,
}) => {
  const accounts = useMemo(
    () => capEventSettingsStore.accounts?.filter((account) => hasAllValues(account)) || [],
    [capEventSettingsStore.accounts],
  );
  const editableCellRef = useRef<{ [key: string]: boolean }>({ '0-0': true });

  const editableCallback = useCallback(
    (params: EditableCallbackParams, requireEdit?: boolean) => {
      if (isDisabled) return false;
      if (level === LineItemTypes.group) {
        if (
          params.colDef.field === AccountFields.amount &&
          params.data.allocationBasis === USER_PROVIDED_OPTION
        ) {
          return false;
        }
      }

      if (level === LineItemTypes.entity) {
        if (params.colDef.field === AccountFields.allocationBasis) return true;
        if (params.colDef.field === AccountFields.prDate) return true;
        if (params.colDef.field === AccountFields.prFlag) return true;
        // the if statement below is a temporary solution to enable all amounts on fund groups and entity levels
        if (params.data.inheritedId) {
          if (
            params.colDef.field === AccountFields.allocationBasis ||
            params.colDef.field === AccountFields.amount
          ) {
            return true;
          }

          return false;
        }

        const parentFundGroup = capEventSettingsStore.fundGroupsLineItem.find(
          (lineItem) => lineItem.id === params.data.inheritedId,
        );
        if (
          params.colDef.field === AccountFields.amount &&
          parentFundGroup?.allocationBasis === USER_PROVIDED_OPTION
        )
          return true;
      }

      if (
        (params.colDef.field === AccountFields.investment ||
          params.colDef.field === AccountFields.allocationBasis ||
          params.colDef.field === AccountFields.amount) &&
        params.data.capitalCategory
      ) {
        return true;
      }

      if (requireEdit) return true;

      const columnId = params.column?.getColId() || '';
      const rowId = params.data.id || '';
      const key = getCellKey(rowId, columnId);

      if (!params.data.inheritedId && columnId === '0') return true;

      return editableCellRef.current[key];
    },
    [isDisabled, level],
  );

  const addNewRow = useCallback(() => {
    const newRow = prepareNewRow(level);
    const key = getCellKey(newRow.id, '0');
    editableCellRef.current[key] = true;

    setDataToStoreCallback?.(entityKey || '-', [...lineItems, newRow]);
  }, [level, setDataToStoreCallback, entityKey, lineItems]);

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

            cellKeysToUnBlock.push(getCellKey(data.id, AccountFieldIds[AccountFields.investment]));
            cellKeysToUnBlock.push(
              getCellKey(data.id, AccountFieldIds[AccountFields.allocationBasis]),
            );

            const reasons = getReasons(newValue, accounts);

            if (reasons?.length === 1 && reasons[0]) {
              updatedRow.callDistributionReason = reasons[0];
              cellKeysToUnBlock.push(
                getCellKey(data.id, AccountFieldIds[AccountFields.callDistributionReason]),
              );

              const descriptions = getBySelectedCategoryAndReason(
                newValue,
                reasons[0],
                AccountFields.defaultDescription,
                accounts,
              );

              if (descriptions.length === 1 && descriptions[0]) {
                updatedRow.defaultDescription = descriptions[0];
                cellKeysToUnBlock.push(
                  getCellKey(data.id, AccountFieldIds[AccountFields.defaultDescription]),
                );
              }

              const commitments = getBySelectedCategoryAndReason(
                newValue,
                reasons[0],
                AccountFields.insideCommitment,
                accounts,
              );

              if (commitments.length === 1 && commitments[0]) {
                updatedRow.insideCommitment = commitments[0];
                cellKeysToUnBlock.push(
                  getCellKey(data.id, AccountFieldIds[AccountFields.insideCommitment]),
                );
              }
            } else {
              updatedRow.callDistributionReason = '';
              cellKeysToBlock.push(
                getCellKey(data.id, AccountFieldIds[AccountFields.defaultDescription]),
                getCellKey(data.id, AccountFieldIds[AccountFields.insideCommitment]),
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
              accounts,
            );

            if (descriptions.length === 1 && descriptions[0]) {
              updatedRow.defaultDescription = descriptions[0];
              cellKeysToUnBlock.push(
                getCellKey(data.id, AccountFieldIds[AccountFields.defaultDescription]),
              );
            }

            const commitments = getBySelectedCategoryAndReason(
              updatedRow.capitalCategory,
              newValue,
              AccountFields.insideCommitment,
              accounts,
            );

            if (commitments.length === 1 && commitments[0]) {
              updatedRow.insideCommitment = commitments[0];
              cellKeysToUnBlock.push(
                getCellKey(data.id, AccountFieldIds[AccountFields.insideCommitment]),
              );
            }
          }

          if (
            fieldName === AccountFields.allocationBasis &&
            newValue === USER_PROVIDED_OPTION &&
            level === LineItemTypes.group
          ) {
            cellKeysToBlock.push(getCellKey(data.id, AccountFieldIds[AccountFields.amount]));
          }

          if (fieldName === AccountFields.amount) {
            const fundGroupRelatedItem = capEventSettingsStore.fundGroupsLineItem.find(
              (item) => item.id === data.inheritedId,
            );

            // For USER-PROVIDED Allocation Basis calculate amount of inherited entities and populate it for parent fund group amount
            if (fundGroupRelatedItem?.allocationBasis === USER_PROVIDED_OPTION) {
              const relatedInheritedEntities = Array.from(
                capEventSettingsStore.entitiesLineItem.values(),
              )
                .flatMap((item) => item)
                .filter((values) => values.inheritedId === fundGroupRelatedItem?.id);
              const newFundGroupAmount = relatedInheritedEntities.reduce(
                (acc, item) => acc + item.amount,
                0,
              );
              const newFundGroupItem = { ...fundGroupRelatedItem, amount: newFundGroupAmount };
              const updatedData = capEventSettingsStore.fundGroupsLineItem.map((item) =>
                item.id === newFundGroupItem.id ? newFundGroupItem : { ...item },
              );

              capEventSettingsStore.setFundGroupsLineItem(updatedData);
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
    [lineItems, setDataToStoreCallback, entityKey, level, accounts],
  );

  const isApplyButtonEnabled =
    (capEventSettingsStore.fundGroupsLineItem.length === 1 &&
      isRowEmpty(capEventSettingsStore.fundGroupsLineItem[0]) &&
      isRowFilled(capEventSettingsStore.fundGroupsStateAfterApply[0])) ||
    (capEventSettingsStore.isFundGroupLineItemsFilled &&
      capEventSettingsStore.isFundGroupLineItemsChanged);

  const applyFundGroupChanges = () => {
    if (!isApplyButtonEnabled) return;

    const selectedEntities = capEventSettingsStore.fundEntities.filter(
      (entity) => entity.state === ITEM_STATES.SELECTED,
    );

    const getRelatedRow = (label: string, inheritedId: string) => {
      return capEventSettingsStore.entitiesLineItem
        .get(label)
        ?.find((item) => item.inheritedId === inheritedId);
    };

    selectedEntities.forEach((entity, index) => {
      if (
        capEventSettingsStore.fundGroupsLineItem.length === 1 &&
        isRowEmpty(capEventSettingsStore.fundGroupsLineItem[0])
      ) {
        const notInheritedEntities: LineItemRow[] =
          capEventSettingsStore.entitiesLineItem
            .get(entity.label)
            ?.filter((entity) => !entity.inheritedId) ?? [];

        capEventSettingsStore.setEntitiesLineItem(
          entity.label,
          notInheritedEntities.length
            ? notInheritedEntities
            : [prepareNewRow(LineItemTypes.entity)],
          true,
        );
        return;
      }

      capEventSettingsStore.setEntitiesLineItem(
        entity.label,
        capEventSettingsStore.fundGroupsLineItem.map((fgLineItem) => {
          const relatedRowAmount = getRelatedRow(entity.label, fgLineItem.id)?.amount || 0;

          return {
            ...fgLineItem,
            amount:
              fgLineItem.allocationBasis === USER_PROVIDED_OPTION
                ? relatedRowAmount
                : fgLineItem.amount,
            allocationBasis:
              fgLineItem.allocationBasis === USER_PROVIDED_OPTION ? '' : fgLineItem.allocationBasis,
            inheritedId: fgLineItem.id,
            id: `${fgLineItem.id}-${index}`,
            prFlag: YesNoOptions[0],
          };
        }),
        true,
      );
    });

    capEventSettingsStore.setFundGroupsStateAfterApply();
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
      {level === LineItemTypes.group && (
        <ControlButton
          data-testid={prepareDataTestId('apply', testId, entityKey)}
          data-is-disabled={!isApplyButtonEnabled}
          onClick={applyFundGroupChanges}
        >
          <Image
            src={!isApplyButtonEnabled ? 'icons/checkmark.svg' : 'icons/checkmark-green.svg'}
            alt="checkmark"
            width={13}
            height={13}
            priority={true}
          />
          <ApplyText data-is-disabled={!isApplyButtonEnabled}>Apply</ApplyText>
        </ControlButton>
      )}
    </TableControls>
  );

  const isMultiLineItems = lineItems.length > 1;

  const columnDefs =
    level === 'group'
      ? fundGroupColumnDef({
          accounts,
          isMultiLineItems,
          editableCallback,
        })
      : entityColumnDef({ accounts, isMultiLineItems, editableCallback, entityKey });

  return (
    <>
      <ConfigurationTable
        testId={testId}
        isDisabled={isDisabled}
        columnDefs={columnDefs}
        rowData={lineItems || []}
        onCellValueChanged={onCellValueChanged}
        onDragStopped={onDragStopped}
      />
      {TableFooter}
    </>
  );
};

export default observer(AccountsTable);
