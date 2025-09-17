/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Investment } from '../models/Investment';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class InvestmentsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
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
