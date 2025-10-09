import dayjs from 'dayjs';
import EntityDatesStore from '@/stores/EntityDatesStore';
import { ITEM_STATES } from '@/const/common';

type FundItem = { label: string; state: string; dueDateDays?: string; dueDateType?: string };

describe('EntityDatesStore', () => {
  let store: EntityDatesStore;

  beforeEach(() => {
    store = new EntityDatesStore();
  });

  it('sets general notice date and resets different dates state', () => {
    const date = new Date(2025, 0, 1);
    store.setDifferentDatesState();
    expect(store.hasDifferentDates).toBe(true);
    store.setNoticeDate(date);
    expect(store.noticeDate).toStrictEqual(date);
    expect(store.hasDifferentDates).toBe(false);
  });

  it('sets entity notice date and retrieves it', () => {
    const date = new Date(2025, 0, 10);
    store.setEntityNoticeDate('Fund A', date);
    expect(store.getEntityNoticeDate('Fund A')).toStrictEqual(date);
    expect(store.getEntityNoticeDate('Unknown')).toBeNull();
  });

  it('calculates due date with calendar days', () => {
    const entity = 'Fund Cal';
    const notice = new Date(2025, 1, 1);
    store.setEntityNoticeDate(entity, notice);
    const funds: FundItem[] = [
      { label: entity, state: ITEM_STATES.SELECTED, dueDateDays: '3', dueDateType: 'calendar' },
    ];

    store.calculateAndSetEntityDueDate(entity, funds);
    const due = store.getEntityDueDate(entity) as Date;
    expect(dayjs(due).format('YYYY-MM-DD')).toBe('2025-02-04');
  });

  it('calculates due date with business days and clears manual override', () => {
    const entity = 'Fund Biz';
    const notice = new Date(2025, 0, 3);
    store.setEntityNoticeDate(entity, notice);
    store.setEntityDueDateManually(entity, new Date(2025, 0, 5));
    expect(store.isDueDateManuallyOverridden(entity)).toBe(true);

    const funds: FundItem[] = [
      { label: entity, state: ITEM_STATES.SELECTED, dueDateDays: '2', dueDateType: 'BUSINESS' },
    ];

    store.calculateAndSetEntityDueDate(entity, funds);
    const due = store.getEntityDueDate(entity) as Date;
    // Fri + Mon + Tue => 2025-01-07
    expect(dayjs(due).format('YYYY-MM-DD')).toBe('2025-01-07');
    expect(store.isDueDateManuallyOverridden(entity)).toBe(false);
  });

  it('updates entity dates from general notice for selected funds only', () => {
    const general = new Date(2025, 2, 1);
    store.setNoticeDate(general);
    const funds: FundItem[] = [
      { label: 'A', state: ITEM_STATES.SELECTED, dueDateDays: '1', dueDateType: 'calendar' },
      { label: 'B', state: ITEM_STATES.OPTIONAL, dueDateDays: '1', dueDateType: 'calendar' },
    ];

    store.updateEntityDatesFromGeneral(funds);
    expect(dayjs(store.getEntityNoticeDate('A') as Date).format('YYYY-MM-DD')).toBe('2025-03-01');
    expect(dayjs(store.getEntityDueDate('A') as Date).format('YYYY-MM-DD')).toBe('2025-03-02');
    expect(store.getEntityNoticeDate('B')).toBeNull();
    expect(store.getEntityDueDate('B')).toBeNull();
  });

  it('recalculates due dates for selected funds with entity notice dates (Different Dates) and Distribution', () => {
    expect(store.noticeDate).toBeNull();

    store.setSelectedEventType('Distribution');

    const funds: FundItem[] = [
      { label: 'A', state: ITEM_STATES.SELECTED, dueDateDays: '10', dueDateType: 'calendar' },
      { label: 'B', state: ITEM_STATES.SELECTED, dueDateDays: '5', dueDateType: 'calendar' },
    ];

    store.setEntityNoticeDate('A', new Date(2025, 0, 3));

    store.recalcEntityDueDatesForSelectedFunds(funds);

    expect(dayjs(store.getEntityDueDate('A') as Date).format('YYYY-MM-DD')).toBe('2025-01-07');
    expect(store.getEntityDueDate('B')).toBeNull();
  });
});
