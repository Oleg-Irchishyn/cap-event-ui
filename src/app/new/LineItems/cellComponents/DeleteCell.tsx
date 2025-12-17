import React, { FC, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { capEventSettingsStore } from '@/stores';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { isRowEmpty } from '@/utils/isRowEmpty';
import { isOtherRowEmpty } from '@/app/new/LineItems/utils';

import { LineItemTypes } from '../const';
import { CellWrapper, DeleteButton } from '../styles';
import { observer } from 'mobx-react-lite';

import Tooltip from '@/app/components/Tooltip';

const DeleteCell: FC<ICellRendererParams> = (props) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const { level, entityKey, isOtherTable } = props.colDef?.cellEditorParams ?? {};

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

  const isOtherDeleteDisabled =
    isOtherRowEmpty(props.data) &&
    capEventSettingsStore.otherEntitiesLineItem.get(entityKey)?.length === 1;

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

  const handleOtherCELIDelete = () => {
    if (isOtherDeleteDisabled) return;

    if (capEventSettingsStore.otherEntitiesLineItem.get(entityKey)?.length === 1) {
      capEventSettingsStore.setOtherEntitiesLineItems(entityKey, [prepareNewRow(level)]);
      return;
    }
    const filteredEntityLineItems = capEventSettingsStore.otherEntitiesLineItem
      .get(entityKey)
      ?.filter((item) => item.id !== props.data.id);
    if (filteredEntityLineItems) {
      capEventSettingsStore.setOtherEntitiesLineItems(entityKey, filteredEntityLineItems);
    }
  };

  const shouldRender = !props.data.fundGroupLineItemInheritanceId && !props.data.isMfLineItem;

  const isDisabled = isOtherTable ? isOtherDeleteDisabled : isDeleteDisabled();

  const onShowTooltip = () => {
    if (!isDisabled) {
      setShowTooltip(true);
    }
  };

  const onHideTooltip = () => {
    setShowTooltip(false);
  };

  return (
    <>
      {shouldRender && (
        <CellWrapper ref={tooltipRef} onMouseEnter={onShowTooltip} onMouseLeave={onHideTooltip}>
          <DeleteButton
            data-testid={prepareDataTestId('', 'delete-icon')}
            data-is-disabled={isDisabled}
            onClick={isOtherTable ? handleOtherCELIDelete : handleDeleteCELI}
          />
          <Tooltip
            tooltipMessage={'Delete Row'}
            showTooltip={showTooltip}
            targetRef={tooltipRef}
            testId={prepareDataTestId('delete-row-tooltip')}
          />
        </CellWrapper>
      )}
    </>
  );
};

export default observer(DeleteCell);
