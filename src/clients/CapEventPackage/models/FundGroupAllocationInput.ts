/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { EntityAllocationInput } from './EntityAllocationInput';
export type FundGroupAllocationInput = {
    entityAllocationInput: Array<EntityAllocationInput>;
    /**
     * Allocation basis for the entities
     */
    allocationBasis: string;
    /**
     * Total amount to allocate
     */
    amount: number;
};

