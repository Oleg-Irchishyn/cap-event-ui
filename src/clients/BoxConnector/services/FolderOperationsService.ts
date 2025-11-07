/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CreateFolderRequest } from '../models/CreateFolderRequest';
import type { GetFolderResponse } from '../models/GetFolderResponse';
import type { IdResponse } from '../models/IdResponse';
import type { UpdateFolderRequest } from '../models/UpdateFolderRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FolderOperationsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Create folder.
     * Creates a folder in the folder with the folder ID from the request.
     * @param requestBody
     * @returns IdResponse Successfully created. Returns id of created folder.
     * @throws ApiError
     */
    public createFolder(
        requestBody: CreateFolderRequest,
    ): CancelablePromise<IdResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/folder',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                409: `Conflict`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Update folder's name by ID.
     * Updates the folder's name. Returns the same folder ID from the request.
     * @param id Folder identifier
     * @param requestBody
     * @returns IdResponse Successfully updated. Returns id of updated folder.
     * @throws ApiError
     */
    public updateFolder(
        id: string,
        requestBody: UpdateFolderRequest,
    ): CancelablePromise<IdResponse> {
        return this.httpRequest.request({
            method: 'PATCH',
            url: '/folder/{id}/name',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Get folder by ID.
     * Get folder by ID
     * @param id Folder identifier
     * @returns GetFolderResponse Successful response
     * @throws ApiError
     */
    public getFolder(
        id: string,
    ): CancelablePromise<GetFolderResponse> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/folder/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
    /**
     * Delete folder by ID.
     * Removes the folder with folder ID from the request. Removes all contents.
     * @param id Folder identifier
     * @returns void
     * @throws ApiError
     */
    public deleteFolder(
        id: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/folder/{id}',
            path: {
                'id': id,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                404: `Not Found`,
                500: `Internal Server Error`,
            },
        });
    }
}
