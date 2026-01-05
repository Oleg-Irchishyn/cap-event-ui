import { makeAutoObservable, toJS } from 'mobx';
import { DropdownItemType } from '@/app/components/Dropdown/Dropdown';
import { Attachment } from '@/app/new/attachments/types';
import type { AttachmentType, DragNDropError } from '@/app/new/attachments/types';
import { LineItemRow } from '@/app/new/LineItems/types';
import { ITEM_STATES } from '@/const/common';
import { Account, AllocationBasis, Entity, FundGroup, Investment } from '@/clients/ReferenceData';
import { prepareNewRow } from '@/utils/prepareNewRow';
import { CapEventPackageApi, ReferenceDataApi } from '@/api';
import { LineItemTypes, USER_PROVIDED_OPTION } from '@/app/new/LineItems/const';
import { InvestorEntry, MgmtFeeJournalEntry } from '@/clients/CapEventPackage';
import { FootnoteRecordType } from '@/app/new/FootnotesModal/types';
import { isFundGroupRowValid } from '@/utils/investment';
import { getStoredSessionId } from '@/utils/sessionIdStorage';
import { showErrorToast } from '@/utils/showErrorToast';
import RootStore from '@/stores/RootStore';
import { isRowEmpty } from '@/utils/isRowEmpty';
import {
  ADDENDUMS_ATTACHMENT_TYPE,
  ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE,
  COVER_PAGES_ATTACHMENT_TYPE,
} from '@/const/attachments';

const selectedFilterCallback = (item: DropdownItemType) => item.state === ITEM_STATES.SELECTED;

class CapEventSettingsStore {
  initialStateSnapshot: unknown = null;

  root: RootStore;

  // General settings
  eventTypes: DropdownItemType[] = [];
  sponsors: DropdownItemType[] = [];
  fundGroups: DropdownItemType<FundGroup>[] = [];
  fundEntities: DropdownItemType<Entity>[] = [];
  noticeDate: Date | null = null;
  isEntitiesDropdownOpen: boolean = false;
  isNoticeDateValid: boolean = true;
  entitiesSelectedCountSnapshot: number | null = null;

