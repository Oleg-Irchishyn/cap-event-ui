/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllocationBasis } from '../models/AllocationBasis';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AllocationBasesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve list of AllocationBasis
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns AllocationBasis List of AllocationBasis
     * @throws ApiError
     */
    public getAllocationBases(
        sessionId: string,
    ): CancelablePromise<Array<AllocationBasis>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/allocation-bases',
            headers: {
                'Session-Id': sessionId,
            },
            errors: {
                401: `Intacct SessionId is not valid`,
                500: `Server error`,
            },
        });
    }
}
