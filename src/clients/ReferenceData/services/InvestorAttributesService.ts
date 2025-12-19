/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { InvestorAttribute } from '../models/InvestorAttribute';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class InvestorAttributesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get investor attributes
     * Returns investor attributes for provided investorId and entityId
     * @param investorId Investor ID
     * @param entityId Entity ID
     * @param sessionId Session identifier
     * @returns InvestorAttribute Investor attributes found
     * @throws ApiError
     */
    public getInvestorAttributes(
        investorId: string,
        entityId: string,
        sessionId?: string,
    ): CancelablePromise<InvestorAttribute> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/investor-attributes',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'investorId': investorId,
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
