/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Account } from './Account';
import type { Investment } from './Investment';
export type CapEventLineItem = {
    id?: string;
    account: Account;
    investment: Investment;
    allocationBasisId?: string;
    amount: number;
};

