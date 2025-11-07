/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapEventLineItem } from './CapEventLineItem';
import type { Entity } from './Entity';
export type CapEventEntityLineItem = {
    id?: string;
    entity: Entity;
    noticeDate?: string;
    dueDate: string;
    entityLineItemAmount: number;
    capEventLineItems: Array<CapEventLineItem>;
};

