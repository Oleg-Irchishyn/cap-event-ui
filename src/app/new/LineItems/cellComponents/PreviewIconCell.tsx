import { FC, useRef, useState } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { observer } from 'mobx-react-lite';

import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import Tooltip from '@/app/components/Tooltip';
import { hasRequiredFieldsForPreview } from '@/app/new/LineItems/utils';

import { LineItemTypes } from '../const';
import { PreviewButton, PreviewWrapper } from '../styles';
import { AllocationInput } from '@/clients/CapEventPackage';
import { ALLOCATION_BASIS_DEFAULT_OPTIONS } from '@/const/allocationBasisOptions';
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
    const date = validDueDate ?? new Date();
    const dueDate =
      date.getFullYear() +
      '-' +
      String(date.getMonth() + 1).padStart(2, '0') +
      '-' +
      String(date.getDate()).padStart(2, '0');

    const requestBody: AllocationInput = {
      entityId: entityKey.split(' - ')[0],
      dueDate: dueDate || '',
      allocationBasis: ALLOCATION_BASIS_DEFAULT_OPTIONS[props.data.allocationBasis],
      accountNo:
        props.data?.accountNo ??
        capEventSettingsStore.accounts.find(
          (acc) =>
            acc.capitalCategory === props.data.capitalCategory &&
            acc.callDistributionReason === props.data.callDistributionReason &&
            acc.insideCommitment === props.data.insideCommitment,
        )?.accountNo ??
        '',
      investmentId:
        capEventSettingsStore.investments.find((inv) => inv.name === props.data.investment)?.id ??
        '',
      amount: props.data.amount,
    };
    capEventSettingsStore.setAllocationPreviewModalAllocationBasis(props.data.allocationBasis);
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

export default observer(PreviewIconCell);
