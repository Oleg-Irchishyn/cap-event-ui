import Dropdown from '@/app/components/Dropdown';
import { ITEM_STATES } from '@/const/common';
import { FC, useMemo, useState } from 'react';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { CapEventLineItem, MgmtFeeJournalEntry } from '@/clients/CapEventPackage';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { LineItemRow } from '@/app/new/LineItems/types';
import { observer } from 'mobx-react-lite';
import { useToast } from '@/providers/ToastProvider';
import { uuidv4 } from '@/utils/uuid';
import { Loader } from '@/app/new/LineItems/styles';
import { CapEventPackageApi } from '@/api';
import { getStoredSessionId } from '@/utils/sessionIdStorage';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { LineItemTypes } from '@/app/new/LineItems/const';
import { isRowEmpty } from '@/utils/isRowEmpty';

const prepareMgmtEntryOptions = (
  mgmtOptions?: MgmtFeeJournalEntry[],
  selectedBatchNo: number | null = null,
) =>
  mgmtOptions?.map((item) => {
    const formatedDate = new Date(item.batchDate ?? '').toLocaleDateString();

    return {
      ...item,
      state: item.batchNo === selectedBatchNo ? ITEM_STATES.SELECTED : ITEM_STATES.OPTIONAL,
      label: item.amount?.toLocaleString() ?? '',
      displayName: `${item.amount?.toLocaleString()} (${formatedDate})`,
      description: `Posting Date: ${formatedDate}`,
      additionalDescription: `Description: ${item.description}`,
    };
  }) ?? [];

const prepareMgmtFeeLineItems = (
  mgmtFeeLineItems: CapEventLineItem[],
  entityLabel: string,
): LineItemRow[] =>
  mgmtFeeLineItems.map((item) => {
    return {
      ...item,
      id: item.id ?? uuidv4(),
      prDate: new Date(item.prDate ?? entityDatesStore.getEntityDueDate(entityLabel)),
      prFlag: item.prFlag ? 'Yes' : 'No',
      accountNo: item.account.accountNo,
      capitalCategory: item.account.category,
      callDistributionReason: item.account.reason,
      defaultDescription: item.account.description,
      insideCommitment: item.account.insideCmnt ? 'Yes' : 'No',
      investment: item.investment,
      isMfLineItem: true,
      originAccountKey: item.originAccountKey,
    };
  });

type Props = {
  entityId: string;
  entityLabel: string;
};

