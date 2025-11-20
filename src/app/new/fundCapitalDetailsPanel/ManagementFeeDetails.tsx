import Dropdown from '@/app/components/Dropdown';
import { ITEM_STATES } from '@/const/common';
import { FC, useState } from 'react';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { MgmtFeeJournalEntry } from '@/clients/CapEventPackage';
import { capEventSettingsStore } from '@/stores';

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
      additionalDescription: `Description: ${item.batchTitle}`,
    };
  }) ?? [];

type Props = {
  entityId: string;
};

const ManagementFeeDetails: FC<Props> = ({ entityId }) => {
  const [includeMFOptions, setIncludeMFOptions] = useState(preparedIncludeMFOptions);
  const [MFItems, setMFItems] = useState(
    prepareMgmtEntryOptions(capEventSettingsStore.mgmtJournalEntries[entityId]),
  );
  const [searchText, setSearchText] = useState('');

  const handleSelectMFItem = (item?: DropdownItemType) => {
    const updatedValues = MFItems.map((option) =>
      option.label === item?.label
        ? { ...option, state: ITEM_STATES.SELECTED }
        : { ...option, state: ITEM_STATES.OPTIONAL },
    );

    setMFItems(updatedValues);
  };

  const handleChangeIncludeMF = (item: DropdownItemType) => {
    const updatedValues = includeMFOptions.map((option) =>
      option.label === item.label
        ? { ...option, state: ITEM_STATES.SELECTED }
        : { ...option, state: ITEM_STATES.OPTIONAL },
    );
    setIncludeMFOptions(updatedValues);

    if (item.label === 'No') {
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
      )}
    </>
  );
};

export default ManagementFeeDetails;
