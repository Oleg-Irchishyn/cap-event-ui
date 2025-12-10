import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import useSaveDraftButton from '@/hooks/useSaveDraftButton';
import { LineItemRow } from '@/app/new/LineItems/types';
import { Investment } from '@/clients/ReferenceData';

const TestComponent = () => {
  const { isSaveDraftDisabled } = useSaveDraftButton();
  return <div data-testid="out">{JSON.stringify({ isSaveDraftDisabled })}</div>;
};

jest.mock('@/stores', () => {
  const now = new Date('2025-01-01');
  return {
    capEventSettingsStore: {
      isGeneralSettingsEmpty: jest.fn(() => false),
      fundGroupsLineItem: [] as LineItemRow[],
      isFundGroupLineItemsFilled: false,
      entitiesLineItem: new Map<string, LineItemRow[]>(),
    },
    entityDatesStore: {
      noticeDate: now,
      hasDifferentDates: false,
      entityDates: {},
    },
  };
});

jest.mock('@/utils/isRowEmpty', () => ({
  isRowEmpty: jest.fn((item: LineItemRow) => {
    return (
      item.capitalCategory === '' &&
      item.callDistributionReason === '' &&
      item.defaultDescription === '' &&
      item.insideCommitment === '' &&
      item.investment?.id === '' &&
      item.allocationBasis === '' &&
      item.amount === 0
    );
  }),
}));

jest.mock('@/utils/investment', () => ({
  isLineItemRowValid: jest.fn((item: LineItemRow) => {
    return (
      item.amount > 0 &&
      item.capitalCategory !== '' &&
      item.allocationBasis !== '' &&
      item.callDistributionReason !== ''
    );
  }),
}));

const { capEventSettingsStore, entityDatesStore } = jest.requireMock('@/stores');

describe('useSaveDraftButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capEventSettingsStore.isGeneralSettingsEmpty.mockReturnValue(false);
    capEventSettingsStore.fundGroupsLineItem = [];
    capEventSettingsStore.isFundGroupLineItemsFilled = false;
    capEventSettingsStore.entitiesLineItem = new Map();
    entityDatesStore.noticeDate = new Date('2025-01-01');
    entityDatesStore.hasDifferentDates = false;
    entityDatesStore.entityDates = {};
  });

  it('returns disabled when general settings are empty', () => {
    capEventSettingsStore.isGeneralSettingsEmpty.mockReturnValue(true);

    render(<TestComponent />);
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');

    expect(out.isSaveDraftDisabled).toBe(true);
  });

  it('returns disabled when entity dates are missing', () => {
    entityDatesStore.entityDates = {
      entity1: { dueDate: new Date('2025-01-01') },
      entity2: { dueDate: null },
    };

    render(<TestComponent />);
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');

    expect(out.isSaveDraftDisabled).toBe(true);
  });

  it('returns enabled when all conditions are met', () => {
    // All general settings are filled
    capEventSettingsStore.isGeneralSettingsEmpty.mockReturnValue(false);

    // All entity dates are present
    entityDatesStore.entityDates = {
      entity1: { dueDate: new Date('2025-01-01') },
      entity2: { dueDate: new Date('2025-01-02') },
    };

    // Fund groups are either empty or fully filled
    capEventSettingsStore.fundGroupsLineItem = [];

    // Entities line items are either empty or fully filled
    const validRow: LineItemRow = {
      id: '1',
      amount: 100,
      investment: { id: 'inv1' } as Investment,
      allocationBasis: 'Commitment',
      capitalCategory: 'Cont - Other',
      callDistributionReason: 'Reason',
      defaultDescription: 'Desc',
      insideCommitment: 'Yes',
    } as unknown as LineItemRow;
    capEventSettingsStore.entitiesLineItem.set('entity1', [validRow]);

    render(<TestComponent />);
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');

    expect(out.isSaveDraftDisabled).toBe(false);
  });
});
