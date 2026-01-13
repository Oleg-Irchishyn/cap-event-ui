/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { LineItemBase } from './LineItemBase';
export type InvestorEntry = {
    id?: string;
    account?: LineItemBase['account'];
    investment?: LineItemBase['investment'];
    optOut?: boolean;
    readOnly?: boolean;
    rounded?: boolean;
    investor?: string;
    classID?: string;
    additionalInvestorType?: string;
    customerId?: string;
    customerName?: string;
    department?: string;
    commitment?: number;
    investedCapital?: number;
    unfunded?: number;
    managementFee?: number;
    managementFeePercentage?: number;
    amount?: number;
    originalAmount?: number;
    allocatedAmount?: number;
    allocatedAmountNotRounded?: number;
    isTransferEntry?: boolean;
    trType?: number;
    hasZeroCtb?: boolean;
    investorToRound?: boolean;
    location?: string;
    dataPoints?: string;
    isAggregated?: boolean;
    lineItemAmount?: number;
    fileId?: string;
};

