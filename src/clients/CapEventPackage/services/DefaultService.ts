/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapEventType } from '../models/CapEventType';
import type { Investment } from '../models/Investment';
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
     * Retrieve list of investments
     * @returns Investment List of investments
     * @throws ApiError
     */
    public getInvestments(): CancelablePromise<Array<Investment>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/investments',
            errors: {
                400: `Bad request`,
                500: `Server error`,
            },
        });
    }
}
