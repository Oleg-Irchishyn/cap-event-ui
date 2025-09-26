/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class SessionService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Retrieve session id
     * @param id Session id
     * @returns string Session id
     * @throws ApiError
     */
    public getSessionId(
        id: string,
    ): CancelablePromise<string> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/session',
            query: {
                'id': id,
            },
            errors: {
                404: `No entities found`,
                500: `Server error`,
            },
        });
    }
}
