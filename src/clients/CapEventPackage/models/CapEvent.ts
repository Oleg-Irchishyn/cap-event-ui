/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapEventEntityLineItem } from './CapEventEntityLineItem';
import type { CapEventFundGroupLineItem } from './CapEventFundGroupLineItem';
import type { CapEventStatus } from './CapEventStatus';
import type { CapEventType } from './CapEventType';
import type { Entity } from './Entity';
import type { FundGroup } from './FundGroup';
import type { Sponsor } from './Sponsor';
export type CapEvent = {
    id?: string;
    name?: string;
    capEventType: CapEventType;
    sponsor: Sponsor;
    fundGroup: FundGroup;
    /**
     * The list with IDs of selected entities
     */
    entities: Array<Entity>;
    noticeDate: string;
    status?: CapEventStatus;
    comment?: string;
    footnotes?: Record<string, string>;
    capEventFundGroupLineItems?: Array<CapEventFundGroupLineItem>;
    capEventEntityLineItems?: Array<CapEventEntityLineItem>;
    totalAmount?: number;
    createdAt?: string;
    createdBy?: string;
    modifiedAt?: string;
    modifiedBy?: string;
};

