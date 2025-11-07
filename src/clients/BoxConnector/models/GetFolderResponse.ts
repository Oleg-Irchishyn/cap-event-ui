/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type GetFolderResponse = {
    /**
     * ID of folder on BOX.
     */
    id?: string;
    /**
     * Name of the folder.
     */
    name?: string;
    metadata?: {
        /**
         * The name of a person who changed the folder's content recently
         */
        modifiedBy?: string;
        /**
         * The date and time when the folder's content was last updated on Box.
         */
        modifiedAt?: string;
        /**
         * The ID of the folder where this folder is located. Could be null if it's root folder.
         */
        parentFolderId?: string;
        /**
         * The size of the folder.
         */
        size?: number;
    };
};

