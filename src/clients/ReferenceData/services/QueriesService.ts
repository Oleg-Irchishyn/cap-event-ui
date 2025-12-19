/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Query } from '../models/Query';
import type { QueryResults } from '../models/QueryResults';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class QueriesService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Execute query with id and arguments from request and obtain results
     * @param queryId Query identifier
     * @param _arguments Arguments for query execution
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns QueryResults Query executed
     * @throws ApiError
     */
    public executeQuery(
        queryId: string,
        _arguments?: Record<string, string>,
        sessionId?: string,
    ): CancelablePromise<QueryResults> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/queries/{queryId}/filters',
            path: {
                'queryId': queryId,
            },
            headers: {
                'Session-Id': sessionId,
            },
            query: {
                'arguments': _arguments,
            },
            errors: {
                401: `Intacct SessionId is not valid`,
            },
        });
    }
    /**
     * Get all queries
     * @returns Query Queries found
     * @throws ApiError
     */
    public getAllQueries(): CancelablePromise<Array<Query>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/queries',
        });
    }
}
