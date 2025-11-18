/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Account } from './Account';
import type { Investment } from './Investment';
export type LineItemBase = {
    id?: string;
    account: Account;
    investment: Investment;
    allocationBasis: string;
    amount: number;
};

