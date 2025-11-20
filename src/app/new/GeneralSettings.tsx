'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { PickerValue } from '@mui/x-date-pickers/internals';
import Image from 'next/image';
import dayjs from 'dayjs';
import { CapEventPackageApi, ReferenceDataApi } from '@/api';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { GENERAL_SETTINGS_FIELDS, ITEM_STATES } from '@/const/common';
import { parseValidDate } from '@/utils/datePickerUtils';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import DatePicker from '@/app/components/DatePicker';
import Dropdown from '@/app/components/Dropdown';
import ConfirmationModal from '@/app/components/ConfirmationModal';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import useConfirmationModal from '@/hooks/useConfirmationModal';
import { Entity, FundGroup, Sponsor } from '@/clients/ReferenceData';
import { CapEventType } from '@/clients/CapEventPackage';
import { DropdownWrapper, Title } from './styles';

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

const prepareSponsors = (sponsors: Sponsor[]) => {
  return sponsors?.map((sponsor) => ({
    ...sponsor,
    state: ITEM_STATES.OPTIONAL,
    label: sponsor.name ?? '',
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
  const [noticeInputValue, setNoticeInputValue] = useState<PickerValue>(
    entityDatesStore.hasDifferentDates
      ? null
      : entityDatesStore.noticeDate
        ? dayjs(entityDatesStore.noticeDate)
        : null,
  );

  const getEventTypes = async () => {
    try {
      const eventTypes = await CapEventPackageApi.default.getCapEventTypes();
      capEventSettingsStore.setEventTypes(prepareEventType(eventTypes));
    } catch (error) {
      console.error(error);
    }
  };

  const getFundGroups = async (sponsorId: string) => {
    try {
      const fundGroups = await ReferenceDataApi.fundGroups.searchFundGroupsBySponsor(sponsorId);
      capEventSettingsStore.setFundGroups(prepareFundGroups(fundGroups));
    } catch (error) {
      console.error(error);
    }
  };

  const getSponsors = async () => {
    try {
      const sponsors = await ReferenceDataApi.sponsors.getSponsors();
      capEventSettingsStore.setSponsors(prepareSponsors(sponsors));
    } catch (error) {
      console.error(error);
    }
  };

  const initFetch = useCallback(() => {
    getEventTypes();
    getSponsors();
  }, []);

  const updateFundEntities = async (id: string) => {
    try {
      const entitiesRelatedToGroup = await ReferenceDataApi.entities.getEntitiesByFundGroup(
        id,
        '',
        ['ACTIVE'],
        ['ADMIN', 'ELIMINATION'],
      );
      capEventSettingsStore.setFundEntities(prepareFundEntities(entitiesRelatedToGroup));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    initFetch();
  }, [initFetch]);

  const { eventTypes, sponsors, fundGroups, fundEntities } = capEventSettingsStore;

  const visibleFundGroups: DropdownItemType<FundGroup>[] = useMemo(
    () => filterBySearch<FundGroup>(fundGroups, searchText),
    [fundGroups, searchText],
  );

  const visibleFunds = useMemo(
    () => filterBySearch(fundEntities, searchText),
    [fundEntities, searchText],
  );

  const { modal, confirmFieldChange, isConfirmationModalEnabled, onEntitiesDropdownOpenChange } =
    useConfirmationModal();

  const handleNoticeDateError = (isValid: boolean) => {
    capEventSettingsStore.setIsNoticeDateValid(isValid);
  };

  const handleNoticeDate = async (item: PickerValue) => {
    setNoticeInputValue(item);
    const parsed = parseValidDate(item);
    if (item === null) {
      entityDatesStore.clearGeneralNoticeDate();
      return;
    }

    if (parsed === null) {
      return;
    }

    if (!isConfirmationModalEnabled) {
      entityDatesStore.setNoticeDate(parsed);
      entityDatesStore.updateEntityDatesFromGeneral(capEventSettingsStore.fundEntities);
      setNoticeInputValue(dayjs(parsed));
      return;
    }

    const prevValue = entityDatesStore.noticeDate ? dayjs(entityDatesStore.noticeDate) : null;
    const isFieldChanged = await confirmFieldChange(GENERAL_SETTINGS_FIELDS.NOTICE_DATE);
    if (!isFieldChanged) {
      setNoticeInputValue(prevValue);
      return;
    }

    entityDatesStore.setNoticeDate(parsed);
    entityDatesStore.updateEntityDatesFromGeneral(capEventSettingsStore.fundEntities);
    setNoticeInputValue(dayjs(parsed));
  };

  const selectEventTypeHandler = async (item: DropdownItemType) => {
    if (isConfirmationModalEnabled) {
      const isFieldChanged = await confirmFieldChange(GENERAL_SETTINGS_FIELDS.EVENT_TYPE);
      if (!isFieldChanged) return;
    }

    const updatedValues = eventTypes.map((eventType) =>
      eventType.label === item.label
        ? { ...eventType, state: ITEM_STATES.SELECTED }
        : { ...eventType, state: ITEM_STATES.OPTIONAL },
    );
    capEventSettingsStore.setEventTypes(updatedValues);

    entityDatesStore.setSelectedEventType(item.label || '');

    if (entityDatesStore.noticeDate) {
      entityDatesStore.updateEntityDatesFromGeneral(capEventSettingsStore.fundEntities);
    } else {
      entityDatesStore.recalcEntityDueDatesForSelectedFunds(capEventSettingsStore.fundEntities);
    }
  };

  const selectSponsorHandler = (item: DropdownItemType) => {
    const updatedValues = sponsors.map((sponsor) =>
      sponsor.label === item.label
        ? { ...sponsor, state: ITEM_STATES.SELECTED }
        : { ...sponsor, state: ITEM_STATES.OPTIONAL },
    );
    capEventSettingsStore.setSponsors(updatedValues);
    if (item.id) {
      getFundGroups(item.id);
    }
  };

  const selectFundGroupHandler = async (item: DropdownItemType<FundGroup>) => {
    const selectedFundGroup = fundGroups.find(
      (fundGroup) => fundGroup.state === ITEM_STATES.SELECTED,
    );
    const isSameValueSelected = selectedFundGroup?.label === item.label;
    if (isSameValueSelected) return;

    if (isConfirmationModalEnabled) {
      const isFieldChanged = await confirmFieldChange(GENERAL_SETTINGS_FIELDS.FUND_GROUP);
      if (!isFieldChanged) return;
    }

    capEventSettingsStore.resetOnFundGroupChange();

    const updatedValues = fundGroups.map((fundGroup) =>
      fundGroup.label === item.label
        ? { ...fundGroup, state: ITEM_STATES.SELECTED }
        : { ...fundGroup, state: ITEM_STATES.OPTIONAL },
    );

    capEventSettingsStore.setFundGroups(updatedValues);
    capEventSettingsStore.setFundEntities([]);

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
    if (item.isDisabled) return;

    const updatedValues = fundEntities.map((fund) =>
      item.label === fund.label ? { ...fund, state: ITEM_STATES.OPTIONAL } : fund,
    );

    if (isConfirmationModalEnabled && !capEventSettingsStore.isEntitiesDropdownOpen) {
      onEntitiesDropdownOpenChange(true);
      capEventSettingsStore.setFundEntities(updatedValues);
      onEntitiesDropdownOpenChange(false);
      return;
    }

    capEventSettingsStore.setFundEntities(updatedValues);
  };

  const handleFundsDropdownOpenChange = (isOpen: boolean) => {
    capEventSettingsStore.setEntitiesDropdownOpen(isOpen);
    onEntitiesDropdownOpenChange(isOpen);

    if (!isOpen) {
      const entityIds = capEventSettingsStore.fundEntities
        .filter((item) => item.state === ITEM_STATES.SELECTED)
        .map((item) => item.id ?? '');

      capEventSettingsStore.fetchMgmtJournalEntries(entityIds);
    }

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
          label={`${GENERAL_SETTINGS_FIELDS.EVENT_TYPE}*`}
          placeholder="Select Event Type"
          selectHandler={selectEventTypeHandler}
          selectedItems={capEventSettingsStore.eventTypes.filter(
            (eventTypes) => eventTypes.state === ITEM_STATES.SELECTED,
          )}
        />
        <Dropdown
          testId="sponsor"
          label={`${GENERAL_SETTINGS_FIELDS.SPONSOR}*`}
          items={sponsors}
          placeholder="Select Sponsor"
          selectHandler={selectSponsorHandler}
          selectedItems={capEventSettingsStore.sponsors.filter(
            (sponsor) => sponsor.state === ITEM_STATES.SELECTED,
          )}
        />
        <Dropdown<FundGroup>
          testId="fund-groups"
          withSearch
          label={`${GENERAL_SETTINGS_FIELDS.FUND_GROUP}*`}
          isDisabled={!sponsors.some((item) => item.state === ITEM_STATES.SELECTED)}
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
          label={`${GENERAL_SETTINGS_FIELDS.ENTITIES}*`}
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
          label={`${GENERAL_SETTINGS_FIELDS.NOTICE_DATE}*`}
          onChange={handleNoticeDate}
          setIsValidDate={handleNoticeDateError}
          maxDate={dayjs().add(1, 'months')}
          defaultValue={noticeInputValue}
          pickerIcon={pickerIcon}
          format={entityDatesStore.hasDifferentDates ? '[Different Dates]' : undefined}
          testId="GeneralSettings"
        />
      </DropdownWrapper>
      <ConfirmationModal
        title={modal.title}
        isOpen={modal.isOpen}
        handleClose={modal.handleClose}
        handleProceed={modal.handleProceed}
      />
    </BackgroundContainer>
  );
};

export default observer(GeneralSettings);
