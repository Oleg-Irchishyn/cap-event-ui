import CapEventSettingsStore from '@/stores/CapEventSettingsStore';
import { LineItemRow } from '@/app/new/LineItems/types';
import { USER_PROVIDED_OPTION } from '@/app/new/LineItems/const';

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

  it('should set foundGroupsLineItems', () => {
    const lineItems: LineItemRow[] = [
      {
        id: '1',
        amount: 10,
        capitalCategory: 'Dist',
        callDistributionReason: 'Reason',
        defaultDescription: 'Desc',
        insideCommitment: 'Yes',
        investment: 'Investment',
        allocationBasis: 'Basis',
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
        investment: 'Investment',
        allocationBasis: 'Basis',
      },
    ];
    const entityKey = 'entity-123';
    store.setEntitiesLineItem(entityKey, lineItems);

    expect(store.entitiesLineItem.get(entityKey)).toStrictEqual(lineItems);
  });

  describe('isFundGroupLineItemsChanged', () => {
    const createMockLineItem = (overrides: Partial<LineItemRow> = {}): LineItemRow => ({
      id: '1',
      amount: 100,
      investment: 'Investment A',
      allocationBasis: 'Basis A',
      capitalCategory: 'Category A',
      defaultDescription: 'Description A',
      callDistributionReason: 'Reason A',
      inheritedId: 'inherited-1',
      ...overrides,
    });

    it('should return false when arrays are identical', () => {
      const lineItems = [createMockLineItem()];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      expect(store.isFundGroupLineItemsChanged).toBe(false);
    });

    it('should ignore amount if allocation basis USER-PROVIDED', () => {
      const lineItems = [createMockLineItem({ allocationBasis: USER_PROVIDED_OPTION, amount: 0 })];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();
      const changedLineItems = [
        createMockLineItem({ allocationBasis: USER_PROVIDED_OPTION, amount: 100 }),
      ];
      store.setFundGroupsLineItem(changedLineItems);

      expect(store.isFundGroupLineItemsChanged).toBe(false);
    });

    it('should return true when arrays have different lengths', () => {
      const lineItems = [createMockLineItem()];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      // Add another item
      store.setFundGroupsLineItem([...lineItems, createMockLineItem({ id: '2' })]);

      expect(store.isFundGroupLineItemsChanged).toBe(true);
    });

    it('should return true when amount differs', () => {
      const lineItems = [createMockLineItem({ amount: 100 })];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      store.setFundGroupsLineItem([createMockLineItem({ amount: 200 })]);

      expect(store.isFundGroupLineItemsChanged).toBe(true);
    });

    it('should return true when investment differs', () => {
      const lineItems = [createMockLineItem({ investment: 'Investment A' })];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      store.setFundGroupsLineItem([createMockLineItem({ investment: 'Investment B' })]);

      expect(store.isFundGroupLineItemsChanged).toBe(true);
    });

    it('should return true when allocationBasis differs', () => {
      const lineItems = [createMockLineItem({ allocationBasis: 'Basis A' })];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      store.setFundGroupsLineItem([createMockLineItem({ allocationBasis: 'Basis B' })]);

      expect(store.isFundGroupLineItemsChanged).toBe(true);
    });

    it('should return true when capitalCategory differs', () => {
      const lineItems = [createMockLineItem({ capitalCategory: 'Category A' })];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      store.setFundGroupsLineItem([createMockLineItem({ capitalCategory: 'Category B' })]);

      expect(store.isFundGroupLineItemsChanged).toBe(true);
    });

    it('should return true when defaultDescription differs', () => {
      const lineItems = [createMockLineItem({ defaultDescription: 'Description A' })];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      store.setFundGroupsLineItem([createMockLineItem({ defaultDescription: 'Description B' })]);

      expect(store.isFundGroupLineItemsChanged).toBe(true);
    });

    it('should return true when callDistributionReason differs', () => {
      const lineItems = [createMockLineItem({ callDistributionReason: 'Reason A' })];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      store.setFundGroupsLineItem([createMockLineItem({ callDistributionReason: 'Reason B' })]);

      expect(store.isFundGroupLineItemsChanged).toBe(true);
    });

    it('should return true when order of items changes', () => {
      const lineItems = [
        createMockLineItem({ id: '1', amount: 100 }),
        createMockLineItem({ id: '2', amount: 200 }),
      ];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      // Change order
      store.setFundGroupsLineItem([
        createMockLineItem({ id: '2', amount: 200 }),
        createMockLineItem({ id: '1', amount: 100 }),
      ]);

      expect(store.isFundGroupLineItemsChanged).toBe(true);
    });

    it('should handle empty arrays', () => {
      store.setFundGroupsLineItem([]);
      store.setFundGroupsStateAfterApply();

      expect(store.isFundGroupLineItemsChanged).toBe(false);
    });
  });

  describe('setFundGroupsStateAfterApply', () => {
    const createMockLineItem = (overrides: Partial<LineItemRow> = {}): LineItemRow => ({
      id: '1',
      amount: 100,
      investment: 'Investment A',
      allocationBasis: 'Basis A',
      capitalCategory: 'Category A',
      defaultDescription: 'Description A',
      callDistributionReason: 'Reason A',
      inheritedId: 'inherited-1',
      ...overrides,
    });

    it('should create a deep copy of fundGroupsLineItem', () => {
      const lineItems = [createMockLineItem()];
      store.setFundGroupsLineItem(lineItems);
      store.setFundGroupsStateAfterApply();

      // Verify it's a deep copy, not a reference
      expect(store.fundGroupsStateAfterApply).not.toBe(store.fundGroupsLineItem);
      expect(store.fundGroupsStateAfterApply).toEqual(store.fundGroupsLineItem);
    });
  });

  describe('isFundGroupLineItemsFilled', () => {
    const createMockLineItem = (overrides: Partial<LineItemRow> = {}): LineItemRow => ({
      id: '1',
      amount: 100,
      investment: 'Investment A',
      allocationBasis: 'Basis A',
      capitalCategory: 'Category A',
      defaultDescription: 'Description A',
      callDistributionReason: 'Reason A',
      insideCommitment: 'Yes',
      ...overrides,
    });

    it('should return false when fundGroupsLineItem is empty', () => {
      store.setFundGroupsLineItem([]);
      expect(store.isFundGroupLineItemsFilled).toBe(false);
    });

    it('should return true when all required fields are filled', () => {
      const lineItems = [createMockLineItem()];
      store.setFundGroupsLineItem(lineItems);
      expect(store.isFundGroupLineItemsFilled).toBe(true);
    });

    it('should return false when any required field is missing', () => {
      const lineItems = [createMockLineItem({ capitalCategory: '' })];
      store.setFundGroupsLineItem(lineItems);
      expect(store.isFundGroupLineItemsFilled).toBe(false);
    });

    it('should return false when amount is 0 and allocationBasis is not USER_PROVIDED_OPTION', () => {
      const lineItems = [createMockLineItem({ amount: 0, allocationBasis: 'Commitment' })];
      store.setFundGroupsLineItem(lineItems);
      expect(store.isFundGroupLineItemsFilled).toBe(false);
    });

    it('should return true when amount is 0 but allocationBasis is USER_PROVIDED_OPTION', () => {
      const lineItems = [createMockLineItem({ amount: 0, allocationBasis: USER_PROVIDED_OPTION })];
      store.setFundGroupsLineItem(lineItems);
      expect(store.isFundGroupLineItemsFilled).toBe(true);
    });

    it('should return true when investment is empty but capitalCategory is not mandatory', () => {
      const lineItems = [
        createMockLineItem({
          investment: '',
          capitalCategory: 'Non-mandatory category',
        }),
      ];
      store.setFundGroupsLineItem(lineItems);
      expect(store.isFundGroupLineItemsFilled).toBe(true);
    });

    it('should return false when investment is empty and capitalCategory is mandatory', () => {
      const lineItems = [
        createMockLineItem({
          investment: '',
          capitalCategory: 'Cont - Investments',
        }),
      ];
      store.setFundGroupsLineItem(lineItems);
      expect(store.isFundGroupLineItemsFilled).toBe(false);
    });

    it('should return false when any field is empty string', () => {
      const lineItems = [createMockLineItem({ defaultDescription: '' })];
      store.setFundGroupsLineItem(lineItems);
      expect(store.isFundGroupLineItemsFilled).toBe(false);
    });

    it('should return true for multiple line items when all are filled', () => {
      const lineItems = [
        createMockLineItem({ id: '1' }),
        createMockLineItem({ id: '2', amount: 200 }),
      ];
      store.setFundGroupsLineItem(lineItems);
      expect(store.isFundGroupLineItemsFilled).toBe(true);
    });

    it('should return false for multiple line items when any is not filled', () => {
      const lineItems = [
        createMockLineItem({ id: '1' }),
        createMockLineItem({ id: '2', capitalCategory: '' }),
      ];
      store.setFundGroupsLineItem(lineItems);
      expect(store.isFundGroupLineItemsFilled).toBe(false);
    });
  });
});
