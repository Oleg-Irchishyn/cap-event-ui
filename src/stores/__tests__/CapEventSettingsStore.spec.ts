import CapEventSettingsStore from '@/stores/CapEventSettingsStore';
import { LineItemRow } from '@/app/new/LineItems/types';

describe('CapEventSettingsStore', () => {
  let store: CapEventSettingsStore;

  const mockDropdownValue = (label: string) => [
    {
      label,
      state: 'O',
    },
  ];

  beforeEach(() => {
    store = new CapEventSettingsStore();
  });

  it('should set funds', () => {
    const mockFunds = mockDropdownValue('Funds');
    store.setFundEntities(mockFunds);

    expect(store.fundEntities).toStrictEqual(mockFunds);
  });

  it('should set eventTypes', () => {
    const mockEventTypes = mockDropdownValue('Event type');
    store.setEventTypes(mockEventTypes);

    expect(store.eventTypes).toStrictEqual(mockEventTypes);
  });

  it('should set templates', () => {
    const mockTemplates = mockDropdownValue('Templates');
    store.setTemplates(mockTemplates);

    expect(store.templates).toStrictEqual(mockTemplates);
  });

  it('should set fund groups', () => {
    const mockFundGroup = [
      {
        label: 'Group 1',
        state: 'O',
        name: 'Name',
        id: '1',
      },
    ];
    store.setFundGroups(mockFundGroup);

    expect(store.fundGroups).toStrictEqual(mockFundGroup);
  });

  it('should set notice date', () => {
    const date = new Date('10/10/2020');
    store.setNoticeDate(date);

    expect(store.noticeDate).toStrictEqual(date);
  });

  it('should set foundGroupsLineItems', () => {
    const lineItems: LineItemRow[] = [
      {
        id: '1',
        amount: 10,
        capitalCategory: 'Dist',
        callDistributionReason: 'Reason',
        defaultDescription: 'Desc',
        insideCommitment: 'Yes',
      },
    ];
    store.setFundGroupsLineItem(lineItems);

    expect(store.fundGroupsLineItem).toStrictEqual(lineItems);
  });

  it('should set entitiesLineItem', () => {
    const lineItems: LineItemRow[] = [
      {
        id: '1',
        amount: 10,
        capitalCategory: 'Dist',
        callDistributionReason: 'Reason',
        defaultDescription: 'Desc',
        insideCommitment: 'Yes',
      },
    ];
    const entityKey = 'entity-123';
    store.setEntitiesLineItem(entityKey, lineItems);

    expect(store.entitiesLineItem.get(entityKey)).toStrictEqual(lineItems);
  });
});
