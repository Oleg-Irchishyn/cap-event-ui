import React, { FC, useCallback, useRef, useState } from 'react';
import {
  CellValueChangedEvent,
  DragStoppedEvent,
  EditableCallbackParams,
  PostSortRowsParams,
} from 'ag-grid-community';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ApplyText, ControlButton, TableControls } from '@/app/new/LineItems/styles';
import Image from 'next/image';
import ConfigurationTable from '@/app/components/ConfigurationTable';
import { observer } from 'mobx-react-lite';
import '@/app/new/grid-styles.css';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { ITEM_STATES } from '@/const/common';
import useAccountsTableRowData from '@/hooks/useAccountsTableRowData';
import {
  AccountFieldIds,
  AccountFields,
  LineItemTypes,
  OtherAccountFields,
  TEXT_INPUT_MAX_LENGTH,
  USER_PROVIDED_OPTION,
  YesNoOptions,
} from '@/app/new/LineItems/const';
import {
  entityColumnDef,
  fundGroupColumnDef,
  otherEntityColumnDef,
} from '@/app/new/LineItems/accountsTableConfiguration';
import { isRowEmpty } from '@/utils/isRowEmpty';
import {
  findAccountByCategoryReasonDescription,
  getBySelectedCategoryAndReason,
  getReasons,
} from '@/app/new/LineItems/utils';
import CustomSwitch from '@/app/components/CustomSwitch/CustomSwitch';
import { CapEventPackageApi } from '@/api';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { Entity } from '@/clients/ReferenceData';
import { formatDate } from '@/utils/formatDate';
import { ALLOCATION_BASIS_IDS } from '@/const/allocationBasisOptions';
import { useToast } from '@/providers/ToastProvider';
import { ApiError } from '@/clients/CapEventPackage';
import { getStoredSessionId } from '@/utils/sessionIdStorage';

const getCellKey = (rowId: string, columnId: string) => `${rowId}-${columnId}`;

const isDependentPrefilledEditable = (params: EditableCallbackParams, level?: string) => {
  const field = params.colDef.field;
  const data = params.data || {};

  if (data.capitalCategory) {
    if (field === AccountFields.callDistributionReason) return true;

    if (level === LineItemTypes.entity) {
      if (field === AccountFields.allocationBasis) return true;
      if (field === AccountFields.prDate) return true;
      if (field === AccountFields.prFlag) return true;
    }
  }

  if (
    data.callDistributionReason &&
    (field === AccountFields.defaultDescription || field === AccountFields.insideCommitment)
  ) {
    return true;
  }

  return false;
};

type Props =
  | {
      isDisabled?: false;
      level: string;
      entityKey: string;
      setDataToStoreCallback: (key: string, data: LineItemRow[]) => void;
      setOtherDataToStoreCallback?: (key: string, data: LineItemRow[]) => void;
      testId: string;
      lineItems: LineItemRow[];
      otherLineItems?: LineItemRow[];
      onDragStopped?: (e: DragStoppedEvent) => void;
      onOtherDragStopped?: (e: DragStoppedEvent) => void;
    }
  | {
      isDisabled: true;
      level?: string;
      entityKey?: string;
      setDataToStoreCallback?: (key: string, data: LineItemRow[]) => void;
      setOtherDataToStoreCallback?: (key: string, data: LineItemRow[]) => void;
      testId: string;
      lineItems?: LineItemRow[];
      otherLineItems?: LineItemRow[];
      onDragStopped?: (e: DragStoppedEvent) => void;
      onOtherDragStopped?: (e: DragStoppedEvent) => void;
    };

