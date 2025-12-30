/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemBase } from './LineItemBase';
export type CapEventLineItem = (LineItemBase & {
    batchNo?: number;
    originAccountKey?: string;
    /**
     * A unique identifier that shows the correspondence between this CapEventLineItem and the CapEventFundGroupLineItem from which it was allocated. If there is no such correspondence, the value should be null.
     */
    fundGroupLineItemInheritanceId?: string;
    prDate: string;
    prFlag: boolean;
});

