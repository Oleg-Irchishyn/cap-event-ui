/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Account } from '../models/Account';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class AccountsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve list of accounts
     * @param sponsorId Sponsor ID which accounts to retrieve
     * @param fsGroupings Financial Groupings to include
     * @param capitalCategories Capital Categories to exclude
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns Account List of accounts
     * @throws ApiError
     */
    public getAccounts(
        sponsorId: string,
        fsGroupings?: Array<string>,
        capitalCategories?: Array<string>,
        sessionId?: string,
    ): CancelablePromise<Array<Account>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts',
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'sponsorId': sponsorId,
                'fsGroupings': fsGroupings,
                'capitalCategories': capitalCategories,
            },
            errors: {
                401: `Intacct SessionId is not valid`,
                404: `No resourse found`,
                500: `Server error`,
            },
        });
    }
    /**
     * Get mapped account
     * @param id Source account ID to search for mapped account
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns Account List of accounts
     * @throws ApiError
     */
    public getMappedAccount(
        id: string,
        sessionId?: string,
    ): CancelablePromise<Account> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts/mapped/{id}',
            path: {
                'id': id,
            },
            headers: {
                'Session-Id': sessionId,
            },
            errors: {
                401: `Intacct SessionId is not valid`,
                404: `No resourse found`,
                500: `Server error`,
            },
        });
    }
}
