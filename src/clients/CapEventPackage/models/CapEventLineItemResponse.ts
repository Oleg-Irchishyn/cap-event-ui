/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Account } from './Account';
import type { Entity } from './Entity';
import type { Investment } from './Investment';
import type { InvestorEntry } from './InvestorEntry';
export type CapEventLineItemResponse = {
    capEventLineItemId?: string;
    entity?: Entity;
    account?: Account;
    investment?: Investment;
    plInvestorEntries?: Array<InvestorEntry>;
};

