import { LineItemRow } from '@/app/new/LineItems/types';
import { USER_PROVIDED_OPTION } from '@/app/new/LineItems/const';

// Mock the dependencies to avoid circular imports
jest.mock('@/api', () => ({
  ReferenceDataApi: {
    accounts: {
      getAccounts: jest.fn(),
    },
    investments: {
      getInvestments: jest.fn(),
    },
    session: {
      getSessionId: jest.fn(),
    },
  },
  CapEventPackageApi: {
    default: {
      getMgmtFeeJournalEntries: jest.fn().mockReturnValue({
        testId: [],
      }),
    },
  },
}));

jest.mock('@/utils/prepareNewRow', () => ({
  prepareNewRow: jest.fn(() => ({
    id: 'mock-id',
    amount: 0,
    investment: '',
    allocationBasis: '',
  })),
}));

jest.mock('@/stores', () => ({
  entityDatesStore: {
    getEntityDueDate: jest.fn(() => new Date('2024-01-01')),
  },
}));

// Import after mocking
import CapEventSettingsStore from '@/stores/CapEventSettingsStore';
import { Account, FundGroup } from '@/clients/ReferenceData';
import { ReferenceDataApi } from '@/api';
import type { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import type { Attachment, DragNDropError } from '@/app/new/attachments/types';

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

  it('should set sponsors', () => {
    const mockSponsors = mockDropdownValue('Sponsor');
    store.setSponsors(mockSponsors);

    expect(store.sponsors).toStrictEqual(mockSponsors);
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

  it('should set otherEntitiesLineItems', () => {
    const lineItems: LineItemRow[] = [
      {
        id: '2',
        amount: 10,
        accountName: 'Account Name',
        callDistributionReason: 'Reason',
        defaultDescription: 'Desc',
        insideCommitment: 'Yes',
        investment: 'Investment',
        allocationBasis: 'Basis',
      },
    ];
    const entityKey = 'entity-123';
    store.setOtherEntitiesLineItems(entityKey, lineItems);

    expect(store.otherEntitiesLineItem.get(entityKey)).toStrictEqual(lineItems);
  });

  it('should set mgmtJournalEntries', async () => {
    await store.fetchMgmtJournalEntries(['testId']);

    expect(store.mgmtJournalEntries).toEqual({
      testId: [],
    });
  });

  it('should set otherTableAccounts', () => {
    const accounts: Account[] = [
      {
        accountNo: 'accountNo',
        accountName: 'accountName',
        capitalCategory: 'Category',
        callDistributionReason: 'reason',
        defaultDescription: 'desc',
        insideCommitment: 'com',
      },
    ];
    store.setOtherTableAccounts(accounts);

    expect(store.otherTableAccounts).toStrictEqual(accounts);
  });

  it('should call initAccountsSet', () => {
    store.initAccountsSet('mockId');

    expect(ReferenceDataApi.accounts.getAccounts).toHaveBeenCalled();
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
      inheritedFundGroupLineItemId: 'inherited-1',
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
      inheritedFundGroupLineItemId: 'inherited-1',
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

  describe('updateEntityLineItemPRDate', () => {
    it('should update prDate for all line items of an existing entity', () => {
      // Arrange
      const entityLabel = 'Test Entity';
      const existingDate = new Date('2024-01-15');
      const newDate = new Date('2024-02-20');

      const lineItems: LineItemRow[] = [
        {
          id: '1',
          amount: 100,
          investment: 'Investment A',
          allocationBasis: 'Basis A',
          prDate: existingDate,
        } as unknown as LineItemRow,
        {
          id: '2',
          amount: 200,
          investment: 'Investment B',
          allocationBasis: 'Basis B',
          prDate: existingDate,
        } as unknown as LineItemRow,
      ];

      store.entitiesLineItem.set(entityLabel, lineItems);

      // Act
      store.updateEntityLineItemPRDate(entityLabel, newDate);

      // Assert
      const updatedLineItems = store.entitiesLineItem.get(entityLabel);
      expect(updatedLineItems).toHaveLength(2);
      expect(updatedLineItems![0].prDate).toEqual(newDate);
      expect(updatedLineItems![1].prDate).toEqual(newDate);
    });

    it('should not modify line items when entity does not exist', () => {
      // Arrange
      const nonExistentEntity = 'Non Existent Entity';
      const newDate = new Date('2024-02-20');
      const initialSize = store.entitiesLineItem.size;

      // Act
      store.updateEntityLineItemPRDate(nonExistentEntity, newDate);

      // Assert
      expect(store.entitiesLineItem.size).toBe(initialSize);
      expect(store.entitiesLineItem.has(nonExistentEntity)).toBe(false);
    });

    it('should preserve other properties when updating prDate', () => {
      // Arrange
      const entityLabel = 'Test Entity';
      const newDate = new Date('2024-02-20');

      const originalItem: LineItemRow = {
        id: 'test-id',
        amount: 500,
        investment: 'Test Investment',
        allocationBasis: 'Test Basis',
        prDate: new Date('2024-01-01'),
        capitalCategory: 'Test Category',
        callDistributionReason: 'Test Reason',
        defaultDescription: 'Test Description',
        insideCommitment: 'Test Commitment',
      } as unknown as LineItemRow;

      store.entitiesLineItem.set(entityLabel, [originalItem]);

      // Act
      store.updateEntityLineItemPRDate(entityLabel, newDate);

      // Assert
      const updatedItem = store.entitiesLineItem.get(entityLabel)![0];
      expect(updatedItem.prDate).toEqual(newDate);
      expect(updatedItem.id).toBe(originalItem.id);
      expect(updatedItem.amount).toBe(originalItem.amount);
      expect(updatedItem.investment).toBe(originalItem.investment);
      expect(updatedItem.allocationBasis).toBe(originalItem.allocationBasis);
      expect(updatedItem.capitalCategory).toBe(originalItem.capitalCategory);
    });
  });

  describe('customEntityDescription', () => {
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

    it('should return empty array when both fundGroupsLineItem and entitiesLineItem are empty', () => {
      store.setFundGroupsLineItem([]);
      store.entitiesLineItem.clear();

      expect(store.customEntityDescription).toEqual([]);
    });

    it('should return descriptions from fundGroupsLineItem only', () => {
      const lineItems = [
        createMockLineItem({ id: '1', defaultDescription: 'Fund Group Desc 1' }),
        createMockLineItem({ id: '2', defaultDescription: 'Fund Group Desc 2' }),
      ];
      store.setFundGroupsLineItem(lineItems);
      store.entitiesLineItem.clear();

      expect(store.customEntityDescription).toEqual(['Fund Group Desc 1', 'Fund Group Desc 2']);
    });

    it('should combine descriptions from both fundGroupsLineItem and entitiesLineItem', () => {
      const fundGroupItems = [
        createMockLineItem({ id: '1', defaultDescription: 'Fund Group Desc' }),
      ];
      const entityItems = [createMockLineItem({ id: '2', defaultDescription: 'Entity Desc' })];
      store.setFundGroupsLineItem(fundGroupItems);
      store.setEntitiesLineItem('entity-1', entityItems);

      expect(store.customEntityDescription).toEqual(['Entity Desc', 'Fund Group Desc']);
    });

    it('should remove duplicate descriptions', () => {
      const fundGroupItems = [
        createMockLineItem({ id: '1', defaultDescription: 'Duplicate Desc' }),
      ];
      const entity1Items = [createMockLineItem({ id: '2', defaultDescription: 'Duplicate Desc' })];
      const entity2Items = [createMockLineItem({ id: '3', defaultDescription: 'Unique Desc' })];
      store.setFundGroupsLineItem(fundGroupItems);
      store.setEntitiesLineItem('entity-1', entity1Items);
      store.setEntitiesLineItem('entity-2', entity2Items);

      expect(store.customEntityDescription).toEqual(['Duplicate Desc', 'Unique Desc']);
    });

    it('should filter out empty and falsy descriptions', () => {
      const fundGroupItems = [
        createMockLineItem({ id: '1', defaultDescription: 'Valid Desc 1' }),
        createMockLineItem({ id: '2', defaultDescription: '' }),
        createMockLineItem({ id: '3', defaultDescription: 'Valid Desc 2' }),
      ];
      const entityItems = [
        createMockLineItem({ id: '4', defaultDescription: '' }),
        createMockLineItem({ id: '5', defaultDescription: 'Valid Desc 3' }),
      ];
      store.setFundGroupsLineItem(fundGroupItems);
      store.setEntitiesLineItem('entity-1', entityItems);

      expect(store.customEntityDescription).toEqual([
        'Valid Desc 1',
        'Valid Desc 2',
        'Valid Desc 3',
      ]);
    });
  });

  describe('attachmentErrors', () => {
    it('should report no attachment errors by default', () => {
      expect(store.hasAttachmentErrors).toBe(false);
    });

    it('should report attachment errors when any error exists', () => {
      store.setAttachmentErrors([{ message: 'Maximum size limit per file: 5 MB.' }]);
      expect(store.hasAttachmentErrors).toBe(true);
    });

    it('should clear attachment errors', () => {
      store.setAttachmentErrors([{ message: 'Unsupported format(s).' }]);
      expect(store.hasAttachmentErrors).toBe(true);

      store.setAttachmentErrors([]);
      expect(store.hasAttachmentErrors).toBe(false);
    });
  });

  describe('resetAfterPreview', () => {
    it('should clear general selections, dates, attachments and reset FG CELIs', () => {
      const fgItems: DropdownItemType<FundGroup>[] = [
        {
          label: 'FG-1',
          id: '1',
          name: 'FG',
          state: 'S',
        } as unknown as DropdownItemType<FundGroup>,
      ];
      const entityItems: DropdownItemType[] = [
        {
          label: 'E-1',
          id: 'E1',
          state: 'S',
        } as unknown as DropdownItemType,
      ];
      store.setFundGroups(fgItems);
      store.setFundEntities(entityItems);
      store.entitiesSelectedCountSnapshot = 2 as unknown as number;

      store.setNoticeDate(new Date());
      store.setIsNoticeDateValid(false);

      store.setAttachments([{ file: { name: 'a.pdf' }, checked: true } as unknown as Attachment]);
      store.setAttachmentErrors([{ message: 'test' } as unknown as DragNDropError]);

      store.setFundGroupsLineItem([
        {
          id: 'row-a',
          amount: 10,
          investment: 'X',
          allocationBasis: 'B',
        } as unknown as LineItemRow,
        {
          id: 'row-b',
          amount: 20,
          investment: 'Y',
          allocationBasis: 'C',
        } as unknown as LineItemRow,
      ]);
      store.setFundGroupsStateAfterApply();

      store.resetAfterPreview();

      expect(store.fundGroups.every((fg) => fg.state === 'O')).toBe(true);
      expect(store.fundEntities.every((e) => e.state === 'O')).toBe(true);
      expect(store.entitiesSelectedCountSnapshot).toBeNull();

      expect(store.noticeDate).toBeNull();
      expect(store.isNoticeDateValid).toBe(true);

      expect(store.attachments).toEqual([]);
      expect(store.attachmentErrors).toEqual([]);

      expect(store.fundGroupsLineItem).toHaveLength(1);
      expect(store.fundGroupsLineItem[0]).toEqual(
        expect.objectContaining({ id: 'mock-id', amount: 0, investment: '', allocationBasis: '' }),
      );
      expect(store.fundGroupsStateAfterApply).toHaveLength(1);
      expect(store.fundGroupsStateAfterApply[0]).toEqual(
        expect.objectContaining({ id: 'mock-id', amount: 0, investment: '', allocationBasis: '' }),
      );
    });
  });
});
