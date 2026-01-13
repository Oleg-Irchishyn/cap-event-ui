/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { CapEventLineItem } from './CapEventLineItem';
import type { MgmtFeeJournalEntry } from './MgmtFeeJournalEntry';
export type CapEventEntityLineItem = {
  id?: string;
  entity: {
    id?: string;
    name?: string;
    dueDateDays?: string;
    dueDateType?: string;
    /**
     * @deprecated
     */
    mfBasis?: string;
    allocationBasis?: {
      allocationId?: string;
      allocationName?: string;
      type?: string;
      allocationBasisStatus?: CapEventEntityLineItem.allocationBasisStatus;
    };
    allocationBasisPostInvPeriod?: {
      allocationId?: string;
      allocationName?: string;
      type?: string;
      allocationBasisStatus?: CapEventEntityLineItem.allocationBasisStatus;
    };
    mfBasisDateDefault?: string;
    yearFractionApproach?: string;
    mfPercent?: string;
    mfStartDate?: string;
    mfStepDownDate?: string;
    mfPercentPostInvPeriod?: string;
  };
  noticeDate: string;
  dueDate: string;
  templateId?: string;
  includeUncalledMgmtFee?: boolean;
  mgmtFeeJournalEntry?: MgmtFeeJournalEntry;
  capEventLineItems: Array<CapEventLineItem>;
};
export namespace CapEventEntityLineItem {
  export enum allocationBasisStatus {
    ACTIVE = 'Active',
    INACTIVE = 'Inactive',
  }
}
