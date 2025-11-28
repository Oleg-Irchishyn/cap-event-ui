/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CeBoxFile } from './CeBoxFile';
import type { Entity } from './Entity';
import type { FundGroup } from './FundGroup';
import type { Sponsor } from './Sponsor';
/**
 * The information about template in the system.
 */
export type Template = {
    /**
     * The id of the template registered in the library in UUID format.
     */
    id: string;
    boxFile?: CeBoxFile;
    /**
     * The user description of the template.
     */
    description?: string;
    sourceTemplate?: Template;
    sponsor?: Sponsor;
    fundGroup?: FundGroup;
    entity?: Entity;
    /**
     * The name or id of the user who created a template.
     */
    createdBy?: string;
    /**
     * The name or id of the user who make the last changes in a template.
     */
    modifiedBy?: string;
    /**
     * The status of the template.
     */
    status?: Template.status;
};
export namespace Template {
    /**
     * The status of the template.
     */
    export enum status {
        ACTIVE = 'Active',
        INACTIVE = 'Inactive',
    }
}

