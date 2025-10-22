import React, { FC, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { ActionButtonsWrapper, DeleteButton, PreviewButton, PreviewWrapper } from '../styles';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { LineItemTypes } from '../const';
import Tooltip from '@/app/components/Tooltip';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

export const ActionsCell: FC<ICellRendererParams> = (props) => {
  const [showPreviewTooltip, setPreviewTooltip] = useState(false);
  const previewTooltipRef = useRef<HTMLDivElement | null>(null);

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

  const isPreviewDisabled =
    props.data.capitalCategory === '' ||
    props.data.callDistributionReason === '' ||
    props.data.defaultDescription === '' ||
    props.data.insideCommitment === '' ||
    props.data.allocationBasis === '' ||
    props.data.amount === 0 ||
    !(entityDatesStore.getEntityDueDate(entityKey) instanceof Date);

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

  const handlePreviewClick = () => {
    if (isPreviewDisabled) return;
  };

  return (
    <ActionButtonsWrapper>
      {level === LineItemTypes.entity && (
        <PreviewWrapper
          ref={previewTooltipRef}
          onMouseEnter={() => isPreviewDisabled && setPreviewTooltip(true)}
          onMouseLeave={() => setPreviewTooltip(false)}
        >
          <PreviewButton
            data-testid={prepareDataTestId('', 'preview-icon')}
            data-is-disabled={isPreviewDisabled}
            onClick={handlePreviewClick}
          />
          <Tooltip
            tooltipMessage="Not all required fields are populated"
            showTooltip={showPreviewTooltip}
            targetRef={previewTooltipRef}
            testId="preview-icon-tooltip"
          />
        </PreviewWrapper>
      )}
      {!props.data.inheritedId && (
        <DeleteButton
          data-testid={prepareDataTestId('', 'delete-icon')}
          data-is-disabled={isDeleteDisabled()}
          onClick={handleDeleteCELI}
        />
      )}
    </ActionButtonsWrapper>
  );
};
