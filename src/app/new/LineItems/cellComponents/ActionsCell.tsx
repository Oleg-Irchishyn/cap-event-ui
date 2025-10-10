import React, { FC } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { ActionButtonsWrapper, DeleteButton } from '../styles';
import { capEventSettingsStore } from '@/stores';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { LineItemTypes } from '../const';

export const ActionsCell: FC<ICellRendererParams> = (props) => {
  const key = props.colDef?.cellEditorParams.entityKey;
  const { level } = props.colDef?.cellEditorParams ?? {};

  const isRowEmpty = () => {
    return (
      props.data.capitalCategory === '' &&
      props.data.callDistributionReason === '' &&
      props.data.defaultDescription === '' &&
      props.data.insideCommitment === '' &&
      props.data.investment === '' &&
      props.data.allocationBasis === '' &&
      props.data.amount === 0
    );
  };

  const isDeleteDisabled = () => {
    if (level === LineItemTypes.group) {
      return isRowEmpty() && capEventSettingsStore.fundGroupsLineItem.length === 1;
    }
    if (level === LineItemTypes.entity) {
      if (!capEventSettingsStore.entitiesLineItem.get(key)) return true;
      return isRowEmpty() && capEventSettingsStore.entitiesLineItem.get(key)?.length === 1;
    }
  };

  const handleDeleteCELI = () => {
    if (isDeleteDisabled()) return;

    if (level === LineItemTypes.group) {
      if (capEventSettingsStore.fundGroupsLineItem.length === 1) {
        capEventSettingsStore.setFundGroupsLineItem([prepareNewRow(level)]);
        return;
      }
      const filteredFundGroupLineItems = capEventSettingsStore.fundGroupsLineItem.filter(
        (item) => item.id !== props.data.id,
      );
      capEventSettingsStore.setFundGroupsLineItem(filteredFundGroupLineItems);
    }

    if (level === LineItemTypes.entity) {
      if (capEventSettingsStore.entitiesLineItem.get(key)?.length === 1) {
        capEventSettingsStore.setEntitiesLineItem(key, [prepareNewRow(level)]);
        return;
      }
      const filteredEntityLineItems = capEventSettingsStore.entitiesLineItem
        .get(key)
        ?.filter((item) => item.id !== props.data.id);
      if (filteredEntityLineItems) {
        capEventSettingsStore.setEntitiesLineItem(key, filteredEntityLineItems);
      }
    }
  };

  return (
    <ActionButtonsWrapper>
      {!props.data.inheritedId && (
        <DeleteButton data-is-disabled={isDeleteDisabled()} onClick={handleDeleteCELI} />
      )}
    </ActionButtonsWrapper>
  );
};
