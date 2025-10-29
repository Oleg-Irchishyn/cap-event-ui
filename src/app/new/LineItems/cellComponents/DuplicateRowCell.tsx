import { FC, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import Tooltip from '@/app/components/Tooltip';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { capEventSettingsStore } from '@/stores';
import { isRowEmpty } from '@/app/new/LineItems/utils';

import { LineItemTypes } from '../const';
import { DuplicateRowButton, DuplicateRowWrapper } from '../styles';

const DuplicateRowCell: FC<ICellRendererParams> = (props) => {
  const [showDuplicateRowTooltip, setDuplicateRowTooltip] = useState(false);

  const duplicateRowTooltipRef = useRef<HTMLDivElement | null>(null);

  const { level } = props.colDef?.cellEditorParams ?? {};

  const entityLevel = level === LineItemTypes.entity;
  const fundGroupLevel = level === LineItemTypes.group;

  const hasMultipleEntities = capEventSettingsStore.hasMultipleEntitiesChosen;
  const isCurrentRowEmpty = isRowEmpty(props.data);

  const shouldRender = (entityLevel && !hasMultipleEntities) || fundGroupLevel;
  const isSectionDisabled = fundGroupLevel && !hasMultipleEntities; // FG disabled when only 1 entity
  const isDuplicateRowDisabled = isCurrentRowEmpty || isSectionDisabled;

  return (
    <>
      {shouldRender && (
        <DuplicateRowWrapper
          ref={duplicateRowTooltipRef}
          onMouseEnter={() => !isDuplicateRowDisabled && setDuplicateRowTooltip(true)}
          onMouseLeave={() => setDuplicateRowTooltip(false)}
        >
          <DuplicateRowButton
            data-testid={prepareDataTestId('', 'duplicate-row-icon')}
            data-is-disabled={isDuplicateRowDisabled}
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
