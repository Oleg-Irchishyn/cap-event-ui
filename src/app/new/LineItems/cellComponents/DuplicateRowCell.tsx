import { FC, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import Tooltip from '@/app/components/Tooltip';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { capEventSettingsStore } from '@/stores';
import { isRowEmpty } from '@/utils/isRowEmpty';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ITEM_STATES } from '@/const/common';

import { LineItemTypes } from '../const';
import { DuplicateRowButton, DuplicateRowWrapper } from '../styles';

const EXCLUDED_KEYS = ['id', 'inheritedFundGroupLineItemId', 'isTotalRow'];

const DuplicateRowCell: FC<ICellRendererParams> = (props) => {
  const [showDuplicateRowTooltip, setDuplicateRowTooltip] = useState(false);

  const duplicateRowTooltipRef = useRef<HTMLDivElement | null>(null);
  const { level, entityKey } = props.colDef?.cellEditorParams ?? {};

  const entityLevel = level === LineItemTypes.entity;
  const hasMultipleEntities = capEventSettingsStore.hasMultipleEntitiesChosen;
  const isCurrentRowEmpty = isRowEmpty(props.data);

  const selectedEntitiesCount =
    capEventSettingsStore.entitiesSelectedCountSnapshot ??
    capEventSettingsStore.fundEntities.filter((e) => e.state === ITEM_STATES.SELECTED).length;

  const shouldRender = entityLevel
    ? !hasMultipleEntities && (selectedEntitiesCount === 1 || !isCurrentRowEmpty)
    : true;
  const isSectionDisabled = !entityLevel && !hasMultipleEntities;
  const isDuplicateRowDisabled = isCurrentRowEmpty || isSectionDisabled;

  const onShowTooltip = () => {
    if (!isDuplicateRowDisabled) {
      setDuplicateRowTooltip(true);
    }
  };

  const onHideTooltip = () => {
    setDuplicateRowTooltip(false);
  };

  const handleDuplicateRowClick = () => {
    if (isDuplicateRowDisabled) return;

    const newId = prepareNewRow(level).id;
    const rest = Object.fromEntries(
      Object.entries(props.data as Record<string, unknown>).filter(
        ([key]) => !EXCLUDED_KEYS.includes(key),
      ),
    );

    const duplicatedRow = { ...(rest as LineItemRow), id: newId } as LineItemRow;

    const key = entityKey || '';
    const currentRows =
      level === LineItemTypes.group
        ? capEventSettingsStore.fundGroupsLineItem || []
        : capEventSettingsStore.entitiesLineItem.get(key) || [];

    const index = currentRows.findIndex((r) => r.id === props.data.id);
    const insertAt = index >= 0 ? index + 1 : currentRows.length;
    const updatedRows = [...currentRows];
    updatedRows.splice(insertAt, 0, duplicatedRow);

    if (level === LineItemTypes.group) {
      capEventSettingsStore.setFundGroupsLineItem(updatedRows);
    } else if (level === LineItemTypes.entity) {
      capEventSettingsStore.setEntitiesLineItem(key, updatedRows);
    }
  };

  return (
    <>
      {shouldRender && (
        <DuplicateRowWrapper
          ref={duplicateRowTooltipRef}
          onMouseEnter={onShowTooltip}
          onMouseLeave={onHideTooltip}
        >
          <DuplicateRowButton
            data-testid={prepareDataTestId('', 'duplicate-row-icon')}
            data-is-disabled={isDuplicateRowDisabled}
            onClick={handleDuplicateRowClick}
          />
          <Tooltip
            tooltipMessage="Duplicate Row"
            showTooltip={showDuplicateRowTooltip}
            targetRef={duplicateRowTooltipRef}
            testId="duplicate-row-icon-tooltip"
          />
        </DuplicateRowWrapper>
      )}
    </>
  );
};

export default DuplicateRowCell;
