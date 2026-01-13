import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

import Button, { BUTTON_THEMES } from '@/app/components/Button';
import Tooltip from '@/app/components/Tooltip';
import type { Investment } from '@/app/new/LineItems/types';

import { CapEventPackageApi } from '@/api';
import { CapEvent, CapEventStatus, CapEventType } from '@/clients/CapEventPackage';
import { ITEM_STATES } from '@/const/common';
import { ROUTES } from '@/const/routes';
import { useToast } from '@/providers/ToastProvider';

import { capEventSettingsStore, entityDatesStore, previewScreenStore } from '@/stores';
import { formatDate } from '@/utils/formatDate';
import { isLineItemRowValid } from '@/utils/investment';
import { isCapEventLineItemsFilled } from '@/utils/isFundGroupLineItemsFilled';
import { getStoredSessionId } from '@/utils/sessionIdStorage';
import { showErrorToast } from '@/utils/showErrorToast';

import { SubmitButtonWrapper } from './styles';

const isNamedObject = (v: unknown): v is { id?: unknown; name?: unknown } => {
  if (typeof v !== 'object' || v === null) return false;
  return 'id' in v || 'name' in v;
};

const SubmitButton = () => {
  const toast = useToast();
  const router = useRouter();

  const submitTooltipRef = useRef<HTMLDivElement | null>(null);

  const [showSubmitTooltip, setShowSubmitTooltip] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isSubmitDisabled =
    isSubmitting || previewScreenStore.isLoading || !previewScreenStore.hasAggregatedLineItems();

  const onShowTooltip = () => {
    if (!isSubmitDisabled) {
      setShowSubmitTooltip(true);
    }
  };

  const onHideTooltip = () => {
    setShowSubmitTooltip(false);
  };

  const handleSaveCapEvent = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    try {
      const sessionId = getStoredSessionId() ?? '';

      const selectedEntities = capEventSettingsStore.fundEntities.filter(
        (ent) => ent.state === ITEM_STATES.SELECTED,
      );

      const selectedType = capEventSettingsStore.eventTypes.find(
        (type) => type.state === ITEM_STATES.SELECTED,
      ) as Partial<CapEventType> | undefined;
      const selectedSponsorItem = capEventSettingsStore.sponsors.find(
        (s) => s.state === ITEM_STATES.SELECTED,
      );
      const selectedFundGroupItem = capEventSettingsStore.fundGroups.find(
        (g) => g.state === ITEM_STATES.SELECTED,
      );
      const selectedSponsor = isNamedObject(selectedSponsorItem) ? selectedSponsorItem : undefined;
      const selectedFundGroup = isNamedObject(selectedFundGroupItem)
        ? selectedFundGroupItem
        : undefined;

      const requestBody: CapEvent = {
        capEventType: {
          id: String(selectedType?.id ?? ''),
          abbreviation: (selectedType as { abbreviation?: string })?.abbreviation,
          name: (selectedType as { name?: string })?.name,
          description: (selectedType as { description?: string })?.description,
        },
        sponsor: {
          id: String(selectedSponsor?.id ?? ''),
          name: selectedSponsor?.name,
        } as unknown as CapEvent['sponsor'],
        fundGroup: {
          id: String(selectedFundGroup?.id ?? ''),
          name: selectedFundGroup?.name,
        } as unknown as CapEvent['fundGroup'],
        entities: selectedEntities.map((ent) => ({
          id: String(ent.id ?? ''),
          name: ent.name,
        })),
        noticeDate: formatDate(entityDatesStore.noticeDate),
        capEventFundGroupLineItems:
          selectedEntities.length < 2 ||
          !isCapEventLineItemsFilled(capEventSettingsStore.fundGroupsStateAfterApply)
            ? []
            : capEventSettingsStore.fundGroupsStateAfterApply.map((fundGroupLineItem) => {
                const investment = fundGroupLineItem.investment;
                const invId =
                  typeof investment === 'string' ? investment : String(investment?.id ?? '');
                const invPayload = invId
                  ? {
                      id: invId,
                      name: typeof investment === 'object' ? investment?.name : undefined,
                      title: typeof investment === 'object' ? investment?.title : undefined,
                      type: typeof investment === 'object' ? investment?.type : undefined,
                    }
                  : undefined;
                const allocationBasisId = capEventSettingsStore.getAllocationBasisId(
                  fundGroupLineItem.allocationBasis,
                );
                return {
                  inheritanceId: fundGroupLineItem.inheritanceId,
                  investment: invPayload ?? (null as unknown as Investment),
                  allocationBasisId,
                  allocationBasis: fundGroupLineItem.allocationBasis,
                  amount: fundGroupLineItem.amount,
                  account: {
                    accountNo: fundGroupLineItem.accountNo ?? '',
                    capitalCategory: fundGroupLineItem.capitalCategory,
                    callDistributionReason: fundGroupLineItem.callDistributionReason,
                    defaultDescription: fundGroupLineItem.defaultDescription,
                    insideCommitment: fundGroupLineItem.insideCommitment?.toLowerCase(),
                  },
                };
              }),
        capEventEntityLineItems: [...capEventSettingsStore.entitiesLineItem].map(
          ([key, entityLineItems]) => {
            const validLineItems = entityLineItems.filter(isLineItemRowValid);
            return {
              entity: {
                id: capEventSettingsStore.fundEntities.find((ent) => ent.label === key)?.id ?? '',
                name: capEventSettingsStore.fundEntities.find((ent) => ent.label === key)?.name,
              },
              noticeDate: formatDate(entityDatesStore.entityDates[key].noticeDate),
              dueDate: formatDate(entityDatesStore.entityDates[key].dueDate),
              capEventLineItems: validLineItems.map((entityLineItem) => {
                const investment = entityLineItem.investment;
                const invId =
                  typeof investment === 'string' ? investment : String(investment?.id ?? '');
                const invPayload = invId
                  ? {
                      id: invId,
                      name: typeof investment === 'object' ? investment?.name : undefined,
                      title: typeof investment === 'object' ? investment?.title : undefined,
                      type: typeof investment === 'object' ? investment?.type : undefined,
                    }
                  : undefined;
                const allocationBasisId = capEventSettingsStore.getAllocationBasisId(
                  entityLineItem.allocationBasis,
                );
                return {
                  allocationBasisId,
                  allocationBasis: entityLineItem.allocationBasis,
                  amount: entityLineItem.amount,
                  fundGroupLineItemInheritanceId: entityLineItem.fundGroupLineItemInheritanceId,
                  prDate: formatDate(entityLineItem.prDate),
                  prFlag: entityLineItem.prFlag === 'Yes',
                  isMfLineItem: entityLineItem.isMfLineItem ?? false,
                  batchNo: entityLineItem.batchNo,
                  originAccountKey: entityLineItem.accountKey,
                  account: {
                    accountNo: entityLineItem.accountNo ?? '',
                    capitalCategory: entityLineItem.capitalCategory,
                    callDistributionReason: entityLineItem.callDistributionReason,
                    defaultDescription: entityLineItem.defaultDescription,
                    insideCommitment: entityLineItem.insideCommitment?.toLowerCase(),
                  },
                  investment: invPayload ?? (null as unknown as Investment),
                };
              }),
            };
          },
        ),
      };

      const requestWithAggregatedLineItems =
        previewScreenStore.withAggregatedLineItems(requestBody);

      const response = await CapEventPackageApi.default.submit(
        requestWithAggregatedLineItems,
        sessionId,
      );

      if (response.status === CapEventStatus.SUBMITTED) {
        // Reset selections and dates when leaving the preview screen, till we don't have local data base
        capEventSettingsStore.resetStore();
        entityDatesStore.resetAllDates();
        toast.success('Successfully Saved');
        router.push(ROUTES.MAIN.path);
      }
    } catch (error) {
      showErrorToast(error);
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SubmitButtonWrapper
      ref={submitTooltipRef}
      onMouseEnter={onShowTooltip}
      onMouseLeave={onHideTooltip}
    >
      <Button
        testId="cap-event-submit"
        width="auto"
        onClick={handleSaveCapEvent}
        disabled={isSubmitDisabled}
        buttonTheme={BUTTON_THEMES.primary}
      >
        Save
      </Button>
      <Tooltip
        tooltipMessage="Save Capital Event and Create/Update Case"
        showTooltip={showSubmitTooltip}
        targetRef={submitTooltipRef}
        testId="submit-button-tooltip"
      />
    </SubmitButtonWrapper>
  );
};

export default observer(SubmitButton);
