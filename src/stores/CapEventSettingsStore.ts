import { makeAutoObservable } from 'mobx';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { Attachment } from '@/app/new/attachments/types';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ITEM_STATES } from '@/const/common';
import { Account, FundGroup, Investment } from '@/clients/ReferenceData';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { ReferenceDataApi } from '@/api';
import {
  AccountFields,
  investmentMandatoryCategories,
  LineItemTypes,
  USER_PROVIDED_OPTION,
} from '@/app/new/LineItems/const';

const selectedFilterCallback = (item: DropdownItemType) => item.state === ITEM_STATES.SELECTED;

class CapEventSettingsStore {
  // General settings
  eventTypes: DropdownItemType[] = [];
  templates: DropdownItemType[] = [];
  fundGroups: DropdownItemType<FundGroup>[] = [];
  fundEntities: DropdownItemType[] = [];
  noticeDate: Date | null = null;
  isEntitiesDropdownOpen: boolean = false;
  isNoticeDateValid: boolean = true;
  entitiesSelectedCountSnapshot: number | null = null;

  attachments: Attachment[] = [];

  // Line Items
  fundGroupsLineItem: LineItemRow[] = [prepareNewRow(LineItemTypes.group)];
  fundGroupsStateAfterApply: LineItemRow[] = [prepareNewRow(LineItemTypes.group)];
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

  isGeneralSettingsEmpty(
    noticeDate?: Date | null,
    hasDifferentDates?: boolean,
    entitiesToCheck?: DropdownItemType[],
  ) {
    const selectedEventTypes = this.eventTypes.filter(selectedFilterCallback);
    const selectedTemplates = this.templates.filter(selectedFilterCallback);
    const selectedFundGroups = this.fundGroups.filter(selectedFilterCallback);
    const selectedFunds = (entitiesToCheck ?? this.fundEntities).filter(selectedFilterCallback);
    const selectedFundsCountEffective = this.entitiesSelectedCountSnapshot ?? selectedFunds.length;

    const effectiveNoticeDate = noticeDate ?? null;
    const effectiveHasDifferentDates = hasDifferentDates ?? false;

    return (
      selectedEventTypes.length === 0 ||
      selectedTemplates.length === 0 ||
      selectedFundGroups.length === 0 ||
      selectedFundsCountEffective === 0 ||
      (effectiveNoticeDate === null && !effectiveHasDifferentDates)
    );
  }

  get isFundGroupLineItemsFilled() {
    return (
      !!this.fundGroupsLineItem.length &&
      this.fundGroupsLineItem.every((item) =>
        Object.entries(item).every(([key, value]) => {
          if (
            key === AccountFields.investment &&
            !investmentMandatoryCategories.includes(item.capitalCategory ?? '')
          ) {
            return true;
          }

          if (key === AccountFields.amount && item.allocationBasis === USER_PROVIDED_OPTION) {
            return true;
          }

          return value !== null && value !== undefined && value !== '' && value !== 0;
        }),
      )
    );
  }

  get isFundGroupLineItemsChanged() {
    const { fundGroupsLineItem, fundGroupsStateAfterApply } = this;

    return (
      fundGroupsLineItem.length !== fundGroupsStateAfterApply.length ||
      fundGroupsLineItem.some((item, index) => {
        const stateItem = fundGroupsStateAfterApply[index];
        const amountCheckBasedOnBasis =
          item.allocationBasis === USER_PROVIDED_OPTION ? false : item.amount !== stateItem.amount;
        return (
          !stateItem ||
          amountCheckBasedOnBasis ||
          item.investment !== stateItem.investment ||
          item.allocationBasis !== stateItem.allocationBasis ||
          item.capitalCategory !== stateItem.capitalCategory ||
          item.defaultDescription !== stateItem.defaultDescription ||
          item.callDistributionReason !== stateItem.callDistributionReason
        );
      })
    );
  }

  get hasMultipleEntitiesChosen() {
    const effectiveSelectedCount =
      this.entitiesSelectedCountSnapshot ?? this.fundEntities.filter(selectedFilterCallback).length;
    return effectiveSelectedCount > 1;
  }

  *fetchAccounts() {
    try {
      this.accounts = yield ReferenceDataApi.accounts.getAccounts(
        'Golden Image DEV',
        ['Capital'],
        ['Cont - Management fees'],
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

  setFundGroupsStateAfterApply() {
    this.fundGroupsStateAfterApply = this.fundGroupsLineItem.map((item) => ({ ...item }));
  }

  setFundEntities(fundEntities: DropdownItemType[]) {
    this.fundEntities = fundEntities;
  }

  setNoticeDate(date: Date) {
    this.noticeDate = date;
  }

  setIsNoticeDateValid(value: boolean) {
    this.isNoticeDateValid = value;
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

  setEntitiesSelectedCountSnapshot(value: number | null) {
    this.entitiesSelectedCountSnapshot = value;
  }

  applyEntitiesSelectionConfirmed() {
    const selectedEntities = this.fundEntities.filter(selectedFilterCallback);
    const selectedCount = selectedEntities.length;
    const selectedLabels = new Set<string>(selectedEntities.map((e) => e.label ?? ''));

    for (const key of Array.from(this.entitiesLineItem.keys())) {
      if (!selectedLabels.has(key)) {
        this.entitiesLineItem.delete(key);
      }
    }

    if (selectedCount <= 1) {
      this.fundGroupsLineItem = [prepareNewRow(LineItemTypes.group)];
      this.fundGroupsStateAfterApply = [prepareNewRow(LineItemTypes.group)];
      // Remove inherited rows for each entity; keep only manual rows (no inheritedId).
      // If an entity has no manual rows, preserve a single fresh row for UX consistency.
      for (const [entityLabel, rows] of this.entitiesLineItem.entries()) {
        const manualRows = (rows ?? []).filter((item) => !item.inheritedId);
        if (manualRows.length > 0) {
          this.entitiesLineItem.set(entityLabel, manualRows);
        } else {
          this.entitiesLineItem.set(entityLabel, [prepareNewRow(LineItemTypes.entity)]);
        }
      }
    }
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
        if (!entitiesLineItems[i].inheritedId) {
          entityManualItems.push(entitiesLineItems[i]);
        }
      }
    }

    this.entitiesLineItem.set(key, [...data, ...entityManualItems]);
  }

  resetOnFundGroupChange() {
    this.fundGroupsLineItem = [prepareNewRow(LineItemTypes.group)];
    this.fundGroupsStateAfterApply = [prepareNewRow(LineItemTypes.group)];
    this.entitiesLineItem.clear();
  }

  getUserInputs(cellKey: string): string[] {
    return this.userInputs.get(cellKey) ?? [];
  }

  addUserInput(cellKey: string, input: string) {
    const currentInputs = this.userInputs.get(cellKey) ?? [];
    if (!currentInputs.includes(input)) {
      this.userInputs.set(cellKey, [...currentInputs, input]);
    }
  }

  clearUserInputs(cellKey: string) {
    this.userInputs.delete(cellKey);
  }

  updateEntityLineItemPRDate(entityLabel: string, date: Date) {
    const entityLineItems = this.entitiesLineItem.get(entityLabel);

    if (entityLineItems) {
      // Update prDate for all line items of this entity
      const updatedLineItems = entityLineItems.map((item) => ({
        ...item,
        prDate: date,
      }));

      this.entitiesLineItem.set(entityLabel, updatedLineItems);
    }
  }
}

export default CapEventSettingsStore;
