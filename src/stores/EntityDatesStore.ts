import { makeAutoObservable, toJS } from 'mobx';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { ITEM_STATES } from '@/const/common';
import { DAY_TYPES, DISTRIBUTION_EVENT_TYPE_DAYS } from '@/const/dateTypes';
import RootStore from '@/stores/RootStore';

interface EntityDates {
  [entityLabel: string]: {
    noticeDate: Date | null;
    dueDate: Date | null;
    isDueDateManuallyOverridden: boolean;
    isDueDateInputValid: boolean;
    isNoticeDateInputValid: boolean;
  };
}

interface ExtendedDropdownItemType extends DropdownItemType {
  dueDateDays?: string;
  dueDateType?: string;
}

class EntityDatesStore {
  initialStateSnapshot: unknown = null;

  root: RootStore;

  noticeDate: Date | null = null;
  entityDates: EntityDates = {};
  hasDifferentDates: boolean = false;
  selectedEventType: string = '';

  constructor(root: RootStore) {
    this.root = root;

    makeAutoObservable(this);
  }

  collectFields() {
    return {
      noticeDate: this.noticeDate,
      entityDates: this.entityDates,
      hasDifferentDates: this.hasDifferentDates,
      selectedEventType: this.selectedEventType,
    };
  }

  setInitialStateSnapshot() {
    this.initialStateSnapshot = toJS(this.collectFields());
  }

  setNoticeDate(date: Date | null) {
    this.noticeDate = date;
    this.resetDifferentDatesState();
  }

  setEntityNoticeDate(entityLabel: string, date: Date | null) {
    if (!this.entityDates[entityLabel]) {
      this.entityDates[entityLabel] = {
        noticeDate: null,
        dueDate: null,
        isDueDateManuallyOverridden: false,
        isDueDateInputValid: true,
        isNoticeDateInputValid: true,
      };
    }
    this.entityDates[entityLabel].noticeDate = date;
    // When the date is set programmatically, ensure input validity reflects the actual value
    if (date) {
      this.entityDates[entityLabel].isNoticeDateInputValid = true;
    }
  }

  setEntityDueDate(entityLabel: string, date: Date | null) {
    if (!this.entityDates[entityLabel]) {
      this.entityDates[entityLabel] = {
        noticeDate: null,
        dueDate: null,
        isDueDateManuallyOverridden: false,
        isDueDateInputValid: true,
        isNoticeDateInputValid: true,
      };
    }
    this.entityDates[entityLabel].dueDate = date;
    if (date) {
      this.entityDates[entityLabel].isDueDateInputValid = true;
    }
  }

  setEntityDueDateManually(entityLabel: string, date: Date | null) {
    if (!this.entityDates[entityLabel]) {
      this.entityDates[entityLabel] = {
        noticeDate: null,
        dueDate: null,
        isDueDateManuallyOverridden: false,
        isDueDateInputValid: true,
        isNoticeDateInputValid: true,
      };
    }
    this.entityDates[entityLabel].dueDate = date;
    this.entityDates[entityLabel].isDueDateManuallyOverridden = true;
    if (date) {
      this.entityDates[entityLabel].isDueDateInputValid = true;
    }
  }

  getEntityNoticeDate(entityLabel: string): Date | null {
    return this.entityDates[entityLabel]?.noticeDate || null;
  }

  getEntityDueDate(entityLabel: string): Date | null {
    return this.entityDates[entityLabel]?.dueDate || null;
  }

  setEntityDueDateInputValidity(entityLabel: string, isValid: boolean) {
    if (!this.entityDates[entityLabel]) {
      this.entityDates[entityLabel] = {
        noticeDate: null,
        dueDate: null,
        isDueDateManuallyOverridden: false,
        isDueDateInputValid: true,
        isNoticeDateInputValid: true,
      };
    }
    this.entityDates[entityLabel].isDueDateInputValid = isValid;
  }

  getEntityDueDateInputValidity(entityLabel: string): boolean {
    return this.entityDates[entityLabel]?.isDueDateInputValid ?? true;
  }

  setEntityNoticeDateInputValidity(entityLabel: string, isValid: boolean) {
    if (!this.entityDates[entityLabel]) {
      this.entityDates[entityLabel] = {
        noticeDate: null,
        dueDate: null,
        isDueDateManuallyOverridden: false,
        isDueDateInputValid: true,
        isNoticeDateInputValid: true,
      };
    }
    this.entityDates[entityLabel].isNoticeDateInputValid = isValid;
  }

  getEntityNoticeDateInputValidity(entityLabel: string): boolean {
    return this.entityDates[entityLabel]?.isNoticeDateInputValid ?? true;
  }

