import { FC, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { entityDatesStore } from '@/stores';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import Tooltip from '@/app/components/Tooltip';
import { isRowEmpty } from '@/app/new/LineItems/utils';

import { LineItemTypes } from '../const';
import { PreviewButton, PreviewWrapper } from '../styles';

const PreviewIconCell: FC<ICellRendererParams> = (props) => {
  const [showPreviewTooltip, setPreviewTooltip] = useState(false);
  const previewTooltipRef = useRef<HTMLDivElement | null>(null);

  const { level, entityKey } = props.colDef?.cellEditorParams ?? {};

  const isPreviewDisabled =
    isRowEmpty(props.data) || !(entityDatesStore.getEntityDueDate(entityKey) instanceof Date);

  const handlePreviewClick = () => {
    if (isPreviewDisabled) return;
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

export default PreviewIconCell;
