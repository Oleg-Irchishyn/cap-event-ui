/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllocationInput } from '../models/AllocationInput';
import type { CapEventLineItemResponse } from '../models/CapEventLineItemResponse';
import type { CapEventProcessRequest } from '../models/CapEventProcessRequest';
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
     * Process capital event
     * @param requestBody
     * @returns CapEventLineItemResponse List of capital event line items with investor entries
     * @throws ApiError
     */
    public process(
        requestBody: CapEventProcessRequest,
    ): CancelablePromise<Array<CapEventLineItemResponse>> {
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