  clearGeneralNoticeDate() {
    this.noticeDate = null;
  }

  setDifferentDatesState() {
    this.noticeDate = null;
    this.hasDifferentDates = true;
  }

  resetDifferentDatesState() {
    this.hasDifferentDates = false;
  }

  cancelChanges() {
    if (!this.initialStateSnapshot) return;

    Object.assign(this, toJS(this.initialStateSnapshot));
  }

  resetAllDates() {
    this.noticeDate = null;
    this.entityDates = {};
    this.hasDifferentDates = false;
  }

  setSelectedEventType(eventType: string) {
    this.selectedEventType = eventType || '';
  }

  updateEntityDatesFromGeneral(funds: DropdownItemType[]) {
    if (this.noticeDate && funds && Array.isArray(funds)) {
      funds
        .filter((fund) => fund && fund.state === ITEM_STATES.SELECTED)
        .forEach((fund) => {
          this.setEntityNoticeDate(fund.label, this.noticeDate);
          this.calculateAndSetEntityDueDate(fund.label, funds);
        });
    }
  }

  recalcEntityDueDatesForSelectedFunds(funds: DropdownItemType[]) {
    if (!funds || !Array.isArray(funds)) return;
    funds
      .filter((fund) => fund && fund.state === ITEM_STATES.SELECTED)
      .forEach((fund) => {
        const entityLabel = fund.label;
        const entityData = this.entityDates[entityLabel];
        if (entityData?.noticeDate) {
          this.calculateAndSetEntityDueDate(entityLabel, funds);
        }
      });
  }

  calculateAndSetEntityDueDate(entityLabel: string, funds: DropdownItemType[]) {
    const entityData = this.entityDates[entityLabel];
    if (!entityData?.noticeDate || !funds || !Array.isArray(funds)) return;

    const selectedFund = funds.find(
      (fund) => fund && fund.label === entityLabel,
    ) as ExtendedDropdownItemType;

    const isDistribution = this.selectedEventType.toLowerCase().includes('dist');

    const noticeDate = new Date(entityData.noticeDate);

    let numberOfDays: number;
    let dateType: string;

    if (isDistribution) {
      numberOfDays = DISTRIBUTION_EVENT_TYPE_DAYS;
      dateType = DAY_TYPES.BUSINESS;
    } else {
      const dueDateDays = selectedFund?.dueDateDays;
      const dueDateType = selectedFund?.dueDateType;

      if (!dueDateDays || !dueDateType) {
        this.setEntityDueDate(entityLabel, null);
        this.clearDueDateManualOverride(entityLabel);
        return;
      }

      numberOfDays = parseInt(dueDateDays, 10);
      dateType = dueDateType.toLowerCase().includes(DAY_TYPES.BUSINESS)
        ? DAY_TYPES.BUSINESS
        : DAY_TYPES.CALENDAR;
    }

    const dueDate = this.addDaysToDate(noticeDate, numberOfDays, dateType);

    this.setEntityDueDate(entityLabel, dueDate);
    this.root.capEventSettingsStore.updateEntityLineItemPRDate(entityLabel, dueDate);
    this.clearDueDateManualOverride(entityLabel);
    // Ensure the due date input validity is true after calculation
    this.setEntityDueDateInputValidity(entityLabel, true);
  }

  clearDueDateManualOverride(entityLabel: string) {
    if (this.entityDates[entityLabel]) {
      this.entityDates[entityLabel].isDueDateManuallyOverridden = false;
    }
  }

  isDueDateManuallyOverridden(entityLabel: string): boolean {
    return this.entityDates[entityLabel]?.isDueDateManuallyOverridden || false;
  }

  private addDaysToDate(date: Date, days: number, dateType: string): Date {
    const result = new Date(date);

    if (dateType === DAY_TYPES.BUSINESS) {
      let addedDays = 0;
      while (addedDays < days) {
        result.setDate(result.getDate() + 1);
        if (result.getDay() !== 0 && result.getDay() !== 6) {
          addedDays++;
        }
      }
    } else {
      result.setDate(result.getDate() + days);
    }

    return result;
  }

  get isAllDueDatesFilled() {
    const selectedEntities =
      this.root.capEventSettingsStore.fundEntities?.filter(
        (e) => e && e.state === ITEM_STATES.SELECTED,
      ) ?? [];

    if (selectedEntities.length === 0) return false;

    return selectedEntities.every((e) => {
      const label = e.label ?? '';
      return !!this.getEntityDueDate(label);
    });
  }
}

export default EntityDatesStore;
