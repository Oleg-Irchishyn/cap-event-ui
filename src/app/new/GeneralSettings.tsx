'use client';

import BackgroundContainer from '@/app/components/BackgroundContainer';
import DatePicker from '@/app/components/DatePicker';
import Dropdown from '@/app/components/Dropdown';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { ITEM_STATES } from '@/const/common';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { PickerValue } from '@mui/x-date-pickers/internals';
import Image from 'next/image';
import dayjs from 'dayjs';
import { parseValidDate } from '@/utils/datePickerUtils';
import { observer } from 'mobx-react-lite';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DropdownWrapper, Title } from './styles';
import { CapEventPackageApi, TemplateLibraryApi, ReferenceDataApi } from '@/api';
import { Entity, FundGroup } from '@/clients/ReferenceData';
import { CapEventType } from '@/clients/CapEventPackage';
import { TemplateMetadata } from '@/clients/TemplateLibrary';

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
  id: 'FG001',
  name: `${i + 1}`,
}));

const FUNDS = [...Array(8)].map((_, i) => ({
  label: `${tempFundId}-${i + 1} - Fund ${i + 1}`,
  state: 'O',
  dueDateDays: parseFloat('2.00').toString(),
  dueDateType: 'Calendar Days',
}));

const prepareEventType = (eventTypes: CapEventType[]) => {
  return eventTypes?.map((eventType) => ({
    ...eventType,
    state: ITEM_STATES.OPTIONAL,
    label: eventType.name || '',
    description: eventType.abbreviation,
  }));
};

const prepareFundGroups = (fundGroups: FundGroup[]) => {
  return fundGroups?.map((fundGroup) => ({
    ...fundGroup,
    id: fundGroup.id?.toString(),
    state: ITEM_STATES.OPTIONAL,
    label: `${fundGroup.id} - ${fundGroup.name}`,
  }));
};

const prepareFundEntities = (funds: Entity[]) => {
  return funds?.map((fund) => ({
    ...fund,
    id: fund.id?.toString(),
    state: ITEM_STATES.OPTIONAL,
    label: `${fund.id} - ${fund.name}`,
    dueDateDays: parseFloat(fund?.dueDateDays || '').toString(),
  }));
};

const prepareTemplates = (templates: TemplateMetadata[]) => {
  return templates?.map((template) => ({
    ...template,
    state: ITEM_STATES.OPTIONAL,
    label: template.name,
  }));
};

const getMultiSelectItemState = (state: string) => {
  if (state === ITEM_STATES.EXCLUDED) return ITEM_STATES.EXCLUDED;
  if (state === ITEM_STATES.OPTIONAL) {
    return ITEM_STATES.SELECTED;
  }
  return ITEM_STATES.OPTIONAL;
};

const filterBySearch = <T,>(items: DropdownItemType<T>[], searchText: string) => {
  const search = searchText.toLowerCase();

  return items.filter(
    (item) =>
      item.label.toLowerCase().includes(search) ||
      item.description?.toLowerCase().includes(search) ||
      item.displayName?.toLowerCase().includes(search) ||
      item.id?.toLowerCase().includes(search),
  );
};

const pickerIcon = () => <Image src="icons/calendar.svg" width={20} height={20} alt="calendar" />;

