import BackgroundContainer from '@/app/components/BackgroundContainer';
import { Title } from '../styles';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import AccountsTable from './AccountsTable';

const FundGroupLineItems = () => {
  return (
    <BackgroundContainer testId="fund-group-line-items">
      <Title>Capital Event Line Items - Fund Group Level</Title>

      {capEventSettingsStore.isGeneralSettingsEmpty(
        entityDatesStore.noticeDate,
        entityDatesStore.hasDifferentDates,
      ) || !capEventSettingsStore.hasMultipleEntitiesChosen ? (
        <AccountsTable
          testId="fund-group-account-table"
          level="group"
          isDisabled
          lineItems={capEventSettingsStore.fundGroupsLineItem}
        />
      ) : (
        <AccountsTable
          testId="fund-group-account-table"
          level="group"
          setDataToStoreCallback={(entityKey, data) => {
            capEventSettingsStore.setFundGroupsLineItem(data);
          }}
          entityKey=""
          lineItems={capEventSettingsStore.fundGroupsLineItem}
        />
      )}
    </BackgroundContainer>
  );
};

export default observer(FundGroupLineItems);
