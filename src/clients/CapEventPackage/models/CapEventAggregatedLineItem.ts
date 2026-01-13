/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapEventEntityLineItem } from './CapEventEntityLineItem';
import type { InvestorEntry } from './InvestorEntry';
export type CapEventAggregatedLineItem = {
    id?: string;
    entity?: CapEventEntityLineItem['entity'];
    dueDate?: string;
    plInvestorEntries?: Array<InvestorEntry>;
};

