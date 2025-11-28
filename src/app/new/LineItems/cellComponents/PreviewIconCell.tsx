import { FC, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { observer } from 'mobx-react-lite';

import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import Tooltip from '@/app/components/Tooltip';
import { hasRequiredFieldsForPreview } from '@/app/new/LineItems/utils';

import { LineItemTypes } from '../const';
import { PreviewButton, PreviewWrapper } from '../styles';
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
    if (isPreviewDisabled) {
      setPreviewTooltip(true);
    }
  };

  const onHideTooltip = () => {
    setPreviewTooltip(false);
  };

  return (
    <>
      {level === LineItemTypes.entity && (
        <PreviewWrapper
          ref={previewTooltipRef}
          onMouseEnter={onShowTooltip}
          onMouseLeave={onHideTooltip}
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
    </>
  );
};

export default observer(PreviewIconCell);
