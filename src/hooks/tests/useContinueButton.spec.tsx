import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import useContinueButton from '@/hooks/useContinueButton';
import { LineItemRow } from '@/app/new/LineItems/types';

const TestComponent = () => {
  const { isContinueDisabled, tooltipMessage } = useContinueButton();
  return <div data-testid="out">{JSON.stringify({ isContinueDisabled, tooltipMessage })}</div>;
};

jest.mock('@/stores', () => {
  const now = new Date('2025-01-01');
  return {
    capEventSettingsStore: {
      isGeneralSettingsEmpty: jest.fn(() => false),
      hasAttachmentErrors: false,
      fundEntities: [] as Array<{ label: string; state: string }>,
      entitiesLineItem: new Map<string, LineItemRow[]>(),
    },
    entityDatesStore: {
      getEntityNoticeDate: jest.fn(() => now),
      getEntityDueDate: jest.fn(() => now),
      getEntityDueDateInputValidity: jest.fn(() => true),
      getEntityNoticeDateInputValidity: jest.fn(() => true),
      noticeDate: now,
      hasDifferentDates: false,
    },
  };
});

const { capEventSettingsStore, entityDatesStore } = jest.requireMock('@/stores');

describe('useContinueButton', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    capEventSettingsStore.isGeneralSettingsEmpty.mockReturnValue(false);
    capEventSettingsStore.hasAttachmentErrors = false;
    capEventSettingsStore.fundEntities = [];
    capEventSettingsStore.entitiesLineItem = new Map();

    entityDatesStore.getEntityNoticeDate.mockImplementation(() => new Date('2025-01-01'));
    entityDatesStore.getEntityDueDate.mockImplementation(() => new Date('2025-01-02'));
    entityDatesStore.getEntityDueDateInputValidity.mockReturnValue(true);
    entityDatesStore.getEntityNoticeDateInputValidity.mockReturnValue(true);
  });

  it('returns disabled when general settings are empty', () => {
    capEventSettingsStore.isGeneralSettingsEmpty.mockReturnValue(true);

    render(<TestComponent />);
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');

    expect(out.isContinueDisabled).toBe(true);
    expect(out.tooltipMessage).toBe('Not all required fields are populated');
  });

  it('is disabled unless all selected entities have valid dates and at least one valid row', () => {
    // Selected entities
    capEventSettingsStore.fundEntities = [
      { label: 'E1', state: 'S' },
      { label: 'E2', state: 'S' },
    ];

    const validRow: LineItemRow = {
      id: '1',
      amount: 100,
      investment: '', // optional for non-mandatory categories
      allocationBasis: 'Commitment',
      capitalCategory: 'Cont - Other',
      callDistributionReason: 'Reason',
      defaultDescription: 'Desc',
      insideCommitment: 'Yes',
    } as unknown as LineItemRow;
    capEventSettingsStore.entitiesLineItem.set('E1', [validRow]);

    const emptyRow: LineItemRow = {
      id: 'x',
      amount: 0,
      investment: '',
      allocationBasis: '',
      capitalCategory: '',
      callDistributionReason: '',
      defaultDescription: '',
      insideCommitment: '',
    } as unknown as LineItemRow;
    capEventSettingsStore.entitiesLineItem.set('E2', [emptyRow]);

    render(<TestComponent />);
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');
    expect(out.isContinueDisabled).toBe(true);
  });

  it('returns disabled when there are attachment errors even with a valid entity', () => {
    capEventSettingsStore.fundEntities = [{ label: 'E', state: 'S' }];
    const validRow: LineItemRow = {
      id: '1',
      amount: 10,
      investment: '',
      allocationBasis: 'Commitment',
      capitalCategory: 'Cont - Other',
      callDistributionReason: 'Reason',
      defaultDescription: 'Desc',
      insideCommitment: 'Yes',
    } as unknown as LineItemRow;
    capEventSettingsStore.entitiesLineItem.set('E', [validRow]);

    capEventSettingsStore.hasAttachmentErrors = true;

    render(<TestComponent />);
    const out = JSON.parse(screen.getByTestId('out').textContent || '{}');
    expect(out.isContinueDisabled).toBe(true);
  });
});
