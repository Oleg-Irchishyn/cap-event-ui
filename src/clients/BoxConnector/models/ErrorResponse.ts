/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Error response with message
 */
export type ErrorResponse = {
    reason: string;
    message: string;
    details: Array<{
        field?: string;
        reason?: string;
        message?: string;
    }>;
    timestamp: string;
    requestId: string;
};

