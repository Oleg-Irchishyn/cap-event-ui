'use client';

import BackgroundContainer from '@/app/components/BackgroundContainer';
import DatePicker from '@/app/components/DatePicker';
import Dropdown from '@/app/components/Dropdown';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { ITEM_STATES } from '@/const/common';
import { capEventSettingsStore } from '@/stores';
import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import { useEffect, useMemo, useState } from 'react';
import { DropdownWrapper, Title } from './styles';

const EVENT_TYPE_MOCK = [
  {
    label: 'Capital Call',
    description: 'Call',
    state: 'O',
  },
  {
    label: 'Distribution',
    description: 'Dist',
    state: 'O',
  },
  {
    label: 'Subsequent Closing',
    description: 'Sub Cl',
    state: 'O',
  },
];

const TEMPLATES_MOCK = [
  {
    label: 'Template for cap event',
    description: 'Capital Call',
    state: 'O',
  },
];

const tempId = Math.floor(10000 + Math.random() * 90000);
const tempFundId = Math.floor(10000 + Math.random() * 80000);

const FUND_GROUPS = [...Array(9)].map((_, i) => ({
  label: `${tempId}-${i + 1} - Fund group ${i + 1}`,
  state: 'O',
}));

const FUNDS = [...Array(8)].map((_, i) => ({
  label: `${tempFundId}-${i + 1} - Fund ${i + 1}`,
  state: 'O',
}));

const getMultiSelectItemState = (state: string) => {
  if (state === ITEM_STATES.EXCLUDED) return ITEM_STATES.EXCLUDED;
  if (state === ITEM_STATES.OPTIONAL) {
    return ITEM_STATES.SELECTED;
  }
  return ITEM_STATES.OPTIONAL;
};

const filterBySearch = (items: DropdownItemType[], searchText: string) => {
  const search = searchText.toLowerCase();

  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      item.displayName?.toLowerCase().includes(search) ||
      item.id?.toLowerCase().includes(search),
  );
};

