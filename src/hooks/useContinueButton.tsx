import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { investmentMandatoryCategories } from '@/app/new/LineItems/const';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ITEM_STATES } from '@/const/common';
import { getValidDate } from '@/utils/getValidDate';
import { isRowEmpty } from '@/utils/isRowEmpty';
import { NORMALIZE_DASHES_REGEX, NORMALIZE_SPACES_REGEX } from '@/const/regExps';

const TOOLTIP_MESSAGE = 'Not all required fields are populated';

const useContinueButton = () => {
  const isEntityRowValid = (row: LineItemRow): boolean => {
    const normalizeCategory = (value: string) =>
      (value || '')
        .replace(NORMALIZE_DASHES_REGEX, '-')
        .replace(NORMALIZE_SPACES_REGEX, ' ')
        .trim()
        .toLowerCase();

    const normalizedMandatory = investmentMandatoryCategories.map(normalizeCategory);

    const isInvestmentRequired = normalizedMandatory.includes(
      normalizeCategory(row.capitalCategory ?? ''),
    );

    const hasRequiredBaseFields =
      !!row.capitalCategory &&
      !!row.callDistributionReason &&
      !!row.defaultDescription &&
      !!row.insideCommitment &&
      !!row.allocationBasis;

    const hasValidAmount = row.amount !== null && row.amount !== undefined && row.amount !== 0;

    const hasValidInvestment = !isInvestmentRequired || !!row.investment;

    return hasRequiredBaseFields && hasValidAmount && hasValidInvestment;
  };

  const selectedEntities = capEventSettingsStore.fundEntities.filter(
    (e) => e.state === ITEM_STATES.SELECTED,
  );

  const canRenderEntities = !!entityDatesStore.noticeDate || entityDatesStore.hasDifferentDates;

  const isRowEffectivelyEmpty = (row: LineItemRow): boolean => {
    return isRowEmpty(row);
  };

  const isEntityEffectivelyEmpty = (rows: LineItemRow[] | undefined): boolean => {
    const validRows = rows ?? [];
    return validRows.every((row) => isRowEffectivelyEmpty(row));
  };

  const entityDatesAreValid = (label: string) => {
    const validNoticeDate = getValidDate(entityDatesStore.getEntityNoticeDate(label));
    const validDueDate = getValidDate(entityDatesStore.getEntityDueDate(label));
    return !!validNoticeDate && !!validDueDate;
  };

  let hasAtLeastOneValidEntity = false;
  let hasInvalidEntity = false;
  if (canRenderEntities) {
    for (const entity of selectedEntities) {
      const label = entity.label ?? '';
      const entityRows = capEventSettingsStore.entitiesLineItem.get(label);

      if (isEntityEffectivelyEmpty(entityRows)) continue;

      const nonEmptyRows = (entityRows ?? []).filter((row) => !isRowEffectivelyEmpty(row));
      if (nonEmptyRows.length === 0) continue;

      const someRowsValid = nonEmptyRows.some((row) => isEntityRowValid(row));
      const allRowsValid = nonEmptyRows.every((row) => isEntityRowValid(row));
      const datesValid = entityDatesAreValid(label);

      // If entity has any valid rows but invalid dates, it should disable Continue
      if (!datesValid && someRowsValid) {
        hasInvalidEntity = true;
        continue;
      }

      // At this point, dates are valid. Invalid rows block; all-valid rows enable.
      if (!allRowsValid) {
        hasInvalidEntity = true;
      } else {
        hasAtLeastOneValidEntity = true;
      }
    }
  }

  const hasAttachmentErrors = capEventSettingsStore.hasAttachmentErrors;

  // If at least one entity is fully valid, relax the global Notice Date requirement
  // by treating "hasDifferentDates" as true for the general settings emptiness check.
  const isGeneralSettingsEmpty = capEventSettingsStore.isGeneralSettingsEmpty(
    entityDatesStore.noticeDate,
    entityDatesStore.hasDifferentDates || (canRenderEntities && hasAtLeastOneValidEntity),
  );

  const isContinueDisabled =
    isGeneralSettingsEmpty || hasAttachmentErrors || hasInvalidEntity || !hasAtLeastOneValidEntity;
  const tooltipMessage = isContinueDisabled ? TOOLTIP_MESSAGE : '';

  return { isContinueDisabled, tooltipMessage };
};

export default useContinueButton;
