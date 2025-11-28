import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { BoxConnectorApi, CapEventPackageApi } from '@/api';
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
import { parseToPreviewScreenRows } from '@/utils/parseToPreviewScreenRows';
import type { PreviewScreenRow } from '@/app/preview-screen/types';
import { ToastApi } from '@/providers/types';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { ITEM_STATES } from '@/const/common';
import { UUID_V4_REGEX } from '@/const/regExps';
import { YesNoOptions } from '@/app/new/LineItems/const';
import { LineItemRow } from '@/app/new/LineItems/types';
import { getValidDate } from '@/utils/getValidDate';
import { isRowEmpty } from '@/utils/isRowEmpty';
import { uuidv4 } from '@/utils/uuid';
import { isLineItemRowValid } from '@/utils/investment';
import { getStoredSessionId } from '@/utils/sessionIdStorage';

class PreviewScreenStore {
  rows: PreviewScreenRow[] = [];
  isLoading = false;
  private inFlightProcess: Promise<PreviewScreenRow[]> | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  // ---------- Small formatting / mapping helpers ----------
  private formatDate(date: Date | null | undefined): string | undefined {
    if (!date) return undefined;
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  }

  private getSelectedSingle<T extends { state?: string }>(items: T[] | undefined): T | undefined {
    return (items ?? []).find((i) => i?.state === ITEM_STATES.SELECTED);
  }

  private getSelectedMany<T extends { state?: string }>(items: T[] | undefined): T[] {
    return (items ?? []).filter((i) => i?.state === ITEM_STATES.SELECTED);
  }

  private toApiType(
    src:
      | {
          id?: unknown;
          abbreviation?: string;
          name?: string;
          description?: string;
        }
      | undefined,
  ): ApiCapEventType | undefined {
    if (!src) return undefined;
    return this.pickNonEmpty<ApiCapEventType>({
      id: String(src.id ?? ''),
      abbreviation: src.abbreviation,
      name: src.name,
      description: src.description,
    }) as ApiCapEventType;
  }

  private toApiSponsor(src: { id?: unknown; name?: string } | undefined): ApiSponsor | undefined {
    if (!src) return undefined;
    return this.pickNonEmpty<ApiSponsor>({
      id: String(src.id ?? ''),
      name: src.name,
    }) as ApiSponsor;
  }

  private toApiFundGroup(
    src: { id?: unknown; name?: string } | undefined,
  ): ApiFundGroup | undefined {
    if (!src) return undefined;
    return this.pickNonEmpty<ApiFundGroup>({
      id: String(src.id ?? ''),
      name: src.name,
    }) as ApiFundGroup;
  }

  private toApiEntities(src: Array<{ id?: string; name?: string }> = []): ApiEntity[] {
    return src.map(
      (e) => this.pickNonEmpty<ApiEntity>({ id: String(e.id ?? ''), name: e.name }) as ApiEntity,
    );
  }

  private getTopNoticeDateString(selectedEntities: Array<{ label?: string }>): string | undefined {
    const top =
      entityDatesStore.noticeDate ||
      (selectedEntities.length
        ? entityDatesStore.getEntityNoticeDate(selectedEntities[0].label ?? '')
        : null);
    return this.formatDate(getValidDate(top));
  }

  private isEntityRowValid = (row: LineItemRow): boolean => {
    return isLineItemRowValid(row);
  };

  private pickNonEmpty<T extends Record<string, unknown>>(obj: T): Partial<T> {
    return Object.fromEntries(
      Object.entries(obj).filter(
        ([, v]) => v !== undefined && v !== null && !(typeof v === 'string' && v.trim() === ''),
      ),
    ) as Partial<T>;
  }

  private findAccountNoForRow(row: LineItemRow, accounts: RefAccount[]): string | undefined {
    // Relaxed matching for partially populated rows:
    // - Always require category match
    // - For other account fields, match only when the row provides a value
    const requiredCategory = row.capitalCategory ?? '';
    if (!requiredCategory) return undefined;

    const candidates = accounts.filter((a) => a.capitalCategory === requiredCategory);
    if (candidates.length === 0) return undefined;

    const fields: Array<keyof RefAccount> = [
      'callDistributionReason',
      'defaultDescription',
      'insideCommitment',
    ];

    // Score candidates by how many provided fields match; pick the best match
    let best: RefAccount | undefined;
    let bestScore = -1;
    for (const acc of candidates) {
      let score = 0;
      for (const f of fields) {
        const rowVal = (row as unknown as Record<string, unknown>)[f];
        if (rowVal !== undefined && rowVal !== null && rowVal !== '') {
          if ((acc as unknown as Record<string, unknown>)[f] === rowVal) score++;
        }
      }
      if (score > bestScore) {
        best = acc;
        bestScore = score;
      }
    }

    return best?.accountNo ?? candidates[0]?.accountNo ?? undefined;
  }

