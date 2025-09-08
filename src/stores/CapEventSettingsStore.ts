import { makeAutoObservable } from 'mobx';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { FundGroupItem } from '@/types/types';
import { Attachment } from '@/app/new/attachments/types';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ITEM_STATES } from '@/const/common';
import { ReferenceDataApi } from '@/api';
import { Accounts } from '@/api/referenceData';

const selectedFilterCallback = (item: DropdownItemType) => item.state === ITEM_STATES.SELECTED;

class CapEventSettingsStore {
  eventTypes: DropdownItemType[] = [];
  templates: DropdownItemType[] = [];
  fundGroups: DropdownItemType<FundGroupItem>[] = [];
  funds: DropdownItemType[] = [];
  noticeDate: Date | null = null;
  attachments: Attachment[] = [];
  isEntitiesDropdownOpen: boolean = false;
  fundGroupsLineItem: LineItemRow[] = [];
  entitiesLineItem = new Map<string, LineItemRow[]>();
  accounts: Accounts[] = [];

  constructor() {
    makeAutoObservable(this);

    this.fetchAccounts();
  }

  get isGeneralSettingsEmpty() {
    const selectedEventTypes = this.eventTypes.filter(selectedFilterCallback);
    const selectedTemplates = this.templates.filter(selectedFilterCallback);
    const selectedFundGroups = this.fundGroups.filter(selectedFilterCallback);
    const selectedFunds = this.funds.filter(selectedFilterCallback);

    return (
      selectedEventTypes.length === 0 ||
      selectedTemplates.length === 0 ||
      selectedFundGroups.length === 0 ||
      selectedFunds.length === 0 ||
      this.noticeDate === null
    );
  }

  *fetchAccounts() {
    this.accounts = yield ReferenceDataApi.getAccounts('Golden Image DEV');
  }

  setEventTypes(types: DropdownItemType[]) {
    this.eventTypes = types;
  }

  setTemplates(templates: DropdownItemType[]) {
    this.templates = templates;
  }

  setFundGroups(fundGroups: DropdownItemType<FundGroupItem>[]) {
    this.fundGroups = fundGroups;
  }

  setFunds(funds: DropdownItemType[]) {
    this.funds = funds;
  }

  setNoticeDate(date: Date) {
    this.noticeDate = date;
  }

  setAttachments(attachments: Attachment[]) {
    this.attachments = attachments;
  }

  toggleAttachmentCheckbox(id: string) {
    const item = this.attachments.find((att) => att.file.name === id);
    if (item) {
      item.checked = !item.checked;
    }
  }

  setEntitiesDropdownOpen(isOpen: boolean) {
    this.isEntitiesDropdownOpen = isOpen;
  }

  setFundGroupsLineItem(data: LineItemRow[]) {
    this.fundGroupsLineItem = data;
  }

  setEntitiesLineItem(key: string, data: LineItemRow[]) {
    this.entitiesLineItem.set(key, data);
  }
}

export default CapEventSettingsStore;
