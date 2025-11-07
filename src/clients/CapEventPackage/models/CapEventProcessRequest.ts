/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapEventEntityLineItem } from './CapEventEntityLineItem';
export type CapEventProcessRequest = {
    sponsorId?: string;
    capEventTypeId?: string;
    templateId?: string;
    footnotes?: Record<string, string>;
    capEventEntityLineItems: Array<CapEventEntityLineItem>;
};

