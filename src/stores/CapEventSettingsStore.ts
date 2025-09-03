import { makeAutoObservable } from 'mobx';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { Attachment } from '@/app/new/attachments/types';

class CapEventSettingsStore {
  eventTypes: DropdownItemType[] = [];
  templates: DropdownItemType[] = [];
  fundGroups: DropdownItemType[] = [];
  funds: DropdownItemType[] = [];
  noticeDate: Date | null = null;
  attachments: Attachment[] = [];

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

  setAttachments(attachments: Attachment[]) {
    this.attachments = attachments;
  }

  toggleAttachmentCheckbox(id: string) {
    const item = this.attachments.find((att) => att.file.name === id);
    if (item) {
      item.checked = !item.checked;
    }
  }
}

export default CapEventSettingsStore;