  private findInvestment(
    row: LineItemRow,
    investments: RefInvestment[],
  ): Partial<ApiInvestment> | undefined {
    const id = row.investment || '';
    if (!id) return undefined;
    const found = investments.find(
      (inv) => String(inv.name).toLowerCase() === String(id).toLowerCase(),
    );
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
      // insideCmnt is boolean in backend model; map "Yes"/"No" (case-insensitive) to true/false
      insideCmnt: (() => {
        if (typeof row.insideCommitment !== 'string') return undefined;
        const normalized = row.insideCommitment.trim().toLowerCase();
        if (normalized === 'yes') return true;
        if (normalized === 'no') return false;
        return undefined;
      })(),
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
    const fgRows = capEventSettingsStore.fundGroupsLineItem || [];
    const hasAtLeastOneValid = fgRows.some((r) => this.isEntityRowValid(r));
    for (const row of fgRows) {
      if (isRowEmpty(row)) continue;
      const base = this.mapLineItemBase(row, accounts, investments);
      if (!base) continue;
      const allowed = this.isEntityRowValid(row) || hasAtLeastOneValid;
      if (!allowed) continue;
      const uuid = this.ensureUuid(row.id);
      idMap.set(row.id, uuid);
      items.push({
        id: uuid,
        account: base.account,
        investment: base.investment ?? ('' as unknown as ApiInvestment),
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
      const entityRows: LineItemRow[] = capEventSettingsStore.entitiesLineItem.get(label) ?? [];

      const validNotice = getValidDate(entityDatesStore.getEntityNoticeDate(label));
      const validDue = getValidDate(entityDatesStore.getEntityDueDate(label));
      const datesAreValid = !!validNotice && !!validDue;
      const hasAtLeastOneValid = entityRows.some((r) => this.isEntityRowValid(r));
      if (!datesAreValid || !hasAtLeastOneValid) continue;

      const capEventLineItems: CapEventLineItem[] = [];
      const candidateRows: LineItemRow[] = entityRows.filter((r) => !isRowEmpty(r));
      for (const r of candidateRows) {
        const base = this.mapLineItemBase(r, accounts, investments);
        if (!base) continue;
        const allowed = this.isEntityRowValid(r) || hasAtLeastOneValid;
        if (!allowed) continue;
        const prDate = this.formatDate(getValidDate((r.prDate as Date) ?? validDue));
        const prFlag =
          (r.prFlag ?? '').toString().toLowerCase() === (YesNoOptions[0] || '').toLowerCase();
        const inheritedFundGroupLineItemId =
          r.inheritedFundGroupLineItemId && fundGroupIdMap.has(r.inheritedFundGroupLineItemId)
            ? fundGroupIdMap.get(r.inheritedFundGroupLineItemId)
            : undefined;
        const capEventLineItemId = this.ensureUuid((r as { id?: string }).id);
        capEventLineItems.push({
          id: capEventLineItemId,
          account: base.account,
          investment: base.investment ?? ('' as unknown as ApiInvestment),
          allocationBasis: base.allocationBasis,
          amount: base.amount,
          ...(inheritedFundGroupLineItemId ? { inheritedFundGroupLineItemId } : {}),
          prDate: prDate as string,
          prFlag,
        } as unknown as CapEventLineItem);
      }

      if (capEventLineItems.length === 0) continue;
      const entityItemId = this.ensureUuid(undefined);
      result.push({
        id: entityItemId,
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
    // Selected general settings (using helpers)
    const selectedTypeItem = this.getSelectedSingle(capEventSettingsStore.eventTypes);
    const selectedSponsorItem = this.getSelectedSingle(capEventSettingsStore.sponsors);
    const selectedFundGroupItem = this.getSelectedSingle(capEventSettingsStore.fundGroups);
    const selectedEntityItems = this.getSelectedMany(capEventSettingsStore.fundEntities) as Array<{
      id?: string;
      name?: string;
      label?: string;
    }>;

    if (
      !selectedTypeItem ||
      !selectedSponsorItem ||
      !selectedFundGroupItem ||
      selectedEntityItems.length === 0
    ) {
      return null;
    }

    const entities = this.toApiEntities(selectedEntityItems);
    const noticeDateStr = this.getTopNoticeDateString(selectedEntityItems);
    if (!noticeDateStr) return null;

    // Lookups
    const accounts: RefAccount[] = capEventSettingsStore.accounts;
    const investments: RefInvestment[] = capEventSettingsStore.investments;

    // Build line items via helpers
    const { items: capEventFundGroupLineItems, idMap: fundGroupIdMap } =
      this.buildFundGroupLineItems(accounts, investments);
    const capEventEntityLineItems = this.buildEntityLineItems(
      selectedEntityItems,
      accounts,
      investments,
      fundGroupIdMap,
    );

    if (capEventEntityLineItems.length === 0) {
      return null;
    }

    const totalAmount = this.computeTotalAmount(capEventEntityLineItems);

    const payload: CapEvent = {
      sponsor: this.toApiSponsor(selectedSponsorItem)!,
      capEventType: this.toApiType(selectedTypeItem)!,
      fundGroup: this.toApiFundGroup(selectedFundGroupItem)!,
      entities,
      noticeDate: noticeDateStr,
      status: 'DRAFT' as unknown as CapEvent['status'],
      ...(capEventFundGroupLineItems.length ? { capEventFundGroupLineItems } : {}),
      capEventEntityLineItems,
      ...(capEventSettingsStore.comment?.trim()
        ? { comment: capEventSettingsStore.comment.trim() }
        : {}),
      totalAmount,
    };

    return payload;
  }

  private ensureUuid(value: string | undefined): string {
    if (value && UUID_V4_REGEX.test(value)) return value;

    return uuidv4();
  }

  async processPayload(toast?: ToastApi): Promise<PreviewScreenRow[]> {
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

        const sessionId = getStoredSessionId() ?? '';
        this.isLoading = true;
        this.rows = [];
        const response = await CapEventPackageApi.default.process(sessionId, requestPayload);
        const parsed = parseToPreviewScreenRows(response);
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

export const previewScreenStore = new PreviewScreenStore();