const AccountsTable: FC<Props> = ({
  isDisabled,
  setDataToStoreCallback,
  setOtherDataToStoreCallback,
  entityKey,
  level,
  testId,
  lineItems = [prepareNewRow(level)],
  otherLineItems = [prepareNewRow(level)],
  onDragStopped,
  onOtherDragStopped,
}) => {
  const [isAllocationApplying, setIsAllocationApplying] = useState(false);
  const toast = useToast();
  const accounts = capEventSettingsStore.accounts;
  const editableCellRef = useRef<{ [key: string]: boolean }>({ '0-0': true });
  const otherEditableCellRef = useRef<{ [key: string]: boolean }>({ '0-0': true });
  const sessionId = getStoredSessionId() ?? '';

  const commitmentName = capEventSettingsStore.allocationBasis.find(
    (item) => item.allocationId === ALLOCATION_BASIS_IDS.COMMITMENT,
  )?.allocationName;

  const editableCallback = useCallback(
    (params: EditableCallbackParams, requireEdit?: boolean) => {
      if (params.data?.isTotalRow) return false;
      if (params.data?.isMfLineItem) {
        if (
          (params.colDef.field === AccountFields.capitalCategory && !params.data.capitalCategory) ||
          (params.colDef.field === AccountFields.callDistributionReason &&
            !params.data.callDistributionReason) ||
          (params.colDef.field === AccountFields.insideCommitment && !params.data.insideCommitment)
        ) {
          return true;
        }

        return params.colDef.field === AccountFields.defaultDescription;
      }

      if (isDisabled) return false;
      if (level === LineItemTypes.group) {
        if (
          params.colDef.field === AccountFields.amount &&
          params.data.allocationBasis === USER_PROVIDED_OPTION
        ) {
          return false;
        }
      }

      // For inherited entity rows, disable only specific fields before any enabling logic
      if (level === LineItemTypes.entity && params.data.fundGroupLineItemInheritanceId) {
        if (
          params.colDef.field === AccountFields.callDistributionReason ||
          params.colDef.field === AccountFields.defaultDescription ||
          params.colDef.field === AccountFields.insideCommitment ||
          params.colDef.field === AccountFields.investment ||
          (params.colDef.field === AccountFields.amount &&
            params.data.allocationBasis === commitmentName)
        ) {
          return false;
        }
      }

      // Unified handling for prefilled/duplicated rows on both levels
      if (isDependentPrefilledEditable(params, level)) {
        return true;
      }

      if (level === LineItemTypes.entity) {
        const parentFundGroup = capEventSettingsStore.fundGroupsLineItem.find(
          (lineItem) => lineItem.id === params.data.fundGroupLineItemInheritanceId,
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

      if (!params.data.fundGroupLineItemInheritanceId && columnId === '0') return true;

      return editableCellRef.current[key];
    },
    [isDisabled, level],
  );

  const otherEditableCallback = useCallback((params: EditableCallbackParams) => {
    const columnId = params.column?.getColId() || '';
    const rowId = params.data.id || '';
    const key = getCellKey(rowId, columnId);

    if (params.data.accountName) {
      if (params.colDef.field === OtherAccountFields.prDate) return true;
      if (params.colDef.field === OtherAccountFields.prFlag) return true;
      if (params.colDef.field === OtherAccountFields.investment) return true;
    }

    if (columnId === '0') return true;
    return otherEditableCellRef.current[key];
  }, []);

  const addNewRow = useCallback(() => {
    const newRow = prepareNewRow(level);
    const key = getCellKey(newRow.id, '0');
    editableCellRef.current[key] = true;

    setDataToStoreCallback?.(entityKey || '-', [...lineItems, newRow]);
  }, [level, setDataToStoreCallback, entityKey, lineItems]);

  const onCellValueChanged = useCallback(
    (params: CellValueChangedEvent) => {
      const { data, colDef, newValue } = params;

      if (data?.isTotalRow) return;

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

            if (level === LineItemTypes.entity) {
              if (!updatedRow.prDate) {
                updatedRow.prDate = entityDatesStore.getEntityDueDate(entityKey ?? '') ?? undefined;
              }
              if (!updatedRow.prFlag) {
                updatedRow.prFlag = YesNoOptions[0];
              }
            }

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

              if (descriptions.length >= 1) {
                updatedRow.defaultDescription = descriptions
                  .join('; ')
                  .slice(0, TEXT_INPUT_MAX_LENGTH);
                cellKeysToUnBlock.push(
                  getCellKey(data.id, AccountFieldIds[AccountFields.defaultDescription]),
                );
              } else {
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

              cellKeysToUnBlock.push(
                getCellKey(data.id, AccountFieldIds[AccountFields.insideCommitment]),
              );

              if (commitments.length === 1 && commitments[0]) {
                updatedRow.insideCommitment = commitments[0];
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

            if (descriptions.length >= 1) {
              updatedRow.defaultDescription = descriptions
                .join('; ')
                .slice(0, TEXT_INPUT_MAX_LENGTH);
              cellKeysToUnBlock.push(
                getCellKey(data.id, AccountFieldIds[AccountFields.defaultDescription]),
              );
            } else {
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
            updatedRow.capitalCategory &&
            updatedRow.callDistributionReason &&
            updatedRow.defaultDescription
          ) {
            const account = findAccountByCategoryReasonDescription(
              updatedRow.capitalCategory,
              updatedRow.callDistributionReason,
              accounts,
            );
            updatedRow.accountNo = account?.accountNo ?? '';
          }

          if (
            fieldName === AccountFields.allocationBasis &&
            newValue === USER_PROVIDED_OPTION &&
            level === LineItemTypes.group
          ) {
            cellKeysToBlock.push(getCellKey(data.id, AccountFieldIds[AccountFields.amount]));
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

      // calculate amount after updated data is set
      if (fieldName === AccountFields.amount) {
        const fundGroupRelatedItem = capEventSettingsStore.fundGroupsLineItem.find(
          (item) => item.id === data.fundGroupLineItemInheritanceId,
        );

        // For USER-PROVIDED Allocation Basis calculate amount of inherited entities and populate it for parent fund group amount
        if (fundGroupRelatedItem?.allocationBasis === USER_PROVIDED_OPTION) {
          const relatedInheritedEntities = Array.from(
            capEventSettingsStore.entitiesLineItem.values(),
          )
            .flatMap((item) => item)
            .filter((values) => values.fundGroupLineItemInheritanceId === fundGroupRelatedItem?.id);
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
    },
    [lineItems, setDataToStoreCallback, entityKey, level, accounts],
  );

  const onOtherCellValueChanged = useCallback(
    (params: CellValueChangedEvent) => {
      const { data, colDef, newValue } = params;
      const fieldName = colDef.field ?? '-';

      const updatedData = otherLineItems.map((row) => {
        if (row.id === data.id) {
          const updatedRow = { ...row, [fieldName]: newValue };

          if (fieldName === OtherAccountFields.accountName) {
            updatedRow.defaultDescription = '';
            updatedRow.insideCommitment = '';

            if (!updatedRow.prDate) {
              updatedRow.prDate = entityDatesStore.getEntityDueDate(entityKey ?? '') ?? undefined;
            }
            if (!updatedRow.prFlag) {
              updatedRow.prFlag = YesNoOptions[0];
            }
          }
          return updatedRow;
        }
        return row;
      });

      setOtherDataToStoreCallback?.(entityKey ?? '-', updatedData);

      const nextColumnId = Number(params.column.getColId()) + 1;
      const key = getCellKey(data.id, String(nextColumnId));
      otherEditableCellRef.current[key] = true;
    },
    [entityKey, otherLineItems, setOtherDataToStoreCallback],
  );

  const isApplyButtonEnabled =
    capEventSettingsStore.isFundGroupLineItemsChanged &&
    entityDatesStore.isAllDueDatesFilled &&
    ((capEventSettingsStore.fundGroupsLineItem.length === 1 &&
      isRowEmpty(capEventSettingsStore.fundGroupsLineItem[0])) ||
      capEventSettingsStore.isFundGroupLineItemsFilled);

  const isApplyDisabled = !isApplyButtonEnabled || isAllocationApplying;

  const entitiesAllocatedAmount = async (selectedEntities: DropdownItemType<Entity>[]) => {
    const getAllocateEntitiesRequestBody = (
      selectedEntities: DropdownItemType<Entity>[],
      allocationBasis: string,
      amount: number,
    ) => ({
      allocationBasis,
      amount,
      entityAllocationInput: selectedEntities.map((item) => ({
        entityId: item.id ?? '',
        dueDate: formatDate(entityDatesStore.getEntityDueDate(item.label)),
      })),
    });

    const commitmentFundGroups = capEventSettingsStore.fundGroupsLineItem.filter(
      (item) => item.allocationBasis === commitmentName,
    );

    try {
      return await Promise.all(
        commitmentFundGroups.map((fundGroupItem) => {
          return CapEventPackageApi.default.allocateEntities(
            getAllocateEntitiesRequestBody(
              selectedEntities,
              fundGroupItem.allocationBasis,
              fundGroupItem.amount,
            ),
            sessionId,
          );
        }),
      );
    } catch (error) {
      if (error instanceof ApiError) toast.error(error.body?.message);
      console.error('Error allocating entities:', error);
    }
  };

  const applyFundGroupChanges = async () => {
    if (!isApplyButtonEnabled || isAllocationApplying) return;

    setIsAllocationApplying(true);

    try {
      const selectedEntities = capEventSettingsStore.fundEntities.filter(
        (entity) => entity.state === ITEM_STATES.SELECTED,
      );

      const getRelatedRow = (label: string, fundGroupLineItemInheritanceId: string) => {
        return capEventSettingsStore.entitiesLineItem
          .get(label)
          ?.find((item) => item.fundGroupLineItemInheritanceId === fundGroupLineItemInheritanceId);
      };

      const allocatedEntitiesAmount = await entitiesAllocatedAmount(selectedEntities);
      const commitmentFundGroups = capEventSettingsStore.fundGroupsLineItem.filter(
        (item) => item.allocationBasis === commitmentName,
      );
      const commitmentAllocations =
        commitmentFundGroups.map((fgItem, idx) => ({
          id: fgItem.id,
          allocations: allocatedEntitiesAmount?.[idx] ?? {},
        })) ?? [];

      selectedEntities.forEach((entity, index) => {
        if (
          capEventSettingsStore.fundGroupsLineItem.length === 1 &&
          isRowEmpty(capEventSettingsStore.fundGroupsLineItem[0])
        ) {
          const existingRows = capEventSettingsStore.entitiesLineItem.get(entity.label) ?? [];
          const manualNonEmptyRows = existingRows.filter(
            (item) => !item.fundGroupLineItemInheritanceId && !isRowEmpty(item),
          );

          if (manualNonEmptyRows.length > 0) {
            capEventSettingsStore.setEntitiesLineItem(entity.label, [], true);
          } else {
            capEventSettingsStore.setEntitiesLineItem(entity.label, [
              prepareNewRow(LineItemTypes.entity),
            ]);
          }
          return;
        }

        const entityLineItemsToApply = capEventSettingsStore.fundGroupsLineItem.map(
          (fgLineItem) => {
            const relatedRowAmount = getRelatedRow(entity.label, fgLineItem.id)?.amount || 0;

            const allocatedAmount = commitmentAllocations.find((i) => i.id === fgLineItem.id)
              ?.allocations?.[entity.id ?? ''];

            const getEntityAmount = () => {
              if (fgLineItem.allocationBasis === USER_PROVIDED_OPTION) return relatedRowAmount;
              if (fgLineItem.allocationBasis === commitmentName)
                return allocatedAmount ?? fgLineItem.amount;
              return fgLineItem.amount;
            };

            return {
              ...fgLineItem,
              amount: getEntityAmount(),
              allocationBasis:
                fgLineItem.allocationBasis === USER_PROVIDED_OPTION
                  ? ''
                  : fgLineItem.allocationBasis,
              fundGroupLineItemInheritanceId: fgLineItem.inheritanceId,
              id: `${fgLineItem.id}-${index}`,
              prFlag: YesNoOptions[0],
              prDate: entityDatesStore.getEntityDueDate(entity.label) ?? undefined,
            };
          },
        );

        capEventSettingsStore.setEntitiesLineItem(entity.label, entityLineItemsToApply, true);
      });

      capEventSettingsStore.setFundGroupsStateAfterApply();
    } finally {
      setIsAllocationApplying(false);
    }
  };

  const [showOtherTable, setShowOtherTable] = useState(false);

  const handleOtherSwitchPress = async () => {
    setShowOtherTable((prev) => !prev);

    const sponsorId = capEventSettingsStore.sponsors.find(
      (item) => item.state === ITEM_STATES.SELECTED,
    )?.id;
    if (capEventSettingsStore.otherTableAccounts.length === 0 && sponsorId) {
      const otherAccounts = await capEventSettingsStore.fetchAccounts(sponsorId);
      capEventSettingsStore.setOtherTableAccounts(otherAccounts);
    }
  };

  const TableFooter = (
    <TableControls>
      {level === LineItemTypes.entity && (
        <CustomSwitch
          label="Other"
          disabled={isDisabled}
          checked={showOtherTable}
          onChange={handleOtherSwitchPress}
        />
      )}

      <ControlButton
        data-testid={prepareDataTestId('add-new-row', testId, entityKey)}
        data-is-disabled={isDisabled}
        onClick={!isDisabled ? addNewRow : () => {}}
      >
        <Image
          src={isDisabled ? '/cap-event/icons/plus-disabled.svg' : '/cap-event/icons/plus.svg'}
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
          data-is-disabled={isApplyDisabled}
          onClick={applyFundGroupChanges}
        >
          <Image
            src={
              isApplyDisabled
                ? '/cap-event/icons/checkmark.svg'
                : '/cap-event/icons/checkmark-green.svg'
            }
            alt="checkmark"
            width={13}
            height={13}
            priority={true}
          />
          <ApplyText data-is-disabled={isApplyDisabled}>Apply</ApplyText>
        </ControlButton>
      )}
    </TableControls>
  );

  const addNewOtherTableRow = useCallback(() => {
    const newRow = prepareNewRow(level);
    const key = getCellKey(newRow.id, '0');
    otherEditableCellRef.current[key] = true;

    setOtherDataToStoreCallback?.(entityKey ?? '-', [...otherLineItems, newRow]);
  }, [level, setOtherDataToStoreCallback, entityKey, otherLineItems]);

  const OtherTableFooter = (
    <TableControls>
      <ControlButton
        data-testid={prepareDataTestId('add-new-row', testId, entityKey)}
        onClick={addNewOtherTableRow}
      >
        <Image
          src={'/cap-event/icons/plus.svg'}
          alt="plus"
          width={13}
          height={13}
          priority={true}
        />
        Add New Row
      </ControlButton>
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

  const tableData = useAccountsTableRowData(level, lineItems);

  const handlePostSortRows = useCallback((params: PostSortRowsParams) => {
    const { nodes } = params;
    const totalRowNode = nodes.find((node) => (node.data as { isTotalRow?: boolean })?.isTotalRow);

    if (totalRowNode) {
      const totalRowIndex = nodes.indexOf(totalRowNode);
      if (totalRowIndex > -1 && totalRowIndex !== nodes.length - 1) {
        nodes.splice(totalRowIndex, 1);
        nodes.push(totalRowNode);
      }
    }
  }, []);

  return (
    <>
      <ConfigurationTable
        testId={testId}
        isDisabled={isDisabled}
        columnDefs={columnDefs}
        rowData={tableData}
        onCellValueChanged={onCellValueChanged}
        onDragStopped={onDragStopped}
        postSortRows={level === LineItemTypes.entity ? handlePostSortRows : undefined}
      />
      {TableFooter}
      {showOtherTable && (
        <>
          <ConfigurationTable
            testId={`other-${testId}`}
            isDisabled={isDisabled}
            headerLabel="Other"
            columnDefs={otherEntityColumnDef({
              accounts: capEventSettingsStore.otherTableAccounts,
              isMultiLineItems: otherLineItems.length > 1,
              editableCallback: otherEditableCallback,
              entityKey,
            })}
            rowData={otherLineItems}
            onCellValueChanged={onOtherCellValueChanged}
            onDragStopped={onOtherDragStopped}
          />
          {OtherTableFooter}
        </>
      )}
    </>
  );
};

export default observer(AccountsTable);
