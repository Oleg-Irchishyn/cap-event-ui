import React, { FC } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { capEventSettingsStore } from '@/stores';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

import { LineItemTypes } from '../const';
import { DeleteButton } from '../styles';

const DeleteCell: FC<ICellRendererParams> = (props) => {
  const { level, entityKey } = props.colDef?.cellEditorParams ?? {};

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
      if (!capEventSettingsStore.entitiesLineItem.get(entityKey)) return true;
      return isRowEmpty() && capEventSettingsStore.entitiesLineItem.get(entityKey)?.length === 1;
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
      if (capEventSettingsStore.entitiesLineItem.get(entityKey)?.length === 1) {
        capEventSettingsStore.setEntitiesLineItem(entityKey, [prepareNewRow(level)]);
        return;
      }
      const filteredEntityLineItems = capEventSettingsStore.entitiesLineItem
        .get(entityKey)
        ?.filter((item) => item.id !== props.data.id);
      if (filteredEntityLineItems) {
        capEventSettingsStore.setEntitiesLineItem(entityKey, filteredEntityLineItems);
      }
    }
  };
  return (
    <>
      {!props.data.inheritedId && (
        <DeleteButton
          data-testid={prepareDataTestId('', 'delete-icon')}
          data-is-disabled={isDeleteDisabled()}
          onClick={handleDeleteCELI}
        />
      )}
    </>
  );
};

export default DeleteCell;
