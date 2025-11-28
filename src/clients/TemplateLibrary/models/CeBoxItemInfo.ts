/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * The general information about box item.
 */
export type CeBoxItemInfo = {
    /**
     * The name of the file.
     */
    name?: string;
    /**
     * The id of the parent item to access in the box service.
     */
    parentFolderId?: string;
    /**
     * The timestamp of the last item modification.
     */
    modifiedAt?: string;
    /**
     * The timestamp of item creation.
     */
    createdAt?: string;
    /**
     * The required disk space to store the file
     */
    size?: number;
};

