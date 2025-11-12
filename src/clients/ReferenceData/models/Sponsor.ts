/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type Sponsor = {
    id?: string;
    name?: string;
    status?: Sponsor.status;
    salesforceId?: string;
};
export namespace Sponsor {
    export enum status {
        NEW = 'NEW',
        PROSPECT = 'PROSPECT',
        ONBOARDING_TRANSITION = 'ONBOARDING_TRANSITION',
        PENDING_CS_APPROVAL = 'PENDING_CS_APPROVAL',
        PENDING_QC_LEGAL_APPROVAL = 'PENDING_QC_LEGAL_APPROVAL',
        QC_REJECTED = 'QC_REJECTED',
        LEGAL_REJECTED = 'LEGAL_REJECTED',
        IT_PROCESSING = 'IT_PROCESSING',
        ACTIVE = 'ACTIVE',
        NEVER_LAUNCHED = 'NEVER_LAUNCHED',
        OFFBOARDING = 'OFFBOARDING',
        INACTIVE = 'INACTIVE',
        PENDING_CS_APPROVAL_OFFBOARDING = 'PENDING_CS_APPROVAL_OFFBOARDING',
        IT_PROCESSING_OFFBOARDING = 'IT_PROCESSING_OFFBOARDING',
    }
}

