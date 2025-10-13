import { Fragment, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { ITEM_STATES } from '@/const/common';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import EntityCapitalDetailsPanel from '@/app/new/fundCapitalDetailsPanel/EntityCapitalDetailsPanel';
import { Title } from '../styles';
import AccountsTable from '@/app/new/LineItems/AccountsTable';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { DragStoppedEvent } from 'ag-grid-community';
import { LineItemRow } from '@/app/new/LineItems/types';
import { LineItemTypes } from '@/app/new/LineItems/const';

const EntityLineItems = () => {
  const entitiesSnapshotRef = useRef(capEventSettingsStore.fundEntities);
  const wasDropdownOpenRef = useRef(capEventSettingsStore.isEntitiesDropdownOpen);

  const isDropdownOpen = capEventSettingsStore.isEntitiesDropdownOpen;

  if (!isDropdownOpen && wasDropdownOpenRef.current) {
    entitiesSnapshotRef.current = capEventSettingsStore.fundEntities;
  } else if (!isDropdownOpen) {
    entitiesSnapshotRef.current = capEventSettingsStore.fundEntities;
  }

  wasDropdownOpenRef.current = isDropdownOpen;

  const entitiesToUse = isDropdownOpen
    ? entitiesSnapshotRef.current
    : capEventSettingsStore.fundEntities;

  const selectedEntities = entitiesToUse
    .filter((entity) => entity.state === ITEM_STATES.SELECTED)
    .sort((a, b) => {
      const nameA = (a.displayName || a.label).toLowerCase();
      const nameB = (b.displayName || b.label).toLowerCase();
      return nameA.localeCompare(nameB);
    });

  const onDragStopped = (entityKey: string) => (e: DragStoppedEvent) => {
    const newValue: LineItemRow[] = [];
    e.api.forEachNode((node) => newValue.push(node.data));
    capEventSettingsStore.setEntitiesLineItem(entityKey, newValue);
  };

  const renderFundCapitalDetailsPanel = () => {
    return selectedEntities?.map((fund) => (
      <Fragment key={fund.label}>
        <EntityCapitalDetailsPanel
          key={`${fund.id}_${fund.label}`}
          entityLabel={fund.label}
          entityName={fund.displayName}
          entityId={fund.id}
        />
        <AccountsTable
          testId="accounts-table"
          level={LineItemTypes.entity}
          entityKey={fund.label}
          onDragStopped={onDragStopped(fund.label)}
          setDataToStoreCallback={(key, data) => {
            capEventSettingsStore.setEntitiesLineItem(key, data);
          }}
          lineItems={
            capEventSettingsStore.entitiesLineItem.get(fund.label) || [
              prepareNewRow(LineItemTypes.entity),
            ]
          }
        />
      </Fragment>
    ));
  };

  const isDisabled =
    capEventSettingsStore.isGeneralSettingsEmpty(
      entityDatesStore.noticeDate,
      entityDatesStore.hasDifferentDates,
      entitiesToUse,
    ) || !capEventSettingsStore.isNoticeDateValid;

  return (
    <BackgroundContainer testId="entity-line-items">
      <Title>Capital Event Line Items - Entity Level</Title>
      {!isDisabled ? (
        renderFundCapitalDetailsPanel()
      ) : (
        <AccountsTable
          testId="accounts-table-placeholder"
          level={LineItemTypes.entity}
          isDisabled
        />
      )}
    </BackgroundContainer>
  );
};

export default observer(EntityLineItems);
