import { useRef } from 'react';
import { observer } from 'mobx-react-lite';

import Button, { BUTTON_THEMES } from '@/app/components/Button';

import { SubmitButtonWrapper } from './styles';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import {
  CapEvent,
  CapEventStatus,
  CapEventType,
  Entity,
  FundGroup,
  Sponsor,
} from '@/clients/CapEventPackage';
import { ITEM_STATES } from '@/const/common';
import { formatDate } from '@/utils/formatDate';
import { useToast } from '@/providers/ToastProvider';
import { useRouter } from 'next/navigation';
import { ROUTES } from '@/const/routes';
import { isCapEventLineItemsFilled } from '@/utils/isFundGroupLineItemsFilled';
import { CapEventPackageApi } from '@/api';
import { getStoredSessionId } from '@/utils/sessionIdStorage';

const SubmitButton = () => {
  const submitTooltipRef = useRef<HTMLDivElement | null>(null);

  const toast = useToast();

  const router = useRouter();

  const handleSaveCapEvent = async () => {
    try {
      const sessionId = getStoredSessionId() ?? '';

      const selectedEntities = capEventSettingsStore.fundEntities.filter(
        (ent) => ent.state === ITEM_STATES.SELECTED,
      );
      const requestBody: CapEvent = {
        capEventType: capEventSettingsStore.eventTypes.find(
          (type) => type.state === ITEM_STATES.SELECTED,
        ) as CapEventType,
        sponsor: capEventSettingsStore.sponsors.find(
          (sponsor) => sponsor.state === ITEM_STATES.SELECTED,
        ) as Sponsor,
        fundGroup: capEventSettingsStore.fundGroups.find(
          (group) => group.state === ITEM_STATES.SELECTED,
        ) as FundGroup,
        entities: selectedEntities as Entity[],
        noticeDate: formatDate(entityDatesStore.noticeDate),
        capEventFundGroupLineItems:
          selectedEntities.length < 2 ||
          !isCapEventLineItemsFilled(capEventSettingsStore.fundGroupsStateAfterApply)
            ? []
            : capEventSettingsStore.fundGroupsStateAfterApply.map((fundGroupLineItem) => {
                const investment = fundGroupLineItem.investment;
                return {
                  id: fundGroupLineItem.id,
                  investment: {
                    id: investment?.id ?? '',
                    name: investment?.name,
                    title: investment?.title,
                    type: investment?.type,
                  },
                  allocationBasis: fundGroupLineItem.allocationBasis,
                  amount: fundGroupLineItem.amount,
                  account: {
                    accountNo: fundGroupLineItem.accountNo ?? '',
                    category: fundGroupLineItem.capitalCategory,
                    reason: fundGroupLineItem.callDistributionReason,
                    description: fundGroupLineItem.defaultDescription,
                    insideCmnt: fundGroupLineItem.insideCommitment === 'Yes',
                  },
                };
              }),
        capEventEntityLineItems: [...capEventSettingsStore.entitiesLineItem].map(
          ([key, entityLineItems]) => {
            return {
              entity: {
                id: capEventSettingsStore.fundEntities.find((ent) => ent.label === key)?.id ?? '',
                name: capEventSettingsStore.fundEntities.find((ent) => ent.label === key)?.name,
              },
              noticeDate: formatDate(entityDatesStore.entityDates[key].noticeDate),
              dueDate: formatDate(entityDatesStore.entityDates[key].dueDate),
              capEventLineItems: entityLineItems.map((entityLineItem) => {
                const investment = entityLineItem.investment;
                return {
                  allocationBasis: entityLineItem.allocationBasis,
                  amount: entityLineItem.amount,
                  inheritedFundGroupLineItemId: entityLineItem.inheritedFundGroupLineItemId,
                  prDate: formatDate(entityLineItem.prDate),
                  prFlag: entityLineItem.prFlag === 'Yes',
                  account: {
                    accountNo: entityLineItem.accountNo ?? '',
                    category: entityLineItem.capitalCategory,
                    reason: entityLineItem.callDistributionReason,
                    description: entityLineItem.defaultDescription,
                    insideCmnt: entityLineItem.insideCommitment === 'Yes',
                  },
                  investment: {
                    id: investment?.id ?? '',
                    name: investment?.name,
                    title: investment?.title,
                    type: investment?.type,
                  },
                };
              }),
            };
          },
        ),
      };
      const response = await CapEventPackageApi.default.create(sessionId, requestBody);
      if (response.status === CapEventStatus.SUBMITTED) {
        // Reset selections and dates when leaving the preview screen, till we don't have local data base
        capEventSettingsStore.resetAfterPreview();
        entityDatesStore.resetAllDates();
        toast.success('Successfully Saved');
        router.push(ROUTES.MAIN.path);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SubmitButtonWrapper ref={submitTooltipRef}>
      <Button
        testId="allocation-distribution"
        width="auto"
        onClick={handleSaveCapEvent}
        buttonTheme={BUTTON_THEMES.primary}
      >
        Submit
      </Button>
    </SubmitButtonWrapper>
  );
};

export default observer(SubmitButton);
