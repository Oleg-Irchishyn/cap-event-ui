'use client';

import Dropdown from '@/app/components/Dropdown';
import DatePicker from '@/app/components/DatePicker';
import { useEffect, useMemo, useState } from 'react';
import { ITEM_STATES } from '@/const/common';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import dayjs from 'dayjs';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { capEventSettingsStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { Title, Container, DropdownWrapper } from './styles';

const EVENT_TYPE_MOCK = [
  {
    label: 'Call',
    description: 'Capital Call',
    state: 'O',
  },
  {
    label: 'Dist',
    description: 'Distribution',
    state: 'O',
  },
  {
    label: 'Sub Cl',
    description: 'Subsequent Closing ',
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

const FUND_GROUPS = [
  {
    label: 'Fund group 1',
    state: 'O',
  },
  {
    label: 'Fund group 2',
    state: 'O',
  },
  {
    label: 'Fund group 3',
    state: 'O',
  },
  {
    label: 'Fund group 4',
    state: 'O',
  },
  {
    label: 'Fund group 5',
    state: 'O',
  },
  {
    label: 'Fund group 6',
    state: 'O',
  },
  {
    label: 'Fund group 7',
    state: 'O',
  },
  {
    label: 'Fund group 8',
    state: 'O',
  },
  {
    label: 'Fund group 9',
    state: 'O',
  },
];

const FUNDS = [
  {
    label: 'Fund 1',
    description: 'Fund group 1',
    state: 'O',
  },
  {
    label: 'Fund 1-1',
    description: 'Fund group 1',
    state: 'O',
  },
  {
    label: 'Fund 2',
    description: 'Fund group 2',
    state: 'O',
  },
  {
    label: 'Fund 3',
    description: 'Fund group 4',
    state: 'O',
  },
  {
    label: 'Fund 4',
    description: 'Fund group 5',
    state: 'O',
  },
  {
    label: 'Fund 5',
    description: 'Fund group 6',
    state: 'O',
  },
  {
    label: 'Fund 6',
    description: 'Fund group 7',
    state: 'O',
  },
  {
    label: 'Fund 7',
    description: 'Fund group 8',
    state: 'O',
  },
  {
    label: 'Fund 8',
    description: 'Fund group 9',
    state: 'O',
  },
];

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
    const selectedFundGroups = fundGroups.filter(
      (fundGroup) => fundGroup.state === ITEM_STATES.SELECTED,
    );

    if (selectedFundGroups.length < 3) {
      const updatedValues = fundGroups.map((fundGroup) =>
        fundGroup.label === item.label
          ? { ...fundGroup, state: getMultiSelectItemState(fundGroup.state) }
          : fundGroup,
      );

      const updatedSelectedFundGroups = updatedValues.filter(
        (fundGroup) => fundGroup.state === ITEM_STATES.SELECTED,
      );

      if (updatedSelectedFundGroups.length === 3) {
        const listWithExcludedValues = updatedValues.map((fundGroup) =>
          fundGroup.state === ITEM_STATES.OPTIONAL
            ? { ...fundGroup, state: ITEM_STATES.EXCLUDED }
            : fundGroup,
        );

        capEventSettingsStore.setFundGroups(listWithExcludedValues);
        return;
      }

      capEventSettingsStore.setFundGroups(updatedValues);
    }

    if (item.state === ITEM_STATES.SELECTED) {
      const updatedValues = fundGroups.map((fundGroup) =>
        fundGroup.label === item.label
          ? { ...fundGroup, state: getMultiSelectItemState(fundGroup.state) }
          : {
              ...fundGroup,
              state:
                fundGroup.state === ITEM_STATES.EXCLUDED ? ITEM_STATES.OPTIONAL : fundGroup.state,
            },
      );

      capEventSettingsStore.setFundGroups(updatedValues);
    }
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

  return (
    <Container>
      <Title>General Settings</Title>
      <DropdownWrapper>
        <Dropdown
          testId="event-type"
          withDescription
          items={eventTypes}
          label="Event Type *"
          placeholder="Select Event Type"
          selectHandler={selectEventTypeHandler}
          selectedItems={capEventSettingsStore.eventTypes.filter(
            (eventTypes) => eventTypes.state === ITEM_STATES.SELECTED,
          )}
        />
        <Dropdown
          testId="template"
          withDescription
          label="Template *"
          items={templates}
          placeholder="Select Template"
          isDisabled={templates.length === 1}
          selectHandler={selectTemplateHandler}
          selectedItems={capEventSettingsStore.templates.filter(
            (template) => template.state === ITEM_STATES.SELECTED,
          )}
        />
        <Dropdown
          testId={'fund-groups'}
          withSearch
          label={'Fund Group *'}
          searchText={searchText}
          items={visibleFundGroups}
          placeholder={'Select Fund Group'}
          onSearchChangeHandler={setSearchText}
          selectHandler={selectFundGroupHandler}
          selectedItems={fundGroups.filter((fundGroup) => fundGroup.state === ITEM_STATES.SELECTED)}
        />
        <Dropdown
          testId={'first drop'}
          checkbox
          withSearch
          withControls
          isMultiSelect
          withDescription
          label={'Fund(s) *'}
          items={visibleFunds}
          searchText={searchText}
          placeholder={'Select Fund(s)'}
          selectHandler={selectFundsHandler}
          deselectItem={deselectFundsHandler}
          onSearchChangeHandler={setSearchText}
          onSelectAllHandler={selectAllFundsHandler}
          onDeselectAllHandler={deselectAllFundsHandler}
          onSelectAlternativeClickHandler={alternativeSelectFundsHandler}
          selectedItems={funds.filter((fund) => fund.state === ITEM_STATES.SELECTED)}
          isDisabled={
            !fundGroups.filter((fundGroup) => fundGroup.state === ITEM_STATES.SELECTED).length
          }
        />

        <DatePicker label="Notice Date *" onChange={handleNoticeDate} />
      </DropdownWrapper>
    </Container>
  );
};

export default observer(GeneralSettings);
