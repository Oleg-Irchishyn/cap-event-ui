import { makeAutoObservable } from 'mobx';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { ITEM_STATES } from '@/const/common';
import { DAY_TYPES, DISTRIBUTION_EVENT_TYPE_DAYS } from '@/const/dateTypes';
import { capEventSettingsStore } from '@/stores/index';

interface EntityDates {
  [entityLabel: string]: {
    noticeDate: Date | null;
    dueDate: Date | null;
    isDueDateManuallyOverridden: boolean;
    isDueDateInputValid: boolean;
  };
}

interface ExtendedDropdownItemType extends DropdownItemType {
  dueDateDays?: string;
  dueDateType?: string;
}

class EntityDatesStore {
  noticeDate: Date | null = null;
  entityDates: EntityDates = {};
  hasDifferentDates: boolean = false;
  selectedEventType: string = '';

  constructor() {
    makeAutoObservable(this);
  }

  setNoticeDate(date: Date) {
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
      };
    }
    this.entityDates[entityLabel].noticeDate = date;
  }

  setEntityDueDate(entityLabel: string, date: Date | null) {
    if (!this.entityDates[entityLabel]) {
      this.entityDates[entityLabel] = {
        noticeDate: null,
        dueDate: null,
        isDueDateManuallyOverridden: false,
        isDueDateInputValid: true,
      };
    }
    this.entityDates[entityLabel].dueDate = date;
  }

  setEntityDueDateManually(entityLabel: string, date: Date | null) {
    if (!this.entityDates[entityLabel]) {
      this.entityDates[entityLabel] = {
        noticeDate: null,
        dueDate: null,
        isDueDateManuallyOverridden: false,
        isDueDateInputValid: true,
      };
    }
    this.entityDates[entityLabel].dueDate = date;
    this.entityDates[entityLabel].isDueDateManuallyOverridden = true;
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
      };
    }
    this.entityDates[entityLabel].isDueDateInputValid = isValid;
  }

  getEntityDueDateInputValidity(entityLabel: string): boolean {
    return this.entityDates[entityLabel]?.isDueDateInputValid ?? true;
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
    capEventSettingsStore.updateEntityLineItemPRDate(entityLabel, dueDate);
    this.clearDueDateManualOverride(entityLabel);
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
}

export default EntityDatesStore;
