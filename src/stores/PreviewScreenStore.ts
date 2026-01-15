import { makeAutoObservable, runInAction } from 'mobx';

import { CapEventPackageApi } from '@/api';
import axios from 'axios';
import {
  CapEvent,
  CapEventEntityLineItem,
  CapEventFundGroupLineItem,
  CapEventLineItem,
  CapEventType as ApiCapEventType,
  CapEventAggregatedLineItem,
  InvestorDocumentInput,
} from '@/clients/CapEventPackage';
import { LineItemBase } from '@/clients/CapEventPackage';
import { Account as RefAccount, Investment as RefInvestment } from '@/clients/ReferenceData';
import { parseToPreviewScreenRows } from '@/utils/parseToPreviewScreenRows';
import type { PreviewScreenRow } from '@/app/preview-screen/types';
import { ToastApi } from '@/providers/types';
import { ITEM_STATES } from '@/const/common';
import { UUID_V4_REGEX } from '@/const/regExps';
import { YesNoOptions } from '@/app/new/LineItems/const';
import { LineItemRow } from '@/app/new/LineItems/types';
import { getValidDate } from '@/utils/getValidDate';
import { isRowEmpty } from '@/utils/isRowEmpty';
import { uuidv4 } from '@/utils/uuid';
import { isLineItemRowValid } from '@/utils/investment';
import { getStoredSessionId } from '@/utils/sessionIdStorage';
import RootStore from '@/stores/RootStore';

// Local API type aliases derived from generated client models
type ApiAccount = LineItemBase['account'];
type ApiInvestment = NonNullable<LineItemBase['investment']>;
type ApiEntity = CapEventEntityLineItem['entity'];
type ApiSponsor = { id?: string; name?: string };
type ApiFundGroup = { id?: string; name?: string };

class PreviewScreenStore {
  root: RootStore;

  rows: PreviewScreenRow[] = [];
  isLoading = false;
  private inFlightProcess: Promise<PreviewScreenRow[]> | null = null;
  private lastProcessResponse: CapEventAggregatedLineItem[] = [];
  private lastCapEvent: CapEvent | null = null;

