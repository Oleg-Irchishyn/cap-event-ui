/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FundGroup } from '../models/FundGroup';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FundGroupsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Search fund groups by sponsor ID
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @param sponsorId Sponsor ID used to filter fund groups
     * @returns FundGroup List of fund groups found
     * @throws ApiError
     */
    public searchFundGroupsBySponsor(
        sessionId: string,
        sponsorId?: string,
    ): CancelablePromise<Array<FundGroup>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/fund-groups/search',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'sponsorId': sponsorId,
            },
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                404: `No fund groups found`,
                500: `Server error`,
            },
        });
    }
}
