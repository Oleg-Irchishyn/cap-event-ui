/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Entity } from '../models/Entity';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class EntitiesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get entities by fund group ID
     * @param sessionId Session identifier
     * @param fundGroupId
     * @param statuses Filter by entity statuses
     * @param typesToExclude Exclude specific entity types
     * @returns Entity List of entities found
     * @throws ApiError
     */
    public getEntitiesByFundGroup(
        sessionId: string,
        fundGroupId: string,
        statuses?: Array<string>,
        typesToExclude?: Array<string>,
    ): CancelablePromise<Array<Entity>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/fund-groups/{fundGroupId}/entities',
            path: {
                'fundGroupId': fundGroupId,
            },
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'statuses': statuses,
                'typesToExclude': typesToExclude,
            },
            errors: {
                400: `Bad request`,
                401: `Intacct SessionId is not valid`,
                404: `No entities found`,
                500: `Server error`,
            },
        });
    }
}
