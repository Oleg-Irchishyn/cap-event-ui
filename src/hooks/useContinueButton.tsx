import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ITEM_STATES } from '@/const/common';
import { getValidDate } from '@/utils/getValidDate';
import { isRowEmpty } from '@/utils/isRowEmpty';
import { isLineItemRowValid } from '@/utils/investment';

const TOOLTIP_DISABLED_MESSAGE = 'Not all required fields are populated';
const TOOLTIP_ENABLED_MESSAGE = 'Go to Preview Screen';

const useContinueButton = () => {
  const isEntityRowValid = (row: LineItemRow): boolean => isLineItemRowValid(row);

  const selectedEntities = capEventSettingsStore.fundEntities.filter(
    (e) => e.state === ITEM_STATES.SELECTED,
  );

  const canRenderEntities = !!entityDatesStore.noticeDate || entityDatesStore.hasDifferentDates;

  const isRowEffectivelyEmpty = (row: LineItemRow & { isTotalRow?: boolean }): boolean => {
    if (row?.isTotalRow) return true;
    return isRowEmpty(row);
  };

  // helper retained for clarity if needed in future; currently not used

  const entityDatesAreValid = (label: string) => {
    const validNoticeDate = getValidDate(entityDatesStore.getEntityNoticeDate(label));
    const validDueDate = getValidDate(entityDatesStore.getEntityDueDate(label));
    const isDueDateInputValid = entityDatesStore.getEntityDueDateInputValidity(label);
    const isNoticeDateInputValid = entityDatesStore.getEntityNoticeDateInputValidity(label);

    return !!validNoticeDate && !!validDueDate && isDueDateInputValid && isNoticeDateInputValid;
  };

  const allEntitiesFullyValid =
    canRenderEntities &&
    selectedEntities.length > 0 &&
    selectedEntities.every((entity) => {
      const label = entity.label ?? '';
      const entityRows = capEventSettingsStore.entitiesLineItem.get(label);
      const nonEmptyRows = (entityRows ?? []).filter((row) => !isRowEffectivelyEmpty(row));
      if (nonEmptyRows.length === 0) return false;

      const someRowsValid = nonEmptyRows.some((row) => isEntityRowValid(row));
      const allRowsValid = nonEmptyRows.every((row) => isEntityRowValid(row));
      const datesValid = entityDatesAreValid(label);

      if (!datesValid && someRowsValid) return false;
      return datesValid && someRowsValid && allRowsValid;
    });

  const hasAttachmentErrors = capEventSettingsStore.hasAttachmentErrors;

  // Relax general notice requirement only if all selected entities are fully valid
  const isGeneralSettingsEmpty = capEventSettingsStore.isGeneralSettingsEmpty(
    entityDatesStore.noticeDate,
    entityDatesStore.hasDifferentDates || allEntitiesFullyValid,
  );

  const isContinueDisabled =
    isGeneralSettingsEmpty ||
    hasAttachmentErrors ||
    !allEntitiesFullyValid ||
    !capEventSettingsStore.isNoticeDateValid;
  const tooltipMessage = isContinueDisabled ? TOOLTIP_DISABLED_MESSAGE : TOOLTIP_ENABLED_MESSAGE;

  return { isContinueDisabled, tooltipMessage };
};

export default useContinueButton;
