/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Template } from '../models/Template';
import type { TemplateMetadata } from '../models/TemplateMetadata';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class TemplateService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get list of the available and allowed templates.
     * This endpoint retrieves a list of the available and allowed templates.
     * @param sessionId Session identifier used to resolve Sponsor ID in case of it's absence
     * @returns Template Successfully retrieved list of the templates
     * @throws ApiError
     */
    public getTemplates(
        sessionId?: string,
    ): CancelablePromise<Array<Template>> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/templates',
            headers: {
                'Session-Id': sessionId,
            },
            errors: {
                401: `Unauthorized - authentication required`,
                403: `Forbidden - insufficient permissions`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Create new template
     * This endpoint creates a new template for selected assignment level
     * @param formData
     * @returns Template Template created successfully
     * @throws ApiError
     */
    public createTemplate(
        formData: {
            /**
             * ID of the sponsor (required)
             */
            sponsorId: string;
            /**
             * Name of the sponsor (required)
             */
            sponsorName: string;
            /**
             * ID of the fund group (optional)
             */
            fundGroupId?: string;
            /**
             * ID of the entity (optional)
             */
            entityId?: string;
            /**
             * Template file to upload
             */
            newTemplate: Blob;
        },
    ): CancelablePromise<Template> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/templates',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                400: `Bad request - invalid or missing parameters`,
                401: `Unauthorized - authentication required`,
                403: `Forbidden - insufficient permissions`,
                409: `Conflict - file already exist`,
                422: `Unprocessable Entity - validation errors`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Upload a new version of the template.
     * Upload a new version of the template. Even if template is identical it will create a new template version.
     * @param templateId ID of the template whichi should be updated.
     * @param requestBody
     * @returns any Returns information about the successfully uploaded template.
     * @throws ApiError
     */
    public updateTemplate(
        templateId: string,
        requestBody?: Blob,
    ): CancelablePromise<any> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/templates/{templateId}',
            path: {
                'templateId': templateId,
            },
            body: requestBody,
            mediaType: 'application/octet-stream',
            errors: {
                401: `Unauthorized - authentication required`,
                403: `Forbidden - insufficient permissions`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get template by id
     * This endpoint retrieves a template by template ID.
     * @param templateId ID of the template
     * @returns Template Successfully retrieved template
     * @throws ApiError
     */
    public getTemplateById(
        templateId: string,
    ): CancelablePromise<Template> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/templates/{templateId}',
            path: {
                'templateId': templateId,
            },
            errors: {
                400: `Bad request - invalid or missing parameters`,
                401: `Unauthorized - authentication required`,
                403: `Forbidden - insufficient permissions`,
                404: `No templates found for the specified criteria`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Returns template by sponsor, group, and entity IDs.
     * Returns ZIP archive with the template and the CSV file with available datapoints. Searches for a template matching the provided IDs, or falls back to a default template if not found.
     * @param sponsorId ID of the sponsor.
     * @param fundGroupId ID of the fund group.
     * @param entityId ID of the entity.
     * @returns binary ZIP file with the MS Word template and the CSV file with available datapoints.
     * @throws ApiError
     */
    public getTemplateContentByParameters(
        sponsorId: string,
        fundGroupId?: string,
        entityId?: string,
    ): CancelablePromise<Blob> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/templates/content',
            query: {
                'sponsorId': sponsorId,
                'fundGroupId': fundGroupId,
                'entityId': entityId,
            },
            errors: {
                401: `Unauthorized - authentication required`,
                403: `Forbidden - insufficient permissions`,
                404: `Template not found`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Returns required template.
     * Returns ZIP archive with the required template and the CSV file with available endpoints.
     * @param templateId ID of the template whichi should be updated.
     * @returns binary ZIP file with the MS Word template and the CSV file with available endpoints.
     * @throws ApiError
     */
    public getTemplateContent(
        templateId: string,
    ): CancelablePromise<Blob> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/templates/{templateId}/content',
            path: {
                'templateId': templateId,
            },
            errors: {
                401: `Unauthorized - authentication required`,
                403: `Forbidden - insufficient permissions`,
                500: `Internal server error`,
            },
        });
    }
    /**
     * Get template metadata
     * This endpoint retrieves a template metadata based on sponsor ID, fund group ID and entity ID.
     * @param sponsorId ID of the sponsor
     * @param fundGroupId ID of the fund group id
     * @param entityId ID of the entity
     * @param depth Specifies the depth of nested objects to include in the response. 0 - returns only the library-stored data; 1 - additionally includes Box file information.
     * @returns TemplateMetadata Successfully retrieved template metadata
     * @throws ApiError
     */
    public getTemplateMetadata(
        sponsorId: string,
        fundGroupId?: string,
        entityId?: string,
        depth: number = 1,
    ): CancelablePromise<TemplateMetadata> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/template/metadata',
            query: {
                'sponsorId': sponsorId,
                'fundGroupId': fundGroupId,
                'entityId': entityId,
                'depth': depth,
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
