import Dropdown from '@/app/components/Dropdown';
import { ITEM_STATES } from '@/const/common';
import { FC, useEffect, useState } from 'react';
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

const preparedIncludeMFOptions = [
  {
    label: 'Yes',
    state: ITEM_STATES.OPTIONAL,
  },
  {
    label: 'No',
    state: ITEM_STATES.SELECTED,
  },
];

const prepareMgmtEntryOptions = (mgmtOptions?: MgmtFeeJournalEntry[]) =>
  mgmtOptions?.map((item) => {
    const formatedDate = new Date(item.batchDate ?? '').toLocaleDateString();

    return {
      ...item,
      state: ITEM_STATES.OPTIONAL,
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
      mgmtFee: true,
    };
  });

type Props = {
  entityId: string;
  entityLabel: string;
};

const ManagementFeeDetails: FC<Props> = ({ entityId, entityLabel }) => {
  const mgmtFeeLineItems = capEventSettingsStore.mgmtJournalEntries[entityId];
  const toast = useToast();
  const [includeMFOptions, setIncludeMFOptions] = useState(preparedIncludeMFOptions);
  const [MFItems, setMFItems] = useState(
    prepareMgmtEntryOptions(capEventSettingsStore.mgmtJournalEntries[entityId]),
  );
  const [searchText, setSearchText] = useState('');
  const [isMgmtFeeLineItemsLoading, setMgmtFeeLineItemsLoading] = useState(false);
  const sessionId = getStoredSessionId() ?? '';

  useEffect(() => {
    setMFItems((prev) => {
      const previouslySelectedLabel =
        prev.find((opt) => opt.state === ITEM_STATES.SELECTED)?.label ?? '';
      const freshOptions = prepareMgmtEntryOptions(
        capEventSettingsStore.mgmtJournalEntries[entityId],
      );

      if (!previouslySelectedLabel) {
        return freshOptions;
      }

      const stillExists = freshOptions.some((opt) => opt.label === previouslySelectedLabel);
      if (!stillExists) {
        return freshOptions;
      }

      return freshOptions.map((opt) =>
        opt.label === previouslySelectedLabel ? { ...opt, state: ITEM_STATES.SELECTED } : opt,
      );
    });
  }, [entityId, mgmtFeeLineItems]);

  const handleSelectMFItem = async (item?: DropdownItemType<MgmtFeeJournalEntry>) => {
    const selectedItemLabel = MFItems.find((opt) => opt.state === ITEM_STATES.SELECTED)?.label;
    if (item && selectedItemLabel === item.label) return;

    const updatedValues = MFItems.map((option) =>
      option.label === item?.label
        ? { ...option, state: ITEM_STATES.SELECTED }
        : { ...option, state: ITEM_STATES.OPTIONAL },
    );

    setMFItems(updatedValues);

    if (item?.batchNo) {
      setMgmtFeeLineItemsLoading(true);
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

        const updatedValues = MFItems.map((option) => ({ ...option, state: ITEM_STATES.OPTIONAL }));
        setMFItems(updatedValues);
        // remove mgmtFee line items
        const filteredLineItems = (
          capEventSettingsStore.entitiesLineItem.get(entityLabel) || []
        )?.filter((item) => !item.mgmtFee);
        capEventSettingsStore.setEntitiesLineItem(entityLabel, filteredLineItems);

        return;
      } finally {
        setMgmtFeeLineItemsLoading(false);
      }

      const entityLineItemsWithoutMgmtFee =
        capEventSettingsStore.entitiesLineItem.get(entityLabel)?.filter((item) => !item.mgmtFee) ??
        [];

      capEventSettingsStore.setEntitiesLineItem(entityLabel, [
        ...entityLineItemsWithoutMgmtFee,
        ...prepareMgmtFeeLineItems(mgmtFeeLineItems, entityLabel),
      ]);
    } else {
      // remove mgmtFee line items
      const filteredLineItems = (
        capEventSettingsStore.entitiesLineItem.get(entityLabel) || []
      )?.filter((item) => !item.mgmtFee);

      capEventSettingsStore.setEntitiesLineItem(entityLabel, filteredLineItems);
    }
  };

  const handleChangeIncludeMF = (item: DropdownItemType) => {
    const updatedValues = includeMFOptions.map((option) =>
      option.label === item.label
        ? { ...option, state: ITEM_STATES.SELECTED }
        : { ...option, state: ITEM_STATES.OPTIONAL },
    );
    setIncludeMFOptions(updatedValues);

    if (item.label === 'No') {
      // Clear any MF selection in the dropdown UI
      setMFItems((prev) => prev.map((opt) => ({ ...opt, state: ITEM_STATES.OPTIONAL })));
      // call with no params to reset selected item
      handleSelectMFItem();
    }
  };

  const isIncludedMFSetToYes =
    includeMFOptions.find((item) => item.state === ITEM_STATES.SELECTED)?.label === 'Yes';

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
