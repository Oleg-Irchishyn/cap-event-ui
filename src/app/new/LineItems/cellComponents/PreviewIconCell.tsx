import { FC, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import Tooltip from '@/app/components/Tooltip';
import { isRowEmpty } from '@/app/new/LineItems/utils';

import { LineItemTypes } from '../const';
import { PreviewButton, PreviewWrapper } from '../styles';
import { AllocationInput } from '@/clients/CapEventPackage';

const PreviewIconCell: FC<ICellRendererParams> = (props) => {
  const [showPreviewTooltip, setPreviewTooltip] = useState(false);
  const previewTooltipRef = useRef<HTMLDivElement | null>(null);

  const { level, entityKey } = props.colDef?.cellEditorParams ?? {};

  const isPreviewDisabled =
    isRowEmpty(props.data) || !(entityDatesStore.getEntityDueDate(entityKey) instanceof Date);

  const handlePreviewClick = () => {
    if (isPreviewDisabled) return;
    const date = new Date(entityDatesStore.getEntityDueDate(entityKey) ?? new Date());
    const dueDate =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0');

    const requestBody: AllocationInput = {
      entityId: entityKey.split(' - ')[0],
      dueDate: dueDate || '',
      allocationBasis: props.data.allocationBasis,
      accountNo:
        capEventSettingsStore.accounts.find(
          (acc) =>
            acc.capitalCategory === props.data.capitalCategory &&
            acc.callDistributionReason === props.data.callDistributionReason &&
            acc.insideCommitment === props.data.insideCommitment,
        )?.accountNo ?? '',
      investmentId:
        capEventSettingsStore.investments.find((inv) => inv.name === props.data.investment)?.id ??
        '',
      amount: props.data.amount,
    };
    capEventSettingsStore.setAllocationPreviewOpen(true, requestBody, entityKey);
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
