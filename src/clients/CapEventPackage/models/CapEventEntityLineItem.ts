/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapEventLineItem } from './CapEventLineItem';
import type { Entity } from './Entity';
import type { MgmtFeeJournalEntry } from './MgmtFeeJournalEntry';
export type CapEventEntityLineItem = {
    id?: string;
    entity: Entity;
    noticeDate: string;
    dueDate: string;
    templateId?: string;
    includeUncalledMgmtFee?: boolean;
    mgmtFeeJournalEntry?: MgmtFeeJournalEntry;
    capEventLineItems: Array<CapEventLineItem>;
};

