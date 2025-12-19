/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { JournalEntry } from '../models/JournalEntry';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class JournalEntryService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get management fee journal entries
     * @param entityIds List of entity IDs to filter journal entries
     * @param fsLineItems List of financial statement line items to filter
     * @param calledFlag Called flag to filter journal entries
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns JournalEntry List of management fee journal entries
     * @throws ApiError
     */
    public getMgmtFeeJournalEntries(
        entityIds?: Array<string>,
        fsLineItems?: Array<string>,
        calledFlag?: string,
        sessionId?: string,
    ): CancelablePromise<Array<JournalEntry>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/journal-entries/mgmt-fee',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'entityIds': entityIds,
                'fsLineItems': fsLineItems,
                'calledFlag': calledFlag,
            },
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
    /**
     * Get management fee journal entry line items
     * @param batchNo Batch number to filter journal entry line items
     * @param entityId Entity ID to filter journal entry line items
     * @param state State to filter journal entry line items
     * @param calledFlag Called flag to filter journal entry line items
     * @param fsLineItems List of financial statement line items to filter
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns JournalEntry List of management fee journal entry line items
     * @throws ApiError
     */
    public getMgmtFeeGlLineItems(
        batchNo: number,
        entityId: string,
        state: string,
        calledFlag: string,
        fsLineItems?: Array<string>,
        sessionId?: string,
    ): CancelablePromise<Array<JournalEntry>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/journal-entries/mgmt-fee/line-items',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'batchNo': batchNo,
                'entityId': entityId,
                'state': state,
                'calledFlag': calledFlag,
                'fsLineItems': fsLineItems,
            },
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
    /**
     * Get total amount journal entries by entityIds and allocationBasis
     * @param entityIds
     * @param allocationBasis Allocation basis
     * @param toDate Date up to which transactions are included (inclusive)
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns JournalEntry List of journal entries that contains total amount for entities
     * @throws ApiError
     */
    public getTotalAmountJeForEntities(
        entityIds: Array<string>,
        allocationBasis: string,
        toDate: string,
        sessionId?: string,
    ): CancelablePromise<Array<JournalEntry>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/journal-entries/entities/total-amount',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'entityIds': entityIds,
                'allocationBasis': allocationBasis,
                'toDate': toDate,
            },
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
    /**
     * Get journal entries by parameters
     * @param batchNo Batch number to filter journal entry
     * @param accountKey Account key to filter journal entry
     * @param allocationBasis Allocation basis to filter journal entry
     * @param entityId Entity ID to filter journal entry
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns JournalEntry List of journal entries
     * @throws ApiError
     */
    public getJournalEntries(
        batchNo: number,
        accountKey: string,
        allocationBasis: string,
        entityId: string,
        sessionId?: string,
    ): CancelablePromise<Array<JournalEntry>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/journal-entries',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'batchNo': batchNo,
                'accountKey': accountKey,
                'allocationBasis': allocationBasis,
                'entityId': entityId,
            },
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
}
