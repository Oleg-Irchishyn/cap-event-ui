import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { CapEventPackageApi, BoxConnectorApi } from '@/api';
import {
  CapEvent,
  CapEventEntityLineItem,
  CapEventFundGroupLineItem,
  CapEventLineItem,
  Investment as ApiInvestment,
  Account as ApiAccount,
  Entity as ApiEntity,
  Sponsor as ApiSponsor,
  FundGroup as ApiFundGroup,
  CapEventType as ApiCapEventType,
} from '@/clients/CapEventPackage';
import { Account as RefAccount, Investment as RefInvestment } from '@/clients/ReferenceData';
import { parseToDistributionRows } from '@/utils/parseToDistributionRows';
import type { DistributionRow } from '@/app/allocation-distribution/types';
import { ToastApi } from '@/providers/types';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { ITEM_STATES } from '@/const/common';
import {
  NORMALIZE_DASHES_REGEX,
  NORMALIZE_SPACES_REGEX,
  UUID_TEMPLATE_CHAR_REGEX,
  UUID_V4_REGEX,
  UUID_V4_TEMPLATE,
} from '@/const/regExps';
import { investmentMandatoryCategories, YesNoOptions } from '@/app/new/LineItems/const';
import { LineItemRow } from '@/app/new/LineItems/types';
import { getValidDate } from '@/utils/getValidDate';

