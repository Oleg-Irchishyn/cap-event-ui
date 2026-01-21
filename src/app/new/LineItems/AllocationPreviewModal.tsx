import { FC, useEffect, useState } from 'react';
import { observer } from 'mobx-react-lite';

import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { CapEventPackageApi } from '@/api';
import Button, { BUTTON_THEMES } from '@/app/components/Button';
import { getValidDate } from '@/utils/getValidDate';
import { AllocationInput } from '@/clients/CapEventPackage';
import type { Investment } from '@/app/new/LineItems/types';
import { getStoredSessionId } from '@/utils/sessionIdStorage';
import { formatAmount } from '@/utils/formatAmount';

import {
  ModalButtonContainer,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalWrapper,
  TotalItemsRow,
} from './styles';
import AllocationPreviewTable from './AllocationPreviewTable';
import { AllocationPreviewMetaDataType } from './types';
import AllocationPreviewMetaData from './AllocationPreviewMetaData';
import { Title } from '../styles';

interface AllocationPreviewModalProps {
  entityId: string;
}

const AllocationPreviewModal: FC<AllocationPreviewModalProps> = ({ entityId }) => {
  const [allocationBasis, setAllocationBasis] = useState<string>('');
  const [isDataLoading, setIsDataLoading] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [allocationPreviewMetaData, setAllocationPreviewMetaData] =
    useState<AllocationPreviewMetaDataType | null>(null);

  const sessionId = getStoredSessionId() ?? '';
  const isModalOpen = capEventSettingsStore.isAllocationPreviewModalOpen;

  const handleCancel = () => {
    capEventSettingsStore.setAllocationPreviewOpen(false);
    capEventSettingsStore.setAllocationPreviewModalData([]);
    setAllocationPreviewMetaData(null);
  };

  useEffect(() => {
    if (!isModalOpen) return;

    const entityKey = capEventSettingsStore.allocationPreviewModalTitle;

    const previewEntityData = capEventSettingsStore.entitiesLineItem
      .get(entityKey)
      ?.find((lineItem) => lineItem.id === capEventSettingsStore.allocationPreviewModaLineItemId);

    const fetchTableData = async () => {
      try {
        setIsDataLoading(true);
        if (previewEntityData) {
          setAllocationBasis(previewEntityData.allocationBasis);

          const allocationBasisId = capEventSettingsStore.getAllocationBasisId(
            previewEntityData.allocationBasis,
          );
          const inv = (previewEntityData as { investment?: string | Investment }).investment;
          const investmentLabel =
            typeof inv === 'string' ? inv : ((inv?.title || inv?.name) ?? '-');
          const amountLabel = formatAmount(previewEntityData.amount ?? 0);
          setAllocationPreviewMetaData({
            callDistributionReason: previewEntityData.callDistributionReason ?? '-',
            investment: investmentLabel,
            txnCurrency: 'USD',
            amount: amountLabel,
            allocationBasis: previewEntityData.allocationBasis ?? '-',
          });

          if (previewEntityData.isMfLineItem) {
            const { batchNo, originAccountKey } = previewEntityData;

            if (batchNo !== undefined && originAccountKey !== undefined) {
              const data = await CapEventPackageApi.default.getAllocatedMgmtFeeJournalEntries(
                batchNo,
                originAccountKey,
                previewEntityData.allocationBasis,
                allocationBasisId,
                entityId,
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
              entityId: entityId,
              dueDate: dueDate || '',
              allocationBasisId,
              accountNo:
                previewEntityData.accountNo ??
                capEventSettingsStore.accounts.find(
                  (acc) =>
                    acc.capitalCategory === previewEntityData.capitalCategory &&
                    acc.callDistributionReason === previewEntityData.callDistributionReason &&
                    acc.insideCommitment === previewEntityData.insideCommitment,
                )?.accountNo ??
                '',
              investmentId: (typeof inv === 'string' ? inv : String(inv?.id ?? '')) ?? '',
              amount: previewEntityData.amount,
            };
            const data = await CapEventPackageApi.default.allocateLineItem(requestBody, sessionId);
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
  }, [isModalOpen, sessionId, entityId]);

  const handleSearchValueChange = (value: string) => {
    setSearchValue(value);
  };

  const clearSearchValue = () => {
    setSearchValue('');
  };

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
          <AllocationPreviewMetaData
            searchValue={searchValue}
            clearSearchValue={clearSearchValue}
            onSearchValueChange={handleSearchValueChange}
            allocationPreviewMetaData={allocationPreviewMetaData}
          />
          <AllocationPreviewTable
            searchValue={searchValue}
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
