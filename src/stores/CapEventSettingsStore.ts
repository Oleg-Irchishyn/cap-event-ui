import { makeAutoObservable } from 'mobx';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { Attachment } from '@/app/new/attachments/types';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ITEM_STATES } from '@/const/common';
import { Account, FundGroup, Investment } from '@/clients/ReferenceData';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { ReferenceDataApi } from '@/api';

const selectedFilterCallback = (item: DropdownItemType) => item.state === ITEM_STATES.SELECTED;

class CapEventSettingsStore {
  // General settings
  eventTypes: DropdownItemType[] = [];
  templates: DropdownItemType[] = [];
  fundGroups: DropdownItemType<FundGroup>[] = [];
  fundEntities: DropdownItemType[] = [];
  noticeDate: Date | null = null;
  isEntitiesDropdownOpen: boolean = false;

  attachments: Attachment[] = [];

  // Line Items
  fundGroupsLineItem: LineItemRow[] = [prepareNewRow()];
  entitiesLineItem = new Map<string, LineItemRow[]>();
  accounts: Account[] = [];
  investments: Investment[] = [];
  areInvestmentsLoading: boolean = false;
  // user inputs in line item table dropdown
  userInputs = new Map<string, string[]>(); // Key: cellKey (rowId-columnId), Value: array of user inputs

  sessionId: string = '';

  constructor() {
    makeAutoObservable(this);

    this.fetchAccounts();
    this.fetchInvestments();
    this.fetchSessionId();
  }

  isGeneralSettingsEmpty(noticeDate: Date | null, hasDifferentDates: boolean) {
    const selectedEventTypes = this.eventTypes.filter(selectedFilterCallback);
    const selectedTemplates = this.templates.filter(selectedFilterCallback);
    const selectedFundGroups = this.fundGroups.filter(selectedFilterCallback);
    const selectedFunds = this.fundEntities.filter(selectedFilterCallback);

    return (
      selectedEventTypes.length === 0 ||
      selectedTemplates.length === 0 ||
      selectedFundGroups.length === 0 ||
      selectedFunds.length === 0 ||
      (noticeDate === null && !hasDifferentDates)
    );
  }

  get isFundGroupLineItemsFilled() {
    return (
      !!this.fundGroupsLineItem.length &&
      this.fundGroupsLineItem.every((item) =>
        Object.values(item).every(
          (value) => value !== null && value !== undefined && value !== '' && value !== 0,
        ),
      )
    );
  }

  get hasMultipleEntitiesChosen() {
    return this.fundEntities.filter(selectedFilterCallback).length > 1;
  }

  *fetchAccounts() {
    try {
      this.accounts = yield ReferenceDataApi.accounts.getAccounts(
        'Golden Image DEV',
        ['Capital'],
        ['Cont-Management-fees'],
      );
    } catch (error) {
      console.error(error);
      this.accounts = [];
    }
  }

  *fetchInvestments() {
    try {
      this.areInvestmentsLoading = true;
      this.investments = yield ReferenceDataApi.investments.getInvestments();
    } catch (error) {
      console.error(error);
      this.investments = [];
    } finally {
      this.areInvestmentsLoading = false;
    }
  }

  *fetchSessionId() {
    try {
      this.sessionId = yield ReferenceDataApi.session.getSessionId(this.sessionId);
    } catch (error) {
      console.error(error);
      this.sessionId = '';
    }
  }

  setEventTypes(types: DropdownItemType[]) {
    this.eventTypes = types;
  }

  setTemplates(templates: DropdownItemType[]) {
    this.templates = templates;
  }

  setFundGroups(fundGroups: DropdownItemType<FundGroup>[]) {
    this.fundGroups = fundGroups;
  }

  setFundEntities(fundEntities: DropdownItemType[]) {
    this.fundEntities = fundEntities;
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

  setEntitiesLineItem(key: string, data: LineItemRow[], apply?: boolean) {
    if (!apply) {
      this.entitiesLineItem.set(key, data);
      return;
    }
    const entitiesLineItems = this.entitiesLineItem.get(key);
    const entityManualItems: LineItemRow[] = [];

    if (entitiesLineItems) {
      for (let i = 0; i < entitiesLineItems?.length; i++) {
        let checker = false;
        for (let j = 0; j < data.length; j++) {
          if (entitiesLineItems[i].id !== data[j].inheritedId) continue;
          checker = true;
        }
        if (!checker) {
          entityManualItems.push(entitiesLineItems[i]);
        }
      }
    }

    this.entitiesLineItem.set(key, [...data, ...entityManualItems]);
  }

  getUserInputs(cellKey: string): string[] {
    return this.userInputs.get(cellKey) || [];
  }

  addUserInput(cellKey: string, input: string) {
    const currentInputs = this.userInputs.get(cellKey) || [];
    if (!currentInputs.includes(input)) {
      this.userInputs.set(cellKey, [...currentInputs, input]);
    }
  }

  clearUserInputs(cellKey: string) {
    this.userInputs.delete(cellKey);
  }
}

export default CapEventSettingsStore;
