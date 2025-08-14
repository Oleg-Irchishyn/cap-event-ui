import { makeAutoObservable } from 'mobx';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';

class CapEventSettingsStore {
  eventTypes: DropdownItemType[] = [];
  templates: DropdownItemType[] = [];
  fundGroups: DropdownItemType[] = [];
  funds: DropdownItemType[] = [];
  noticeDate: Date | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setEventTypes(types: DropdownItemType[]) {
    this.eventTypes = types;
  }

  setTemplates(templates: DropdownItemType[]) {
    this.templates = templates;
  }

  setFundGroups(fundGroups: DropdownItemType[]) {
    this.fundGroups = fundGroups;
  }

  setFunds(funds: DropdownItemType[]) {
    this.funds = funds;
  }

  setNoticeDate(date: Date) {
    this.noticeDate = date;
  }
}

export default CapEventSettingsStore;
