/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Sponsor } from '../models/Sponsor';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SponsorsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve list of sponsors
     * @returns Sponsor List of sponsors
     * @throws ApiError
     */
    public getSponsors(): CancelablePromise<Array<Sponsor>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/sponsors',
            errors: {
                500: `Server error`,
            },
        });
    }
}