const ManagementFeeDetails: FC<Props> = ({ entityId, entityLabel }) => {
  const mgmtJournalEntries = capEventSettingsStore.mgmtJournalEntries[entityId];
  const selectedBatchNo = capEventSettingsStore.getSelectedMFItemBatchNo(entityId);
  const includeMFOption = capEventSettingsStore.getIncludeMFOption(entityId);
  const toast = useToast();
  const [searchText, setSearchText] = useState('');
  const [isMgmtFeeLineItemsLoading, setMgmtFeeLineItemsLoading] = useState(false);
  const sessionId = getStoredSessionId() ?? '';

  const includeMFOptions = useMemo(
    () => [
      {
        label: 'Yes',
        state: includeMFOption === 'Yes' ? ITEM_STATES.SELECTED : ITEM_STATES.OPTIONAL,
      },
      {
        label: 'No',
        state: includeMFOption === 'No' ? ITEM_STATES.SELECTED : ITEM_STATES.OPTIONAL,
      },
    ],
    [includeMFOption],
  );

  const MFItems = useMemo(
    () => prepareMgmtEntryOptions(mgmtJournalEntries, selectedBatchNo),
    [mgmtJournalEntries, selectedBatchNo],
  );

  const handleSelectMFItem = async (item?: DropdownItemType<MgmtFeeJournalEntry>) => {
    const currentSelectedBatchNo = capEventSettingsStore.getSelectedMFItemBatchNo(entityId);
    if (item?.batchNo && currentSelectedBatchNo === item.batchNo) return;

    if (item?.batchNo) {
      setMgmtFeeLineItemsLoading(true);
      capEventSettingsStore.setSelectedMFItemBatchNo(entityId, item?.batchNo);
      let mgmtFeeLineItems: CapEventLineItem[] = [];
      try {
        mgmtFeeLineItems = await CapEventPackageApi.default.getMgmtFeeLineItems(
          Number(item.batchNo),
          entityId,
          sessionId,
        );
      } catch (error) {
        toast.error('Error getting mgmt fee line item');
        console.error(error);

        capEventSettingsStore.setSelectedMFItemBatchNo(entityId, null);
        // remove isMfLineItem line items
        const filteredLineItems = (
          capEventSettingsStore.entitiesLineItem.get(entityLabel) || []
        )?.filter((item) => !item.isMfLineItem);
        capEventSettingsStore.setEntitiesLineItem(entityLabel, filteredLineItems);

        return;
      } finally {
        setMgmtFeeLineItemsLoading(false);
      }

      const entityLineItemsWithoutMgmtFee =
        capEventSettingsStore.entitiesLineItem
          .get(entityLabel)
          ?.filter((item) => !item.isMfLineItem && !isRowEmpty(item)) ?? [];

      capEventSettingsStore.setEntitiesLineItem(entityLabel, [
        ...entityLineItemsWithoutMgmtFee,
        ...prepareMgmtFeeLineItems(mgmtFeeLineItems, entityLabel),
      ]);
    } else {
      // remove isMfLineItem line items
      const filteredLineItems = (
        capEventSettingsStore.entitiesLineItem.get(entityLabel) || []
      )?.filter((item) => !item.isMfLineItem);

      const nextItems =
        filteredLineItems.length > 0 ? filteredLineItems : [prepareNewRow(LineItemTypes.entity)];

      capEventSettingsStore.setEntitiesLineItem(entityLabel, nextItems);
    }
  };

  const handleChangeIncludeMF = (item: DropdownItemType) => {
    const option = item.label as 'Yes' | 'No';
    capEventSettingsStore.setIncludeMFOption(entityId, option);

    if (item.label === 'No') {
      // Clear any MF selection
      capEventSettingsStore.setSelectedMFItemBatchNo(entityId, null);
      // call with no params to reset selected item
      handleSelectMFItem();
    }
  };

  const isIncludedMFSetToYes = includeMFOption === 'Yes';

  const visibleMFItems = MFItems.filter(
    (item) =>
      item.label.toLowerCase().includes(searchText.toLowerCase()) ||
      item.description.toLowerCase().includes(searchText.toLowerCase()) ||
      item.additionalDescription.toLowerCase().includes(searchText.toLowerCase()),
  );

  return (
    <>
      <Dropdown
        isCompact
        items={includeMFOptions}
        selectedItems={includeMFOptions.filter((item) => item.state === ITEM_STATES.SELECTED)}
        selectHandler={handleChangeIncludeMF}
        placeholder="Select Option"
        label="Include Uncalled Mgmt Fee"
        testId="include-mf"
      />
      {isIncludedMFSetToYes && (
        <>
          <Dropdown
            isCompact
            withDescription
            withSearch={MFItems.length > 3}
            searchText={searchText}
            onSearchChangeHandler={setSearchText}
            items={visibleMFItems}
            selectedItems={visibleMFItems.filter((item) => item.state === ITEM_STATES.SELECTED)}
            selectHandler={handleSelectMFItem}
            placeholder="Select Option"
            label={`MF Calculated Amount`}
            additionalLabel={`(${MFItems.length} items available)`}
            testId="mgmt-entries"
            noDataText="No Data Available"
          />
          {isMgmtFeeLineItemsLoading && <Loader />}
        </>
      )}
    </>
  );
};

export default observer(ManagementFeeDetails);
