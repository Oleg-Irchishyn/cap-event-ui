/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllocationInput } from '../models/AllocationInput';
import type { CapEvent } from '../models/CapEvent';
import type { CapEventAggregatedLineItem } from '../models/CapEventAggregatedLineItem';
import type { CapEventDraft } from '../models/CapEventDraft';
import type { CapEventLineItem } from '../models/CapEventLineItem';
import type { CapEventStatus } from '../models/CapEventStatus';
import type { CapEventType } from '../models/CapEventType';
import type { FundGroupAllocationInput } from '../models/FundGroupAllocationInput';
import type { InvestorDocumentInput } from '../models/InvestorDocumentInput';
import type { InvestorEntry } from '../models/InvestorEntry';
import type { MgmtFeeJournalEntry } from '../models/MgmtFeeJournalEntry';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class DefaultService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve list of capital event types
     * @returns CapEventType List of capital event types
     * @throws ApiError
     */
    public getCapEventTypes(): CancelablePromise<Array<CapEventType>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/cap-events/types',
            errors: {
                400: `Bad request`,
                404: `No event types found`,
                500: `Server error`,
            },
        });
    }
    /**
     * Submits capital event
     * @param requestBody
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns CapEvent The CapEvent object stored in the system.
     * @throws ApiError
     */
    public submit(
        requestBody: CapEvent,
        sessionId?: string,
    ): CancelablePromise<CapEvent> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events',
            headers: {
                'Session-Id': sessionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Resource not found`,
                500: `Server error`,
            },
        });
    }
    /**
     * Retrieve Capital event list with optional filters: Sponsor ID and Status list
     * @param sponsorId Optional Sponsor ID filter to search for matching entries
     * @param statuses Optional Status List filter to search for matching entries
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns CapEvent List of capital events
     * @throws ApiError
     */
    public getCapEventList(
        sponsorId?: string,
        statuses?: Array<CapEventStatus>,
        sessionId?: string,
    ): CancelablePromise<Array<CapEvent>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/cap-events',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'sponsorId': sponsorId,
                'statuses': statuses,
            },
            errors: {
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
    /**
     * Creates capital event as draft
     * @param requestBody
     * @returns CapEvent The CapEvent object stored in the system.
     * @throws ApiError
     */
    public createDraft(
        requestBody: CapEventDraft,
    ): CancelablePromise<CapEvent> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events/draft',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                500: `Server error`,
            },
        });
    }
    /**
     * Get capital event by ID
     * @param id Capital event ID
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns CapEvent The CapEvent object stored in the system.
     * @throws ApiError
     */
    public getCapEventById(
        id: string,
        sessionId?: string,
    ): CancelablePromise<CapEvent> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/cap-events/{id}',
            path: {
                'id': id,
            },
            headers: {
                'Session-Id': sessionId,
            },
            errors: {
                404: `Capital event not found`,
                500: `Server error`,
            },
        });
    }
    /**
     * Delete capital event and related files by ID
     * @param id Capital event ID to delete
     * @returns void
     * @throws ApiError
     */
    public deleteCapEvent(
        id: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/cap-events/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad request`,
                404: `Capital event not found`,
                500: `Server error`,
            },
        });
    }
    /**
     * Update capital event in status draft
     * @param id Capital event ID to update
     * @param requestBody
     * @returns CapEvent The CapEvent object stored in the system.
     * @throws ApiError
     */
    public update(
        id: string,
        requestBody: CapEventDraft,
    ): CancelablePromise<CapEvent> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Capital event not found`,
                500: `Server error`,
            },
        });
    }
    /**
     * Process capital event
     * @param requestBody
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns CapEventAggregatedLineItem List of capital event line items with investor entries
     * @throws ApiError
     */
    public process(
        requestBody: CapEvent,
        sessionId?: string,
    ): CancelablePromise<Array<CapEventAggregatedLineItem>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events/process',
            headers: {
                'Session-Id': sessionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                404: `Resource not found`,
                500: `Server error`,
            },
        });
    }
    /**
     * Allocate investors for cap event line item
     * @param requestBody
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns InvestorEntry List of allocated investor entries
     * @throws ApiError
     */
    public allocateLineItem(
        requestBody: AllocationInput,
        sessionId?: string,
    ): CancelablePromise<Array<InvestorEntry>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events/line-items/allocate',
            headers: {
                'Session-Id': sessionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                404: `Resource not found`,
                500: `Server error`,
            },
        });
    }
    /**
     * Retrieve list of CELIs represents uncalled management fee entries
     * @param batchNo Batch Number to search for matching entries
     * @param entityId Entity ID to search for matching entries
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns CapEventLineItem List of management fee entries
     * @throws ApiError
     */
    public getMgmtFeeLineItems(
        batchNo: number,
        entityId: string,
        sessionId?: string,
    ): CancelablePromise<Array<CapEventLineItem>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/cap-events/line-items/mgmt-fees',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'batchNo': batchNo,
                'entityId': entityId,
            },
            errors: {
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
    /**
     * Retrieve management fee journal entries for entities
     * @param entityIds List of entity IDs to search for matching journal entries
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns MgmtFeeJournalEntry Map of management fee journal entries grouped by entity ID
     * @throws ApiError
     */
    public getMgmtFeeJournalEntries(
        entityIds: Array<string>,
        sessionId?: string,
    ): CancelablePromise<Record<string, Array<MgmtFeeJournalEntry>>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/cap-events/journal-entries/mgmt-fee',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'entityIds': entityIds,
            },
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
    /**
     * Retrieve allocated journal entry
     * @param batchNo Batch number to filter journal entry
     * @param accountKey Account key to filter journal entry
     * @param allocationBasis Allocation basis to filter journal entry
     * @param allocationBasisId Allocation basis id to allocate journal entries
     * @param entityId Entity ID to filter journal entry
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns InvestorEntry List of management fee journal entries grouped by entity ID
     * @throws ApiError
     */
    public getAllocatedMgmtFeeJournalEntries(
        batchNo: number,
        accountKey: string,
        allocationBasis: string,
        allocationBasisId: string,
        entityId: string,
        sessionId?: string,
    ): CancelablePromise<Array<InvestorEntry>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/cap-events/journal-entries/mgmt-fee/allocate',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'batchNo': batchNo,
                'accountKey': accountKey,
                'allocationBasis': allocationBasis,
                'allocationBasisId': allocationBasisId,
                'entityId': entityId,
            },
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
    /**
     * Allocate entities for fund group data
     * @param requestBody
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns number Map of entity IDs to allocated amounts
     * @throws ApiError
     */
    public allocateEntities(
        requestBody: FundGroupAllocationInput,
        sessionId?: string,
    ): CancelablePromise<Record<string, number>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events/fund-group/allocate',
            headers: {
                'Session-Id': sessionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
    /**
     * Generate document content for Investor. Request line item should contain plInvestorEntries related to only one Investor
     * @param requestBody
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns binary Binary data of generated investor document
     * @throws ApiError
     */
    public investorDocumentContent(
        requestBody: InvestorDocumentInput,
        sessionId?: string,
    ): CancelablePromise<Blob> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events/investors/document',
            headers: {
                'Session-Id': sessionId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad request`,
                404: `Resource not found`,
                500: `Server error`,
            },
        });
    }
}