class AllocationDistributionStore {
  rows: DistributionRow[] = [];
  isLoading = false;
  private inFlightProcess: Promise<DistributionRow[]> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  private formatDate(date: Date | null | undefined): string | undefined {
    if (!date) return undefined;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private isEntityRowValid = (row: LineItemRow): boolean => {
    const normalize = (v?: string) =>
      (v ?? '')
        .replace(NORMALIZE_DASHES_REGEX, '-')
        .replace(NORMALIZE_SPACES_REGEX, ' ')
        .trim()
        .toLowerCase();
    const normalizedMandatory = investmentMandatoryCategories.map((c) => normalize(c));
    const isInvestmentRequired = normalizedMandatory.includes(normalize(row.capitalCategory));
    const hasRequiredBaseFields =
      !!row.capitalCategory &&
      !!row.callDistributionReason &&
      !!row.defaultDescription &&
      !!row.insideCommitment &&
      !!row.allocationBasis;
    const hasValidAmount = row.amount !== null && row.amount !== undefined && row.amount !== 0;
    const hasValidInvestment = !isInvestmentRequired || !!row.investment;
    return hasRequiredBaseFields && hasValidAmount && hasValidInvestment;
  };

  private pickNonEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === ''),
      ),
    ) as Partial<T>;
  }

  private findAccountNoForRow(row: LineItemRow, accounts: RefAccount[]): string | undefined {
    const matches = accounts.filter(
      (a) =>
        a.capitalCategory === row.capitalCategory &&
        a.callDistributionReason === row.callDistributionReason &&
        a.defaultDescription === row.defaultDescription &&
        a.insideCommitment === row.insideCommitment,
    );
    return matches[0]?.accountNo ?? undefined;
  }

  private findInvestment(
    row: LineItemRow,
    investments: RefInvestment[],
  ): Partial<ApiInvestment> | undefined {
    const id = row.investment || '';
    if (!id) return undefined;
    const found = investments.find((inv) => String(inv.id) === String(id));
    if (!found) return { id };
    return this.pickNonEmpty<ApiInvestment>({
      id: String(found.id),
      name: found.name,
      title: found.title,
      type: found.type,
    });
  }

  private mapLineItemBase(
    row: LineItemRow,
    accounts: RefAccount[],
    investments: RefInvestment[],
  ):
    | {
        account: ApiAccount;
        investment?: ApiInvestment;
        allocationBasis: string;
        amount: number;
      }
    | undefined {
    const accountNo = this.findAccountNoForRow(row, accounts);
    if (!accountNo) return undefined;
    const optionalAccountFields = this.pickNonEmpty<Partial<ApiAccount>>({
      category: row.capitalCategory,
      reason: row.callDistributionReason,
      description: row.defaultDescription,
      insideCmnt: row.insideCommitment,
    });
    const account = { accountNo, ...optionalAccountFields } as ApiAccount;
    const investment = this.findInvestment(row, investments) as ApiInvestment | undefined;
    const allocationBasis = row.allocationBasis;
    const amount = row.amount;
    return { account, investment, allocationBasis, amount };
  }

  // Helper: build fund-group CELIs and originalId -> uuid map
  private buildFundGroupLineItems(
    accounts: RefAccount[],
    investments: RefInvestment[],
  ): { items: CapEventFundGroupLineItem[]; idMap: Map<string, string> } {
    const idMap = new Map<string, string>();
    const items: CapEventFundGroupLineItem[] = [];
    for (const row of capEventSettingsStore.fundGroupsLineItem) {
      if (!this.isEntityRowValid(row)) continue;
      const base = this.mapLineItemBase(row, accounts, investments);
      if (!base) continue;
      const uuid = this.ensureUuid(row.id);
      idMap.set(row.id, uuid);
      items.push({
        id: uuid,
        account: base.account,
        ...(base.investment ? { investment: base.investment } : {}),
        allocationBasis: base.allocationBasis,
        amount: base.amount,
      } as unknown as CapEventFundGroupLineItem);
    }
    return { items, idMap };
  }

  // Helper: build entity CELIs using selected entities and FG id map
  private buildEntityLineItems(
    selectedEntities: Array<{ id?: string; name?: string; label?: string }>,
    accounts: RefAccount[],
    investments: RefInvestment[],
    fundGroupIdMap: Map<string, string>,
  ): CapEventEntityLineItem[] {
    const result: CapEventEntityLineItem[] = [];
    for (const ent of selectedEntities) {
      const label = (ent as { label?: string }).label ?? '';
      const entityRows = capEventSettingsStore.entitiesLineItem.get(label) ?? [];

      const validNotice = getValidDate(entityDatesStore.getEntityNoticeDate(label));
      const validDue = getValidDate(entityDatesStore.getEntityDueDate(label));
      const dueValid = entityDatesStore.getEntityDueDateInputValidity(label);
      const noticeValid = entityDatesStore.getEntityNoticeDateInputValidity(label);
      const datesAreValid = !!validNotice && !!validDue && dueValid && noticeValid;
      const validRows = entityRows.filter((r) => this.isEntityRowValid(r));
      if (!datesAreValid || validRows.length === 0) continue;

      const capEventLineItems: CapEventLineItem[] = [];
      for (const r of validRows) {
        const base = this.mapLineItemBase(r, accounts, investments);
        if (!base) continue;
        const prDate = this.formatDate(getValidDate((r.prDate as Date) ?? validDue));
        const prFlag =
          (r.prFlag ?? '').toString().toLowerCase() === (YesNoOptions[0] || '').toLowerCase();
        const fundGroupLineItemId =
          r.inheritedId && fundGroupIdMap.has(r.inheritedId)
            ? fundGroupIdMap.get(r.inheritedId)
            : undefined;
        capEventLineItems.push({
          account: base.account,
          ...(base.investment ? { investment: base.investment } : {}),
          allocationBasis: base.allocationBasis,
          amount: base.amount,
          ...(fundGroupLineItemId ? { fundGroupLineItemId } : {}),
          prDate: prDate as string,
          prFlag,
        } as unknown as CapEventLineItem);
      }

      if (capEventLineItems.length === 0) continue;
      result.push({
        entity: this.pickNonEmpty<ApiEntity>({
          id: String(ent.id ?? ''),
          name: ent.name,
        }) as ApiEntity,
        noticeDate: this.formatDate(validNotice) as string,
        dueDate: this.formatDate(validDue) as string,
        capEventLineItems,
      });
    }
    return result;
  }

  // Helper: compute total amount from entity CELIs
  private computeTotalAmount(entityItems: CapEventEntityLineItem[]): number {
    return entityItems
      .flatMap((e) => e.capEventLineItems)
      .reduce((sum, li) => sum + (li.amount ?? 0), 0);
  }

  private buildPayload(): CapEvent | null {
    // Selected general settings
    const selectedTypeItem = capEventSettingsStore.eventTypes.find(
      (i) => i.state === ITEM_STATES.SELECTED,
    ) as unknown as ApiCapEventType | undefined;
    const selectedSponsorItem = capEventSettingsStore.sponsors.find(
      (i) => i.state === ITEM_STATES.SELECTED,
    ) as unknown as ApiSponsor | undefined;
    const selectedFundGroupItem = capEventSettingsStore.fundGroups.find(
      (i) => i.state === ITEM_STATES.SELECTED,
    ) as unknown as ApiFundGroup | undefined;
    const selectedEntityItems = capEventSettingsStore.fundEntities.filter(
      (i) => i.state === ITEM_STATES.SELECTED,
    ) as unknown as (ApiEntity & { label?: string })[];

    if (
      !selectedTypeItem ||
      !selectedSponsorItem ||
      !selectedFundGroupItem ||
      selectedEntityItems.length === 0
    ) {
      return null;
    }

    const entities: ApiEntity[] = selectedEntityItems.map((e) =>
      this.pickNonEmpty<ApiEntity>({ id: e.id, name: e.name }),
    ) as ApiEntity[];

    const topNoticeDate =
      entityDatesStore.noticeDate ||
      (selectedEntityItems.length
        ? entityDatesStore.getEntityNoticeDate(selectedEntityItems[0].label ?? '')
        : null);

    const noticeDateStr = this.formatDate(getValidDate(topNoticeDate));
    if (!noticeDateStr) return null;

    // Lookups
    const accounts: RefAccount[] = capEventSettingsStore.accounts;
    const investments: RefInvestment[] = capEventSettingsStore.investments;

    // Build line items via helpers
    const { items: capEventFundGroupLineItems, idMap: fundGroupIdMap } =
      this.buildFundGroupLineItems(accounts, investments);
    const capEventEntityLineItems = this.buildEntityLineItems(
      selectedEntityItems as Array<{ id?: string; name?: string; label?: string }>,
      accounts,
      investments,
      fundGroupIdMap,
    );

    if (capEventEntityLineItems.length === 0) {
      return null;
    }

    const totalAmount = this.computeTotalAmount(capEventEntityLineItems);

    const sponsorSource = selectedSponsorItem as unknown as { id?: string; name?: string };
    const typeSource = selectedTypeItem as unknown as {
      id?: string;
      abbreviation?: string;
      name?: string;
      description?: string;
    };
    const fundGroupSource = selectedFundGroupItem as unknown as { id?: string; name?: string };

    const payload: CapEvent = {
      sponsor: { id: String(sponsorSource.id ?? ''), name: sponsorSource.name },
      capEventType: this.pickNonEmpty<ApiCapEventType>({
        id: String(typeSource.id ?? ''),
        abbreviation: typeSource.abbreviation,
        name: typeSource.name,
        description: typeSource.description,
      }) as ApiCapEventType,
      fundGroup: { id: String(fundGroupSource.id ?? ''), name: fundGroupSource.name },
      entities,
      noticeDate: noticeDateStr,
      ...(capEventFundGroupLineItems.length ? { capEventFundGroupLineItems } : {}),
      capEventEntityLineItems,
      totalAmount,
    };

    return payload;
  }

  private ensureUuid(value: string | undefined): string {
    if (value && UUID_V4_REGEX.test(value)) return value;
    // naive v4 generator
    return UUID_V4_TEMPLATE.replace(UUID_TEMPLATE_CHAR_REGEX, (c) => {
      const r = (Math.random() * 16) | 0;
      const v = c === 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  async processPayload(toast?: ToastApi): Promise<DistributionRow[]> {
    if (this.inFlightProcess) {
      return this.inFlightProcess;
    }
    this.inFlightProcess = (async () => {
      try {
        const requestPayload = this.buildPayload();
        if (!requestPayload) {
          toast?.error?.('Not enough valid data');
          return [];
        }

        this.isLoading = true;
        this.rows = [];
        const response = await CapEventPackageApi.default.process(requestPayload);
        const parsed = parseToDistributionRows(response);
        this.rows = parsed;
        return parsed;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Processing failed. Please try again.';
        toast?.error?.(message);
        this.rows = [];
        return [];
      } finally {
        this.isLoading = false;
        this.inFlightProcess = null;
      }
    })();
    return this.inFlightProcess;
  }

  async fetchDoc(ceBoxFileId: string, toast?: ToastApi): Promise<Blob | undefined> {
    try {
      if (!ceBoxFileId) return;
      const base = BoxConnectorApi.request.config.BASE ?? '';
      const url = `${base}/files/${encodeURIComponent(ceBoxFileId)}/content`;
      const resp = await axios.get(url, {
        responseType: 'blob',
        headers: { Accept: 'application/octet-stream' },
        withCredentials: BoxConnectorApi.request.config.WITH_CREDENTIALS ?? false,
      });
      return resp.data as Blob;
    } catch {
      toast?.error?.('Failed to fetch Box file content');
      return;
    }
  }
}

export const allocationDistributionStore = new AllocationDistributionStore();