  attachments = new Map<AttachmentType, Attachment[]>([
    [COVER_PAGES_ATTACHMENT_TYPE, [] as Attachment[]],
    [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
    [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
  ]);

  // Line Items
  fundGroupsLineItem: LineItemRow[] = [prepareNewRow(LineItemTypes.group)];
  fundGroupsStateAfterApply: LineItemRow[] = [prepareNewRow(LineItemTypes.group)];
  entitiesLineItem = new Map<string, LineItemRow[]>();
  otherEntitiesLineItem = new Map<string, LineItemRow[]>();
  accounts: Account[] = [];
  otherTableAccounts: Account[] = [];
  allocationBasis: AllocationBasis[] = [];
  investments: Investment[] = [];
  areInvestmentsLoading: boolean = false;
  // user inputs in line item table dropdown
  userInputs = new Map<string, string[]>(); // Key: cellKey (rowId-columnId), Value: array of user inputs

  // Allocation Preview
  isAllocationPreviewModalLoading: boolean = false;
  isAllocationPreviewModalOpen: boolean = false;
  attachmentErrors: DragNDropError[] = [];
  allocationPreviewModaLineItemId: string = '';
  allocationPreviewModalData: InvestorEntry[] = [];
  allocationPreviewModalTitle: string = '';

  footnotes: FootnoteRecordType[] = [];
  comment: string = '';

  mgmtJournalEntries: Record<string, MgmtFeeJournalEntry[]> = {};
  selectedMFItemBatchNo: Record<string, number | null> = {};
  includeMFOption: Record<string, 'Yes' | 'No'> = {};

  constructor(root: RootStore) {
    this.root = root;

    makeAutoObservable(this);
  }

  collectFields() {
    return {
      eventTypes: this.eventTypes,
      sponsors: this.sponsors,
      fundGroups: this.fundGroups,
      fundEntities: this.fundEntities,
      noticeDate: this.noticeDate,
      isEntitiesDropdownOpen: this.isEntitiesDropdownOpen,
      isNoticeDateValid: this.isNoticeDateValid,
      entitiesSelectedCountSnapshot: this.entitiesSelectedCountSnapshot,
      attachments: this.attachments,
      fundGroupsLineItem: this.fundGroupsLineItem,
      fundGroupsStateAfterApply: this.fundGroupsStateAfterApply,
      entitiesLineItem: this.entitiesLineItem,
      otherEntitiesLineItem: this.otherEntitiesLineItem,
      accounts: this.accounts,
      otherTableAccounts: this.otherTableAccounts,
      investments: this.investments,
      areInvestmentsLoading: this.areInvestmentsLoading,
      userInputs: this.userInputs,
      isAllocationPreviewModalLoading: this.isAllocationPreviewModalLoading,
      isAllocationPreviewModalOpen: this.isAllocationPreviewModalOpen,
      attachmentErrors: this.attachmentErrors,
      allocationPreviewModalEntityId: this.allocationPreviewModaLineItemId,
      allocationPreviewModalData: this.allocationPreviewModalData,
      allocationPreviewModalTitle: this.allocationPreviewModalTitle,
      footnotes: this.footnotes,
      comment: this.comment,
      mgmtJournalEntries: this.mgmtJournalEntries,
      selectedMFItemBatchNo: this.selectedMFItemBatchNo,
      includeMFOption: this.includeMFOption,
    };
  }

  setInitialStateSnapshot() {
    const snap = toJS(this.collectFields());

    this.initialStateSnapshot = snap;
  }

  resetMfState() {
    this.selectedMFItemBatchNo = {};
    this.includeMFOption = {};
  }

  cancelChanges() {
    if (!this.initialStateSnapshot) return;

    Object.assign(this, toJS(this.initialStateSnapshot));
  }

  *initAccountsSet(sponsorId: string) {
    this.accounts = yield this.fetchAccounts(sponsorId, ['Capital']);
  }

  setOtherTableAccounts(accounts: Account[]) {
    this.otherTableAccounts = accounts;
  }

  *fetchAllocationBasis() {
    try {
      const sessionId = getStoredSessionId() ?? '';
      this.allocationBasis = yield ReferenceDataApi.allocationBases.getAllocationBases(sessionId);
    } catch (error) {
      showErrorToast(error);
      console.error(error);
      this.allocationBasis = [];
    }
  }

  *fetchMgmtJournalEntries(entityIds: string[]) {
    const sessionId = getStoredSessionId() ?? '';
    this.mgmtJournalEntries = yield CapEventPackageApi.default.getMgmtFeeJournalEntries(
      entityIds,
      sessionId,
    );
  }

  isGeneralSettingsEmpty(
    noticeDate?: Date | null,
    hasDifferentDates?: boolean,
    entitiesToCheck?: DropdownItemType[],
  ) {
    const selectedEventTypes = this.eventTypes.filter(selectedFilterCallback);
    const selectedSponsors = this.sponsors.filter(selectedFilterCallback);
    const selectedFundGroups = this.fundGroups.filter(selectedFilterCallback);
    const selectedFunds = (entitiesToCheck ?? this.fundEntities).filter(selectedFilterCallback);
    const selectedFundsCountEffective = this.entitiesSelectedCountSnapshot ?? selectedFunds.length;

    const effectiveNoticeDate = noticeDate ?? null;
    const effectiveHasDifferentDates = hasDifferentDates ?? false;

    return (
      selectedEventTypes.length === 0 ||
      selectedSponsors.length === 0 ||
      selectedFundGroups.length === 0 ||
      selectedFundsCountEffective === 0 ||
      (effectiveNoticeDate === null && !effectiveHasDifferentDates)
    );
  }

  get isFundGroupLineItemsFilled() {
    return (
      !!this.fundGroupsLineItem.length &&
      this.fundGroupsLineItem.every((row) => isFundGroupRowValid(row, USER_PROVIDED_OPTION))
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
          item.investment.id !== stateItem.investment.id ||
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

  get hasAttachmentErrors() {
    return this.attachmentErrors.length > 0;
  }

  get customEntityDescription() {
    const groupDescriptions = this.fundGroupsLineItem.map((item) => item.defaultDescription);
    const entityDescriptions = Array.from(this.entitiesLineItem.values())
      .flat()
      .map((item) => item.defaultDescription);

    const allDescriptions = [...entityDescriptions, ...groupDescriptions].filter(
      Boolean,
    ) as string[];

    return Array.from(new Set(allDescriptions)).sort((a, b) => a.localeCompare(b));
  }

  async fetchAccounts(
    sponsorId: string,
    fsGroupings: string[] = [],
    capitalCategories: string[] = [],
  ) {
    try {
      const sessionId = getStoredSessionId();
      const accounts: Account[] = await ReferenceDataApi.accounts.getAccounts(
        sponsorId,
        fsGroupings,
        capitalCategories,
        sessionId,
      );
      return accounts;
    } catch (error) {
      showErrorToast(error);
      console.error(error);
      return [];
    }
  }

  *fetchInvestments() {
    try {
      const sessionId = getStoredSessionId() ?? '';
      this.areInvestmentsLoading = true;
      this.investments = yield ReferenceDataApi.investments.getInvestments(sessionId);
    } catch (error) {
      showErrorToast(error);
      console.error(error);
      this.investments = [];
    } finally {
      this.areInvestmentsLoading = false;
    }
  }

  setEventTypes(types: DropdownItemType[]) {
    this.eventTypes = types;
  }

  setSponsors(sponsors: DropdownItemType[]) {
    this.sponsors = sponsors;
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

  setAttachments(areaId: AttachmentType, attachments: Attachment[]) {
    this.attachments.set(areaId, attachments);
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
    const selectedIds = new Set<string>(selectedEntities.map((e) => e.id ?? ''));
    const selectedLabels = new Set<string>(selectedEntities.map((e) => e.label ?? ''));

    const mfKeys = new Set([
      ...Object.keys(this.selectedMFItemBatchNo),
      ...Object.keys(this.includeMFOption),
    ]);
    for (const entityId of mfKeys) {
      if (!selectedIds.has(entityId)) {
        delete this.selectedMFItemBatchNo[entityId];
        delete this.includeMFOption[entityId];
      }
    }

    for (const key of Array.from(this.entitiesLineItem.keys())) {
      if (!selectedLabels.has(key)) {
        this.entitiesLineItem.delete(key);
      }
    }

    if (selectedCount <= 1) {
      this.fundGroupsLineItem = [prepareNewRow(LineItemTypes.group)];
      this.fundGroupsStateAfterApply = [prepareNewRow(LineItemTypes.group)];
      // Remove inherited rows for each entity; keep only manual rows (no fundGroupLineItemInheritanceId).
      // If an entity has no manual rows, preserve a single fresh row for UX consistency.
      for (const [entityLabel, rows] of this.entitiesLineItem.entries()) {
        const manualRows = (rows ?? []).filter((item) => !item.fundGroupLineItemInheritanceId);
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
        if (
          !entitiesLineItems[i].fundGroupLineItemInheritanceId &&
          !isRowEmpty(entitiesLineItems[i])
        ) {
          entityManualItems.push(entitiesLineItems[i]);
        }
      }
    }

    this.entitiesLineItem.set(key, [...data, ...entityManualItems]);
  }

  setOtherEntitiesLineItems(key: string, data: LineItemRow[]) {
    this.otherEntitiesLineItem.set(key, data);
  }

  resetOnFundGroupChange() {
    this.fundGroupsLineItem = [prepareNewRow(LineItemTypes.group)];
    this.fundGroupsStateAfterApply = [prepareNewRow(LineItemTypes.group)];
    this.entitiesLineItem.clear();
    this.otherEntitiesLineItem.clear();
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

  setAllocationPreviewOpen(isOpen: boolean) {
    this.isAllocationPreviewModalOpen = isOpen;
  }

  setAllocationPreviewModalLineItemId(id: string) {
    this.allocationPreviewModaLineItemId = id;
  }

  setAllocationPreviewModalTitle(title: string) {
    this.allocationPreviewModalTitle = title;
  }

  setAllocationPreviewModalData(data: InvestorEntry[]) {
    this.allocationPreviewModalData = data;
  }

  setFootnotes(data: FootnoteRecordType[]) {
    this.footnotes = data;
  }

  setAttachmentErrors(errors: DragNDropError[]) {
    this.attachmentErrors = errors;
  }

  setComment(value: string) {
    this.comment = value ?? '';
  }

  setSelectedMFItemBatchNo(entityId: string, batchNo: number | null) {
    this.selectedMFItemBatchNo[entityId] = batchNo;
  }

  getSelectedMFItemBatchNo(entityId: string): number | null {
    return this.selectedMFItemBatchNo[entityId] ?? null;
  }

  setIncludeMFOption(entityId: string, option: 'Yes' | 'No') {
    this.includeMFOption[entityId] = option;
  }

  getIncludeMFOption(entityId: string): 'Yes' | 'No' {
    return this.includeMFOption[entityId] ?? 'No';
  }

  // Reset general selections with Entities and Fund Group CELIs
  resetStore() {
    this.eventTypes = this.eventTypes.map((e) => ({ ...e, state: ITEM_STATES.OPTIONAL }));
    this.sponsors = this.sponsors.map((e) => ({ ...e, state: ITEM_STATES.OPTIONAL }));
    this.fundGroups = this.fundGroups.map((fg) => ({ ...fg, state: ITEM_STATES.OPTIONAL }));
    this.fundEntities = this.fundEntities.map((e) => ({ ...e, state: ITEM_STATES.OPTIONAL }));
    this.entitiesSelectedCountSnapshot = null;
    this.noticeDate = null;
    this.isNoticeDateValid = true;
    this.attachments = new Map([
      [COVER_PAGES_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDENDUMS_ATTACHMENT_TYPE, [] as Attachment[]],
      [ADDITIONAL_SUPPORTIVE_FILES_ATTACHMENT_TYPE, [] as Attachment[]],
    ]);
    this.attachmentErrors = [];
    this.comment = '';
    this.entitiesLineItem = new Map();
    this.fundGroupsLineItem = [prepareNewRow(LineItemTypes.group)];
    this.fundGroupsStateAfterApply = [prepareNewRow(LineItemTypes.group)];
    this.selectedMFItemBatchNo = {};
    this.includeMFOption = {};
  }
}

export default CapEventSettingsStore;