const GeneralSettings = () => {
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    capEventSettingsStore.setEventTypes(EVENT_TYPE_MOCK);
    capEventSettingsStore.setFundGroups(FUND_GROUPS);
    capEventSettingsStore.setFunds(FUNDS);

    if (TEMPLATES_MOCK.length === 1) {
      const preSelectedTemplate = [{ ...TEMPLATES_MOCK[0], state: ITEM_STATES.SELECTED }];
      capEventSettingsStore.setTemplates(preSelectedTemplate);
    } else {
      capEventSettingsStore.setTemplates(TEMPLATES_MOCK);
    }
  }, []);

  const { eventTypes, templates, fundGroups, funds } = capEventSettingsStore;

  const visibleFundGroups = useMemo(
    () => filterBySearch(fundGroups, searchText),
    [fundGroups, searchText],
  );

  const visibleFunds = useMemo(() => filterBySearch(funds, searchText), [funds, searchText]);

  const handleNoticeDate = (item: PickerValue) => {
    capEventSettingsStore.setNoticeDate(dayjs(item).toDate());
  };

  const selectEventTypeHandler = (item: DropdownItemType) => {
    const updatedValues = eventTypes.map((eventType) =>
      eventType.label === item.label
        ? { ...eventType, state: ITEM_STATES.SELECTED }
        : { ...eventType, state: ITEM_STATES.OPTIONAL },
    );
    capEventSettingsStore.setEventTypes(updatedValues);
  };

  const selectTemplateHandler = (item: DropdownItemType) => {
    const updatedValues = templates.map((template) =>
      template.label === item.label
        ? { ...template, state: ITEM_STATES.SELECTED }
        : { ...template, state: ITEM_STATES.OPTIONAL },
    );
    capEventSettingsStore.setTemplates(updatedValues);
  };

  const selectFundGroupHandler = (item: DropdownItemType) => {
    const selectedFundGroup = fundGroups.find(
      (fundGroup) => fundGroup.state === ITEM_STATES.SELECTED,
    );
    const isSameValueSelected = selectedFundGroup?.label === item.label;
    if (isSameValueSelected) return;

    const updatedValues = fundGroups.map((fundGroup) =>
      fundGroup.label === item.label
        ? { ...fundGroup, state: ITEM_STATES.SELECTED }
        : { ...fundGroup, state: ITEM_STATES.OPTIONAL },
    );
    const updatedFundsValues = funds.map((fund) => ({
      ...fund,
      state: ITEM_STATES.OPTIONAL,
    }));

    capEventSettingsStore.setFundGroups(updatedValues);
    capEventSettingsStore.setFunds(updatedFundsValues);
  };

  const selectFundsHandler = (item: DropdownItemType) => {
    const updatedValues = funds.map((fund) =>
      fund.label === item.label ? { ...fund, state: getMultiSelectItemState(fund.state) } : fund,
    );

    capEventSettingsStore.setFunds(updatedValues);
  };

  const selectAllFundsHandler = () => {
    const visibleFundsLabels = visibleFunds.map((fund) => fund.label);
    const updatedValues = funds.map((fund) =>
      visibleFundsLabels.includes(fund.label) ? { ...fund, state: ITEM_STATES.SELECTED } : fund,
    );

    capEventSettingsStore.setFunds(updatedValues);
  };

  const deselectAllFundsHandler = () => {
    const visibleFundsLabels = visibleFunds.map((fund) => fund.label);
    const updatedValues = funds.map((fund) =>
      visibleFundsLabels.includes(fund.label) ? { ...fund, state: ITEM_STATES.OPTIONAL } : fund,
    );

    capEventSettingsStore.setFunds(updatedValues);
  };

  const alternativeSelectFundsHandler = () => {
    const visibleFundsLabels = visibleFunds.map((fund) => fund.label);
    const updatedValues = funds.map((fund) =>
      visibleFundsLabels.includes(fund.label)
        ? {
            ...fund,
            state:
              fund.state === ITEM_STATES.SELECTED ? ITEM_STATES.OPTIONAL : ITEM_STATES.SELECTED,
          }
        : fund,
    );

    capEventSettingsStore.setFunds(updatedValues);
  };

  const deselectFundsHandler = (item: DropdownItemType) => () => {
    const updatedValues = funds.map((fund) =>
      item.label === fund.label ? { ...fund, state: ITEM_STATES.OPTIONAL } : fund,
    );

    capEventSettingsStore.setFunds(updatedValues);
  };

  const handleFundsDropdownOpenChange = (isOpen: boolean) => {
    capEventSettingsStore.setEntitiesDropdownOpen(isOpen);
    return true;
  };

  return (
    <BackgroundContainer>
      <Title>General Settings</Title>
      <DropdownWrapper>
        <Dropdown
          testId="event-type"
          withDescription
          items={eventTypes}
          label="Event Type*"
          placeholder="Select Event Type"
          selectHandler={selectEventTypeHandler}
          selectedItems={capEventSettingsStore.eventTypes.filter(
            (eventTypes) => eventTypes.state === ITEM_STATES.SELECTED,
          )}
        />
        <Dropdown
          testId="template"
          withDescription
          label="Template*"
          items={templates}
          placeholder="Select Template"
          isDisabled={templates.length === 1}
          selectHandler={selectTemplateHandler}
          selectedItems={capEventSettingsStore.templates.filter(
            (template) => template.state === ITEM_STATES.SELECTED,
          )}
        />
        <Dropdown
          testId="fund-groups"
          withSearch
          label="Fund Group*"
          searchText={searchText}
          items={visibleFundGroups}
          placeholder="Select Fund Group"
          onSearchChangeHandler={setSearchText}
          selectHandler={selectFundGroupHandler}
          selectedItems={fundGroups.filter((fundGroup) => fundGroup.state === ITEM_STATES.SELECTED)}
        />
        <Dropdown
          testId="entities"
          checkbox
          withSearch
          withControls
          isMultiSelect
          withDescription
          label={'Entity(ies)*'}
          items={visibleFunds}
          searchText={searchText}
          placeholder={'Select Entity(ies)'}
          selectHandler={selectFundsHandler}
          deselectItem={deselectFundsHandler}
          onSearchChangeHandler={setSearchText}
          onSelectAllHandler={selectAllFundsHandler}
          onDeselectAllHandler={deselectAllFundsHandler}
          onSelectAlternativeClickHandler={alternativeSelectFundsHandler}
          selectedItems={funds.filter((fund) => fund.state === ITEM_STATES.SELECTED)}
          onOpenChange={handleFundsDropdownOpenChange}
          isDisabled={
            !fundGroups.filter((fundGroup) => fundGroup.state === ITEM_STATES.SELECTED).length
          }
        />

        <DatePicker label="Notice Date*" onChange={handleNoticeDate} testId="GeneralSettings" />
      </DropdownWrapper>
    </BackgroundContainer>
  );
};

export default observer(GeneralSettings);
