import CapEventSettingsStore from '@/stores/CapEventSettingsStore';

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
    store.setFunds(mockFunds);

    expect(store.funds).toStrictEqual(mockFunds);
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
    const mockFundGroup = mockDropdownValue('Fund Group');
    store.setFundGroups(mockFundGroup);

    expect(store.fundGroups).toStrictEqual(mockFundGroup);
  });

  it('should set notice date', () => {
    const date = new Date('10/10/2020');
    store.setNoticeDate(date);

    expect(store.noticeDate).toStrictEqual(date);
  });
});
