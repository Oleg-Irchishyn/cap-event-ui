import BackgroundContainer from '@/app/components/BackgroundContainer';
import { Title } from '../styles';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import AccountsTable from './AccountsTable';
import { DragStoppedEvent } from 'ag-grid-community';
import { LineItemRow } from '@/app/new/LineItems/types';
import { LineItemTypes } from '@/app/new/LineItems/const';

const FundGroupLineItems = () => {
  const onDragStopped = (e: DragStoppedEvent) => {
    const newValue: LineItemRow[] = [];
    e.api.forEachNode((node) => newValue.push(node.data));
    capEventSettingsStore.setFundGroupsLineItem(newValue);
  };

  const isDisabled =
    capEventSettingsStore.isGeneralSettingsEmpty(
      entityDatesStore.noticeDate,
      entityDatesStore.hasDifferentDates,
    ) ||
    !capEventSettingsStore.hasMultipleEntitiesChosen ||
    !capEventSettingsStore.isNoticeDateValid;

  return (
    <BackgroundContainer testId="fund-group-line-items">
      <Title>Capital Event Line Items - Fund Group Level</Title>

      {isDisabled ? (
        <AccountsTable
          testId="fund-group-account-table"
          level={LineItemTypes.group}
          isDisabled
          lineItems={capEventSettingsStore.fundGroupsLineItem}
        />
      ) : (
        <AccountsTable
          testId="fund-group-account-table"
          level={LineItemTypes.group}
          onDragStopped={onDragStopped}
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