  constructor(root: RootStore) {
    this.root = root;

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
      this.root.entityDatesStore.noticeDate ||
      (selectedEntities.length
        ? this.root.entityDatesStore.getEntityNoticeDate(selectedEntities[0].label ?? '')
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
    const rawInvestment = (
      row as {
        investment?: string | { id?: string | number | null };
      }
    ).investment;
    const id = typeof rawInvestment === 'string' ? rawInvestment : String(rawInvestment?.id ?? '');
    if (!id) return undefined;
    const found = investments.find(
      (inv) => String(inv.id).toLowerCase() === String(id).toLowerCase(),
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
      capitalCategory: row.capitalCategory,
      callDistributionReason: row.callDistributionReason,
      defaultDescription: row.defaultDescription,
      insideCommitment: (() => {
        if (typeof row.insideCommitment !== 'string') return undefined;
        const normalized = row.insideCommitment.trim().toLowerCase();
        return normalized;
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
    const fgRows = this.root.capEventSettingsStore.fundGroupsLineItem || [];
    const hasAtLeastOneValid = fgRows.some((r) => this.isEntityRowValid(r));
    for (const row of fgRows) {
      if (isRowEmpty(row)) continue;
      const base = this.mapLineItemBase(row, accounts, investments);
      if (!base) continue;
      const allowed = this.isEntityRowValid(row) || hasAtLeastOneValid;
      if (!allowed) continue;
      const explicitInheritanceId = (row as { inheritanceId?: string }).inheritanceId;
      if (explicitInheritanceId && explicitInheritanceId.toString().trim() !== '') {
        idMap.set(explicitInheritanceId, explicitInheritanceId);
      }
      const allocationBasisId = this.root.capEventSettingsStore.getAllocationBasisId(
        base.allocationBasis,
      );
      items.push({
        ...(explicitInheritanceId && explicitInheritanceId.toString().trim() !== ''
          ? { inheritanceId: explicitInheritanceId }
          : {}),
        account: base.account,
        investment: base.investment ?? (null as unknown as ApiInvestment),
        allocationBasis: base.allocationBasis,
        allocationBasisId,
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
      const entityRows: LineItemRow[] =
        this.root.capEventSettingsStore.entitiesLineItem.get(label) ?? [];

      const validNotice = getValidDate(this.root.entityDatesStore.getEntityNoticeDate(label));
      const validDue = getValidDate(this.root.entityDatesStore.getEntityDueDate(label));
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
        const originalInheritanceRef = r.fundGroupLineItemInheritanceId;
        const fundGroupLineItemInheritanceId = originalInheritanceRef
          ? (fundGroupIdMap.get(originalInheritanceRef) ?? originalInheritanceRef)
          : undefined;
        const allocationBasisId = this.root.capEventSettingsStore.getAllocationBasisId(
          base.allocationBasis,
        );
        capEventLineItems.push({
          account: base.account,
          investment: base.investment ?? (null as unknown as ApiInvestment),
          allocationBasis: base.allocationBasis,
          allocationBasisId,
          amount: base.amount,
          ...(fundGroupLineItemInheritanceId ? { fundGroupLineItemInheritanceId } : {}),
          prDate: prDate as string,
          prFlag,
          isMfLineItem: r.isMfLineItem,
          batchNo: r.batchNo,
          originAccountKey: r.originAccountKey,
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

  buildPayload(isDraft?: boolean): CapEvent | null {
    const selectedTypeItem = this.getSelectedSingle(this.root.capEventSettingsStore.eventTypes);
    const selectedSponsorItem = this.getSelectedSingle(this.root.capEventSettingsStore.sponsors);
    const selectedFundGroupItem = this.getSelectedSingle(
      this.root.capEventSettingsStore.fundGroups,
    );
    const selectedEntityItems = this.getSelectedMany(
      this.root.capEventSettingsStore.fundEntities,
    ) as Array<{
      id?: string;
      name?: string;
      label?: string;
    }>;

    if (!selectedTypeItem || !selectedSponsorItem || !selectedFundGroupItem) {
      return null;
    }
    if (selectedEntityItems.length === 0 && !isDraft) return null;

    const entities = this.toApiEntities(selectedEntityItems);
    const noticeDateStr = this.getTopNoticeDateString(selectedEntityItems);
    if (!noticeDateStr) return null;

    // Lookups
    const accounts: RefAccount[] = this.root.capEventSettingsStore.accounts;
    const investments: RefInvestment[] = this.root.capEventSettingsStore.investments;

    // Build line items via helpers
    const { items: capEventFundGroupLineItems, idMap: fundGroupIdMap } =
      this.buildFundGroupLineItems(accounts, investments);
    const capEventEntityLineItems = this.buildEntityLineItems(
      selectedEntityItems,
      accounts,
      investments,
      fundGroupIdMap,
    );

    if (capEventEntityLineItems.length === 0 && !isDraft) {
      return null;
    }

    const totalAmount = this.computeTotalAmount(capEventEntityLineItems);

    const payload: CapEvent = {
      sponsor: this.toApiSponsor(selectedSponsorItem)! as unknown as CapEvent['sponsor'],
      capEventType: this.toApiType(selectedTypeItem)!,
      fundGroup: this.toApiFundGroup(selectedFundGroupItem)! as unknown as CapEvent['fundGroup'],
      entities,
      noticeDate: noticeDateStr,
      status: 'DRAFT' as unknown as CapEvent['status'],
      ...(capEventFundGroupLineItems.length ? { capEventFundGroupLineItems } : {}),
      capEventEntityLineItems,
      ...(this.root.capEventSettingsStore.comment?.trim()
        ? { comment: this.root.capEventSettingsStore.comment.trim() }
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
        runInAction(() => {
          this.isLoading = true;
          this.rows = [];
        });
        const response = await CapEventPackageApi.default.process(requestPayload, sessionId);
        runInAction(() => {
          this.lastCapEvent = requestPayload;
          this.lastProcessResponse = Array.isArray(response) ? response : [];
        });

        const parsed = parseToPreviewScreenRows(response);
        runInAction(() => {
          this.rows = parsed;
        });
        return parsed;
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Processing failed. Please try again.';
        toast?.error?.(message);
        runInAction(() => {
          this.rows = [];
          this.lastCapEvent = null;
        });
        return [];
      } finally {
        runInAction(() => {
          this.isLoading = false;
          this.inFlightProcess = null;
        });
      }
    })();
    return this.inFlightProcess;
  }

  public getAggregatedLineItems(): Array<CapEventAggregatedLineItem> {
    const source = Array.isArray(this.lastProcessResponse) ? this.lastProcessResponse : [];
    return source.map((item) => ({
      id: item?.id,
      entity: item?.entity,
      dueDate: item?.dueDate,
      plInvestorEntries: Array.isArray(item?.plInvestorEntries) ? item.plInvestorEntries : [],
    }));
  }

  public withAggregatedLineItems(payload: CapEvent) {
    const aggregated = this.getAggregatedLineItems();
    if (!aggregated || aggregated.length === 0) return payload;
    return { ...payload, capEventAggregatedLineItems: aggregated };
  }

  public hasAggregatedLineItems(): boolean {
    return (Array.isArray(this.rows) ? this.rows : []).some((r) => !!r?.isAggregated);
  }

  async fetchDoc(
    selectedRow: PreviewScreenRow | null | undefined,
    toast?: ToastApi,
  ): Promise<Blob | undefined> {
    try {
      if (!selectedRow?.isAggregated || !selectedRow.entityId || !selectedRow.investorId) {
        toast?.error?.('Please select an aggregated investor row to generate a document');
        return;
      }

      const capEventPayload = this.lastCapEvent ?? this.buildPayload();
      if (!capEventPayload) {
        toast?.error?.('No processed cap event found. Please re-run preview.');
        return;
      }

      // Find corresponding entity-level line item from last process response
      const entityLineItem = (this.lastProcessResponse || []).find(
        (li) => (li?.entity?.id ?? '') === selectedRow.entityId,
      );

      if (!entityLineItem) {
        toast?.error?.('No processed data found for selected entity. Please re-run preview.');
        return;
      }

      // Filter investor entries for the selected investorId
      const filteredEntries = (
        Array.isArray(entityLineItem.plInvestorEntries) ? entityLineItem.plInvestorEntries : []
      ).filter((e) => (e?.customerId ?? '') === selectedRow.investorId);

      if (filteredEntries.length === 0) {
        toast?.error?.('No investor entries found for the selected investor');
        return;
      }

      const lineItem: CapEventAggregatedLineItem = {
        ...entityLineItem,
        plInvestorEntries: filteredEntries,
      };

      const requestBody: InvestorDocumentInput = {
        capEvent: capEventPayload,
        lineItem,
      };

      const sessionId = getStoredSessionId() ?? '';
      const base = CapEventPackageApi.request.config.BASE ?? '';
      const url = `${base}/cap-events/investors/document`;

      const resp = await axios.post(url, requestBody, {
        responseType: 'blob',
        headers: {
          Accept: 'application/octet-stream, application/json',
          'Content-Type': 'application/json',
          'Session-Id': sessionId,
        },
        withCredentials: CapEventPackageApi.request.config.WITH_CREDENTIALS ?? false,
      });

      const contentType = String(resp.headers?.['content-type'] || '');
      if (contentType.includes('application/json')) {
        const text = await (resp.data as Blob).text().catch(() => '');
        try {
          const parsed = text ? JSON.parse(text) : {};
          const msg =
            (parsed && (parsed.message || parsed.error || parsed.detail)) ||
            'Failed to generate investor document';
          toast?.error?.(msg);
        } catch {
          toast?.error?.('Failed to generate investor document');
        }
        return;
      }

      return resp.data as Blob;
    } catch {
      toast?.error?.('Failed to generate investor document');
      return;
    }
  }
}

export default PreviewScreenStore;
