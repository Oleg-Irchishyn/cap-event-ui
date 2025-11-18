/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllocationInput } from '../models/AllocationInput';
import type { CapEvent } from '../models/CapEvent';
import type { CapEventLineItemResponse } from '../models/CapEventLineItemResponse';
import type { CapEventStatus } from '../models/CapEventStatus';
import type { CapEventType } from '../models/CapEventType';
import type { InvestorEntry } from '../models/InvestorEntry';
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
     * Stores capital event
     * @param requestBody
     * @returns CapEvent The CapEvent object stored in the system.
     * @throws ApiError
     */
    public create(
        requestBody: CapEvent,
    ): CancelablePromise<CapEvent> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events',
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
     * @returns CapEvent List of capital events
     * @throws ApiError
     */
    public getCapEventList(
        sponsorId?: string,
        statuses?: Array<CapEventStatus>,
    ): CancelablePromise<Array<CapEvent>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/cap-events',
            query: {
                'sponsorId': sponsorId,
                'statuses': statuses,
            },
            errors: {
                500: `Server error`,
            },
        });
    }
    /**
     * Process capital event
     * @param requestBody
     * @returns CapEventLineItemResponse List of capital event line items with investor entries
     * @throws ApiError
     */
    public process(
        requestBody: CapEvent,
    ): CancelablePromise<Array<CapEventLineItemResponse>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events/process',
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
     * Allocate investors for cap event line item
     * @param requestBody
     * @returns InvestorEntry List of allocated investor entries
     * @throws ApiError
     */
    public allocateLineItem(
        requestBody: AllocationInput,
    ): CancelablePromise<Array<InvestorEntry>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/cap-events/line-items/allocate',
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
