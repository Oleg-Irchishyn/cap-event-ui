/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TemplateMetadata } from '../models/TemplateMetadata';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TemplateService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get standard templates metadata
     * This endpoint retrieves a list of template metadata based on sponsor ID and event type ID.
     * @param sponsorId ID of the sponsor
     * @param eventTypeId ID of the event type in UUID format
     * @returns TemplateMetadata Successfully retrieved list of template metadata
     * @throws ApiError
     */
    public getStandardTemplatesMetadata(
        sponsorId: string,
        eventTypeId: string,
    ): CancelablePromise<Array<TemplateMetadata>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/templates/metadata',
            query: {
                'sponsorId': sponsorId,
                'eventTypeId': eventTypeId,
            },
            errors: {
                400: `Bad request - invalid or missing parameters`,
                401: `Unauthorized - authentication required`,
                403: `Forbidden - insufficient permissions`,
                404: `No templates found for the specified criteria`,
                422: `Unprocessable Entity - validation errors`,
                500: `Internal server error`,
            },
        });
    }
}
