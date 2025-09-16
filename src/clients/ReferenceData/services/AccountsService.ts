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
     * @returns Account List of accounts
     * @throws ApiError
     */
    public getAccounts(
        sponsorId: string,
        fsGroupings?: Array<string>,
        capitalCategories?: Array<string>,
    ): CancelablePromise<Array<Account>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/accounts',
            query: {
                'sponsorId': sponsorId,
                'fsGroupings': fsGroupings,
                'capitalCategories': capitalCategories,
            },
            errors: {
                404: `No resourse found`,
                500: `Server error`,
            },
        });
    }
}
