/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { FileMetadata } from '../models/FileMetadata';
import type { GetFilesMetadataRequest } from '../models/GetFilesMetadataRequest';
import type { IdResponse } from '../models/IdResponse';
import type { UploadFileRequest } from '../models/UploadFileRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import type { BaseHttpRequest } from '../core/BaseHttpRequest';
export class FileOperationsService {
    constructor(public readonly httpRequest: BaseHttpRequest) {}
    /**
     * Get file by ID.
     * Get file by ID
     * @param id File identifier
     * @returns binary Successful response
     * @throws ApiError
     */
    public getFile(
        id: string,
    ): CancelablePromise<Blob> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/files/{id}/content',
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
     * Update file by ID.
     * Replaces the old file with file ID from request with the new one with new id. The update file
     *
     * operation comprises two requests to BOX: delete file and upload a new file. The name of the uploaded file will be
     *
     * the same as the file in request.
     * @param id File identifier
     * @param formData
     * @returns IdResponse Successfully updated. Returns new id of replaced file.
     * @throws ApiError
     */
    public updateFile(
        id: string,
        formData: UploadFileRequest,
    ): CancelablePromise<IdResponse> {
        return this.httpRequest.request({
            method: 'PUT',
            url: '/files/{id}',
            path: {
                'id': id,
            },
            formData: formData,
            mediaType: 'multipart/form-data',
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
     * Delete file by ID.
     * Deletes the file with the file ID from the request.
     * @param id File identifier
     * @returns void
     * @throws ApiError
     */
    public deleteFile(
        id: string,
    ): CancelablePromise<void> {
        return this.httpRequest.request({
            method: 'DELETE',
            url: '/files/{id}',
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
     * Add file.
     * Uploads a new file in the folder with the folder ID from the request. The name of uploaded file will be the same as the file in request.
     * @param formData
     * @returns IdResponse Successfully created. Returns id of created file.
     * @throws ApiError
     */
    public addFile(
        formData: UploadFileRequest,
    ): CancelablePromise<IdResponse> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/files',
            formData: formData,
            mediaType: 'multipart/form-data',
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
     * Get file metadata.
     * Gets file metadata.
     * @param id File identifier
     * @returns FileMetadata Successful response
     * @throws ApiError
     */
    public getFileMetadata(
        id: string,
    ): CancelablePromise<FileMetadata> {
        return this.httpRequest.request({
            method: 'GET',
            url: '/files/{id}/metadata',
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
     * Get files metadata.
     * Gets files metadata.
     * @param requestBody
     * @returns FileMetadata Successful response
     * @throws ApiError
     */
    public getFilesMetadata(
        requestBody: GetFilesMetadataRequest,
    ): CancelablePromise<Array<FileMetadata>> {
        return this.httpRequest.request({
            method: 'POST',
            url: '/files/metadata',
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
}
