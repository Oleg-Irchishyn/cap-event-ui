import { makeAutoObservable } from 'mobx';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { FundGroupItem } from '@/types/types';
import { Attachment } from '@/app/new/attachments/types';

class CapEventSettingsStore {
  eventTypes: DropdownItemType[] = [];
  templates: DropdownItemType[] = [];
  fundGroups: DropdownItemType<FundGroupItem>[] = [];
  funds: DropdownItemType[] = [];
  noticeDate: Date | null = null;
  attachments: Attachment[] = [];
  isEntitiesDropdownOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }

  get isGeneralSettingsEmpty() {
    return (
      this.eventTypes.length === 0 ||
      this.templates.length === 0 ||
      this.fundGroups.length === 0 ||
      this.funds.length === 0 ||
      this.noticeDate === null
    );
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
}

export default CapEventSettingsStore;
