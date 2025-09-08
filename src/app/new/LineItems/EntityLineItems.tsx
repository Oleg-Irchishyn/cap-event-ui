import { Fragment, useRef } from 'react';
import { observer } from 'mobx-react-lite';
import { capEventSettingsStore } from '@/stores';
import { ITEM_STATES } from '@/const/common';
import BackgroundContainer from '@/app/components/BackgroundContainer';
import EntityCapitalDetailsPanel from '@/app/new/fundCapitalDetailsPanel/EntityCapitalDetailsPanel';
import { Title } from '../styles';
import AccountsTable from '@/app/new/LineItems/AccountsTable';

const EntityLineItems = () => {
  const entitiesSnapshotRef = useRef(capEventSettingsStore.funds);
  const wasDropdownOpenRef = useRef(capEventSettingsStore.isEntitiesDropdownOpen);

  const isDropdownOpen = capEventSettingsStore.isEntitiesDropdownOpen;

  if (!isDropdownOpen && wasDropdownOpenRef.current) {
    entitiesSnapshotRef.current = capEventSettingsStore.funds;
  } else if (!isDropdownOpen) {
    entitiesSnapshotRef.current = capEventSettingsStore.funds;
  }

  wasDropdownOpenRef.current = isDropdownOpen;

  const entitiesToUse = isDropdownOpen ? entitiesSnapshotRef.current : capEventSettingsStore.funds;

  const selectedEntities = entitiesToUse
    .filter((entity) => entity.state === ITEM_STATES.SELECTED)
    .sort((a, b) => {
      const nameA = (a.displayName || a.label).toLowerCase();
      const nameB = (b.displayName || b.label).toLowerCase();
      return nameA.localeCompare(nameB);
    });

  const renderFundCapitalDetailsPanel = () => {
    return selectedEntities?.map((fund) => (
      <Fragment key={fund.label}>
        <EntityCapitalDetailsPanel
          key={`${fund.id}_${fund.label}`}
          entityLabel={fund.label}
          entityName={fund.displayName}
        />
        <AccountsTable
          testId="accounts-table"
          level="entity"
          entityKey={fund.label}
          setDataToStoreCallback={(key, data) =>
            capEventSettingsStore.setEntitiesLineItem(key, data)
          }
        />
      </Fragment>
    ));
  };

  return (
    <BackgroundContainer testId="entity-line-items">
      <Title>Capital Event Line Items - Entity Level</Title>
      {!capEventSettingsStore.isGeneralSettingsEmpty ? (
        renderFundCapitalDetailsPanel()
      ) : (
        <AccountsTable testId="accounts-table-placeholder" isDisabled />
      )}
    </BackgroundContainer>
  );
};

export default observer(EntityLineItems);
