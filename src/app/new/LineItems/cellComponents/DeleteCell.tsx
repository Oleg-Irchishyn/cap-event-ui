import React, { FC } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { capEventSettingsStore } from '@/stores';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { isRowEmpty } from '@/app/new/LineItems/utils';

import { LineItemTypes } from '../const';
import { DeleteButton } from '../styles';

const DeleteCell: FC<ICellRendererParams> = (props) => {
  const { level, entityKey } = props.colDef?.cellEditorParams ?? {};

  const isCurrentRowEmpty = isRowEmpty(props.data);

  const isDeleteDisabled = () => {
    if (level === LineItemTypes.group) {
      return isCurrentRowEmpty && capEventSettingsStore.fundGroupsLineItem.length === 1;
    }
    if (level === LineItemTypes.entity) {
      if (!capEventSettingsStore.entitiesLineItem.get(entityKey)) return true;
      return (
        isCurrentRowEmpty && capEventSettingsStore.entitiesLineItem.get(entityKey)?.length === 1
      );
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
