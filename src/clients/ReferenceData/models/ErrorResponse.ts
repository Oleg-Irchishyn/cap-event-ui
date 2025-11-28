/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Error response with message
 */
export type ErrorResponse = {
    reason?: ErrorResponse.reason;
    message?: string;
    details?: Array<{
        field?: string;
        reason?: string;
        message?: string;
    }>;
    timestamp?: string;
    requestId?: string;
};
export namespace ErrorResponse {
    export enum reason {
        VALIDATION_ERROR = 'VALIDATION_ERROR',
        RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND',
        INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
        ACCESS_DENIED = 'ACCESS_DENIED',
        UNAUTHORIZED = 'UNAUTHORIZED',
    }
}

