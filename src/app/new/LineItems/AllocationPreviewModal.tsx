import { FC, useEffect, useState } from 'react';
import Button, { BUTTON_THEMES } from '@/app/components/Button';
import {
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalWrapper,
  TotalItemsRow,
} from './styles';
import { Title } from '../styles';
import AllocationPreviewTable from './AllocationPreviewTable';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { CapEventPackageApi } from '@/api';
import { getValidDate } from '@/utils/getValidDate';
import { ALLOCATION_BASIS_DEFAULT_OPTIONS } from '@/const/allocationBasisOptions';
import { AllocationInput } from '@/clients/CapEventPackage';
import { getStoredSessionId } from '@/utils/sessionIdStorage';

const AllocationPreviewModal: FC = () => {
  const [allocationBasis, setAllocationBasis] = useState<string>('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const sessionId = getStoredSessionId() ?? '';

  const isModalOpen = capEventSettingsStore.isAllocationPreviewModalOpen;

  const handleCancel = () => {
    capEventSettingsStore.setAllocationPreviewOpen(false);
    capEventSettingsStore.setAllocationPreviewModalData([]);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const entityKey = capEventSettingsStore.allocationPreviewModalTitle;

    const previewEntityData = capEventSettingsStore.entitiesLineItem
      .get(entityKey)
      ?.find((entity) => entity.id === capEventSettingsStore.allocationPreviewModalEntityId);

    const fetchTableData = async () => {
      try {
        setIsDataLoading(true);
        if (previewEntityData) {
          setAllocationBasis(previewEntityData.allocationBasis);

          if (previewEntityData.isMfLineItem) {
            const { batchNo, originAccountKey } = previewEntityData;

            if (batchNo !== undefined && originAccountKey !== undefined) {
              const data = await CapEventPackageApi.default.getAllocatedMgmtFeeJournalEntries(
                batchNo,
                originAccountKey,
                previewEntityData.allocationBasis,
                sessionId,
              );
              capEventSettingsStore.setAllocationPreviewModalData(data);
            }
          } else {
            const validDueDate = getValidDate(entityDatesStore.getEntityDueDate(entityKey));
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
              allocationBasis: ALLOCATION_BASIS_DEFAULT_OPTIONS[previewEntityData.allocationBasis],
              accountNo:
                previewEntityData.accountNo ??
                capEventSettingsStore.accounts.find(
                  (acc) =>
                    acc.capitalCategory === previewEntityData.capitalCategory &&
                    acc.callDistributionReason === previewEntityData.callDistributionReason &&
                    acc.insideCommitment === previewEntityData.insideCommitment,
                )?.accountNo ??
                '',
              investmentId: previewEntityData.investment?.id ?? '',
              amount: previewEntityData.amount,
            };

            const data = await CapEventPackageApi.default.allocateLineItem(sessionId, requestBody);
            capEventSettingsStore.setAllocationPreviewModalData(data);
          }
        }
      } catch (e) {
        console.error(e);
      } finally {
        setIsDataLoading(false);
      }
    };

    fetchTableData();
  }, [isModalOpen, sessionId]);

  if (!isModalOpen) return null;

  const itemCount = capEventSettingsStore.allocationPreviewModalData.length;

  return (
    <ModalWrapper>
      <ModalContainer>
        <ModalHeader>
          <Title>{`Preview - ${capEventSettingsStore.allocationPreviewModalTitle}`}</Title>
          <ModalButtonContainer>
            <Button
              testId="confirmation-modal-cancel"
              width="auto"
              onClick={handleCancel}
              buttonTheme={BUTTON_THEMES.secondary}
            >
              Cancel
            </Button>
          </ModalButtonContainer>
        </ModalHeader>
        <ModalContent>
          <AllocationPreviewTable
            isLoading={isDataLoading}
            allocationBasis={allocationBasis}
            rows={capEventSettingsStore.allocationPreviewModalData}
          />
        </ModalContent>
        {!isDataLoading && itemCount > 0 && (
          <TotalItemsRow>
            {itemCount} {itemCount === 1 ? 'item' : 'items'} shown
          </TotalItemsRow>
        )}
      </ModalContainer>
    </ModalWrapper>
  );
};

export default observer(AllocationPreviewModal);
