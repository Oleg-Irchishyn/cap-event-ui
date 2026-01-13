/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapEventAggregatedLineItem } from './CapEventAggregatedLineItem';
import type { CapEventEntityLineItem } from './CapEventEntityLineItem';
import type { CapEventFundGroupLineItem } from './CapEventFundGroupLineItem';
import type { CapEventStatus } from './CapEventStatus';
import type { CapEventType } from './CapEventType';
export type CapEvent = {
  id?: string;
  name?: string;
  capEventType: CapEventType;
  sponsor: string;
  fundGroup: string;
  /**
   * The list with IDs of selected entities
   */
  entities: Array<CapEventEntityLineItem['entity']>;
  noticeDate?: string;
  status?: CapEventStatus;
  comment?: string;
  footnotes?: Record<string, string>;
  capEventFundGroupLineItems?: Array<CapEventFundGroupLineItem>;
  capEventEntityLineItems?: Array<CapEventEntityLineItem>;
  capEventAggregatedLineItems?: Array<CapEventAggregatedLineItem>;
  totalAmount?: number;
  createdAt?: string;
  createdBy?: string;
  modifiedAt?: string;
  modifiedBy?: string;
};
