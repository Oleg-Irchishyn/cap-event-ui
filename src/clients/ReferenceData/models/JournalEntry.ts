/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Account } from './Account';
import type { Entity } from './Entity';
import type { Investment } from './Investment';
/**
 * Journal entry
 */
export type JournalEntry = {
    account?: Account;
    investment?: Investment;
    prDate?: string;
    prFlag?: string;
    agnstCommit?: string;
    allocationBasis?: string;
    /**
     * Amount of the journal entry
     */
    amount?: number;
    /**
     * Tr type
     */
    trType?: number;
    /**
     * Batch date
     */
    batchDate?: string;
    /**
     * Description
     */
    description?: string;
    /**
     * Batch number
     */
    batchNo?: number;
    entity?: Entity;
    exchangeRate?: number;
    classId?: string;
    customerId?: string;
    isRounded?: boolean;
    optOutInvestors?: string;
    /**
     * Allocation Basis date
     */
    allocationBasisDate?: string;
};

