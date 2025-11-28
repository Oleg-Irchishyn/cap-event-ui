/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Object that represents errors details
 */
export type ErrorResponse = {
    /**
     * Error reason code
     */
    reason: ErrorResponse.reason;
    /**
     * Error message describing what went wrong
     */
    message: string;
    /**
     * Array of error details
     */
    details: Array<{
        field?: string;
        reason?: string;
        message?: string;
    }>;
    /**
     * Error timestamp
     */
    timestamp: string;
    /**
     * Request id
     */
    requestId: string;
};
export namespace ErrorResponse {
    /**
     * Error reason code
     */
    export enum reason {
        VALIDATION_ERROR = 'VALIDATION_ERROR',
        NOT_FOUND = 'NOT_FOUND',
        INTERNAL_SERVER_ERROR = 'INTERNAL_SERVER_ERROR',
        UNAUTHORIZED = 'UNAUTHORIZED',
        FORBIDDEN = 'FORBIDDEN',
        BAD_REQUEST = 'BAD_REQUEST',
        CONFLICT = 'CONFLICT',
    }
}