const GeneralSettings = () => {
  const [searchText, setSearchText] = useState('');

  const getEventTypes = async () => {
    try {
      const eventTypes = await CapEventPackageApi.default.getCapEventTypes();
      capEventSettingsStore.setEventTypes(prepareEventType(eventTypes));
    } catch (error) {
      console.error(error);
      capEventSettingsStore.setEventTypes(EVENT_TYPE_MOCK);
    }
  };

  const getFundGroups = async () => {
    try {
      const fundGroups =
        await ReferenceDataApi.fundGroups.searchFundGroupsBySponsor('Golden Image DEV');
      capEventSettingsStore.setFundGroups(prepareFundGroups(fundGroups));
    } catch (error) {
      console.error(error);
      capEventSettingsStore.setFundGroups(FUND_GROUPS);
    }
  };

  const initFetch = useCallback(() => {
    getEventTypes();
    getFundGroups();
  }, []);

  const updateFundEntities = async (id: string) => {
    try {
      const entitiesRelatedToGroup = await ReferenceDataApi.entities.getEntitiesByFundGroup(
        id,
        ['ACTIVE'],
        ['ADMIN', 'ELIMINATION'],
      );
      capEventSettingsStore.setFundEntities(prepareFundEntities(entitiesRelatedToGroup));
    } catch (error) {
      console.error(error);
      capEventSettingsStore.setFundEntities(FUNDS);
    }
  };

  const getTemplates = async (eventTypeId: string) => {
    let preparedTemplates;
    try {
      const templates = await TemplateLibraryApi.template.getStandardTemplatesMetadata(
        'Golden Image DEV',
        eventTypeId,
      );
      preparedTemplates = prepareTemplates(templates);
    } catch (error) {
      console.error(error);
      preparedTemplates = TEMPLATES_MOCK;
    }

    if (preparedTemplates.length === 1) {
      const preSelectedTemplate = [{ ...preparedTemplates[0], state: ITEM_STATES.SELECTED }];
      capEventSettingsStore.setTemplates(preSelectedTemplate);
    } else {
      capEventSettingsStore.setTemplates(preparedTemplates);
    }
  };

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  const { eventTypes, templates, fundGroups, fundEntities } = capEventSettingsStore;

  const visibleFundGroups: DropdownItemType<FundGroup>[] = useMemo(
    () => filterBySearch<FundGroup>(fundGroups, searchText),
    [fundGroups, searchText],
  );

  const visibleFunds = useMemo(
    () => filterBySearch(fundEntities, searchText),
    [fundEntities, searchText],
  );

  const handleNoticeDate = (item: PickerValue) => {
    const parsed = parseValidDate(item);
    if (parsed === null) {
      entityDatesStore.clearGeneralNoticeDate();
      return;
    }

    entityDatesStore.setNoticeDate(parsed);
    entityDatesStore.updateEntityDatesFromGeneral(capEventSettingsStore.fundEntities);
  };

  const selectEventTypeHandler = (item: DropdownItemType) => {
    const updatedValues = eventTypes.map((eventType) =>
      eventType.label === item.label
        ? { ...eventType, state: ITEM_STATES.SELECTED }
        : { ...eventType, state: ITEM_STATES.OPTIONAL },
    );
    capEventSettingsStore.setEventTypes(updatedValues);
    getTemplates(item.id || '');
  };

  const selectTemplateHandler = (item: DropdownItemType) => {
    const updatedValues = templates.map((template) =>
      template.label === item.label
        ? { ...template, state: ITEM_STATES.SELECTED }
        : { ...template, state: ITEM_STATES.OPTIONAL },
    );
    capEventSettingsStore.setTemplates(updatedValues);
  };

  const selectFundGroupHandler = (item: DropdownItemType<FundGroup>) => {
    entityDatesStore.resetAllDates();
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
    capEventSettingsStore.setFundGroups(updatedValues);

    if (item.id) {
      updateFundEntities(item.id);
    }
  };

  const selectFundsHandler = (item: DropdownItemType) => {
    const updatedValues = fundEntities.map((fund) =>
      fund.label === item.label ? { ...fund, state: getMultiSelectItemState(fund.state) } : fund,
    );

    capEventSettingsStore.setFundEntities(updatedValues);
  };

  const selectAllFundsHandler = () => {
    const visibleFundsLabels = visibleFunds.map((fund) => fund.label);
    const updatedValues = fundEntities.map((fund) =>
      visibleFundsLabels.includes(fund.label) ? { ...fund, state: ITEM_STATES.SELECTED } : fund,
    );

    capEventSettingsStore.setFundEntities(updatedValues);
  };

  const deselectAllFundsHandler = () => {
    const visibleFundsLabels = visibleFunds.map((fund) => fund.label);
    const updatedValues = fundEntities.map((fund) =>
      visibleFundsLabels.includes(fund.label) ? { ...fund, state: ITEM_STATES.OPTIONAL } : fund,
    );

    capEventSettingsStore.setFundEntities(updatedValues);
  };

  const alternativeSelectFundsHandler = () => {
    const visibleFundsLabels = visibleFunds.map((fund) => fund.label);
    const updatedValues = fundEntities.map((fund) =>
      visibleFundsLabels.includes(fund.label)
        ? {
            ...fund,
            state:
              fund.state === ITEM_STATES.SELECTED ? ITEM_STATES.OPTIONAL : ITEM_STATES.SELECTED,
          }
        : fund,
    );

    capEventSettingsStore.setFundEntities(updatedValues);
  };

  const deselectFundsHandler = (item: DropdownItemType) => () => {
    const updatedValues = fundEntities.map((fund) =>
      item.label === fund.label ? { ...fund, state: ITEM_STATES.OPTIONAL } : fund,
    );

    capEventSettingsStore.setFundEntities(updatedValues);
  };

  const handleFundsDropdownOpenChange = (isOpen: boolean) => {
    capEventSettingsStore.setEntitiesDropdownOpen(isOpen);
    return true;
  };

  return (
    <BackgroundContainer testId="general-settings">
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
          isDisabled={
            templates.length === 1 ||
            capEventSettingsStore.eventTypes.filter(
              (eventTypes) => eventTypes.state === ITEM_STATES.SELECTED,
            ).length === 0
          }
          selectHandler={selectTemplateHandler}
          selectedItems={capEventSettingsStore.templates.filter(
            (template) => template.state === ITEM_STATES.SELECTED,
          )}
        />
        <Dropdown<FundGroup>
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
          selectedItems={fundEntities.filter((fund) => fund.state === ITEM_STATES.SELECTED)}
          onOpenChange={handleFundsDropdownOpenChange}
          isDisabled={
            !fundGroups.filter((fundGroup) => fundGroup.state === ITEM_STATES.SELECTED).length
          }
        />

        <DatePicker
          label="Notice Date*"
          onChange={handleNoticeDate}
          maxDate={dayjs().add(1, 'months')}
          defaultValue={
            entityDatesStore.hasDifferentDates
              ? null
              : entityDatesStore.noticeDate
                ? dayjs(entityDatesStore.noticeDate)
                : null
          }
          pickerIcon={pickerIcon}
          format={entityDatesStore.hasDifferentDates ? '[Different Dates]' : undefined}
          testId="GeneralSettings"
        />
      </DropdownWrapper>
    </BackgroundContainer>
  );
};

export default observer(GeneralSettings);
