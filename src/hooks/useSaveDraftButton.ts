import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { isRowEmpty } from '@/utils/isRowEmpty';
import { isLineItemRowValid } from '@/utils/investment';

const useSaveDraftButton = () => {
  const isFundGroupLineItemEmpty = capEventSettingsStore.fundGroupsLineItem.every((item) =>
    isRowEmpty(item),
  );
  const isFundGroupEmptyOrFilled =
    isFundGroupLineItemEmpty || capEventSettingsStore.isFundGroupLineItemsFilled;

  const isAllEntitiesLineItemsEmpty = capEventSettingsStore.entitiesLineItem
    .values()
    .every((lineItems) => lineItems.every((item) => isRowEmpty(item)));
  const isLineItemFullyFilled = capEventSettingsStore.entitiesLineItem
    .values()
    .every((lineItems) => {
      const nonEmptyRows = lineItems.filter((item) => !isRowEmpty(item));
      return nonEmptyRows.every((item) => isLineItemRowValid(item));
    });

  const isEntitiesEmptyOrFilled = isAllEntitiesLineItemsEmpty || isLineItemFullyFilled;

  const isSaveDraftDisabled =
    capEventSettingsStore.isGeneralSettingsEmpty(
      entityDatesStore.noticeDate,
      entityDatesStore.hasDifferentDates,
    ) ||
    Object.values(entityDatesStore.entityDates).some((item) => !item.dueDate) ||
    !isFundGroupEmptyOrFilled ||
    !isEntitiesEmptyOrFilled;

  return { isSaveDraftDisabled };
};

export default useSaveDraftButton;
