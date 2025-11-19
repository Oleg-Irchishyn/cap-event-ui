import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { investmentMandatoryCategories } from '@/app/new/LineItems/const';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ITEM_STATES } from '@/const/common';
import { getValidDate } from '@/utils/getValidDate';
import { isRowEmpty } from '@/utils/isRowEmpty';
import { NORMALIZE_DASHES_REGEX, NORMALIZE_SPACES_REGEX } from '@/const/regExps';

const TOOLTIP_MESSAGE = 'Not all required fields are populated';

const useContinueButton = () => {
  const isGeneralSettingsEmpty = capEventSettingsStore.isGeneralSettingsEmpty(
    entityDatesStore.noticeDate,
    entityDatesStore.hasDifferentDates,
  );

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

  const isRowEffectivelyEmpty = (row: LineItemRow): boolean => {
    const isCategoryMandatory = investmentMandatoryCategories
      .map((c) => c.toLowerCase())
      .includes((row.capitalCategory ?? '').toLowerCase());

    if (isCategoryMandatory) {
      return !row.investment;
    }

    return isRowEmpty(row);
  };

  const isEntityEffectivelyEmpty = (rows: LineItemRow[] | undefined): boolean => {
    const validRows = rows ?? [];
    return validRows.every((row) => isRowEffectivelyEmpty(row));
  };

  const entityDatesAreValid = (label: string) => {
    const validNoticeDate = getValidDate(entityDatesStore.getEntityNoticeDate(label));
    const validDueDate = getValidDate(entityDatesStore.getEntityDueDate(label));
    const isDueDateInputValid = entityDatesStore.getEntityDueDateInputValidity(label);
    const isNoticeDateInputValid = entityDatesStore.getEntityNoticeDateInputValidity(label);
    return !!validNoticeDate && !!validDueDate && isDueDateInputValid && isNoticeDateInputValid;
  };

  const hasAtLeastOneValidEntity = selectedEntities.some((entity) => {
    const label = entity.label ?? '';
    const entityRows = capEventSettingsStore.entitiesLineItem.get(label);

    if (isEntityEffectivelyEmpty(entityRows)) return false;

    const hasValidRow = (entityRows ?? []).some((row) => isEntityRowValid(row));
    const datesValid = entityDatesAreValid(label);

    return hasValidRow && datesValid;
  });

  const hasAttachmentErrors = capEventSettingsStore.hasAttachmentErrors;

  const isContinueDisabled =
    isGeneralSettingsEmpty || hasAttachmentErrors || !hasAtLeastOneValidEntity;
  const tooltipMessage = isContinueDisabled ? TOOLTIP_MESSAGE : '';

  return { isContinueDisabled, tooltipMessage };
};

export default useContinueButton;
