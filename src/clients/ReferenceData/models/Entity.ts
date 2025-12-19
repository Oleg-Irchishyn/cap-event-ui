/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AllocationBasis } from './AllocationBasis';
export type Entity = {
    id?: string;
    name?: string;
    dueDateDays?: string;
    dueDateType?: string;
    /**
     * @deprecated
     */
    mfBasis?: string;
    allocationBasis?: AllocationBasis;
    mfBasisDateDefault?: string;
    yearFractionApproach?: string;
    mfPercent?: string;
    mfStartDate?: string;
};

