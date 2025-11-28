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
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns Investment List of investments
     * @throws ApiError
     */
    public getInvestments(
        sessionId: string,
    ): CancelablePromise<Array<Investment>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/investments',
            headers: {
                'Session-Id': sessionId,
            },
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
}
