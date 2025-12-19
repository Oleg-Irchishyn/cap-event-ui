import { FC, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { observer } from 'mobx-react-lite';

import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import Tooltip from '@/app/components/Tooltip';
import { hasRequiredFieldsForPreview } from '@/app/new/LineItems/utils';

import { LineItemTypes } from '../const';
import { CellWrapper, PreviewButton } from '../styles';
import { getValidDate } from '@/utils/getValidDate';

const PreviewIconCell: FC<ICellRendererParams> = (props) => {
  const [showPreviewTooltip, setPreviewTooltip] = useState(false);
  const previewTooltipRef = useRef<HTMLDivElement | null>(null);

  const { level, entityKey } = props.colDef?.cellEditorParams ?? {};

  const validDueDate = getValidDate(entityDatesStore.getEntityDueDate(entityKey));
  const hasDueDate = !!validDueDate;

  const isDueDateInputValid = entityDatesStore.getEntityDueDateInputValidity(entityKey);
  const isPreviewDisabled =
    !hasRequiredFieldsForPreview(props.data) || !hasDueDate || !isDueDateInputValid;

  const handlePreviewClick = () => {
    if (isPreviewDisabled) return;
    capEventSettingsStore.setAllocationPreviewModalEntityId(props.data.id);
    capEventSettingsStore.setAllocationPreviewModalTitle(entityKey);
    capEventSettingsStore.setAllocationPreviewOpen(true);
  };

  const onShowTooltip = () => {
    setPreviewTooltip(true);
  };

  const onHideTooltip = () => {
    setPreviewTooltip(false);
  };

  return (
    <>
      {level === LineItemTypes.entity && (
        <CellWrapper
          ref={previewTooltipRef}
          onMouseEnter={onShowTooltip}
          onMouseLeave={onHideTooltip}
          onClick={handlePreviewClick}
          data-testid={prepareDataTestId('', 'preview-icon-wrapper')}
        >
          <PreviewButton
            data-is-disabled={isPreviewDisabled}
            data-testid={prepareDataTestId('', 'preview-icon')}
          />
          <Tooltip
            tooltipMessage={
              isPreviewDisabled ? 'Not all required fields are populated' : 'Allocation Preview'
            }
            showTooltip={showPreviewTooltip}
            targetRef={previewTooltipRef}
            testId="preview-icon-tooltip"
          />
        </CellWrapper>
      )}
    </>
  );
};

export default observer(PreviewIconCell);
