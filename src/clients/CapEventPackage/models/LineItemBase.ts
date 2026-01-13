/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export type LineItemBase = {
    id?: string;
    account: {
        accountKey?: string;
        accountName?: string;
        accountNo?: string;
        capitalCategory?: string;
        callDistributionReason?: string;
        defaultDescription?: string;
        insideCommitment?: string;
        fsLineItem?: string;
    };
    investment?: {
        /**
         * Unique identifier of the investment
         */
        id?: string;
        /**
         * Short name of the investment
         */
        name?: string;
        /**
         * Full descriptive title of the investment
         */
        title?: string;
        /**
         * Type of the investment
         */
        type?: string;
    };
    allocationBasis: string;
    allocationBasisId: string;
    amount: number;
    isMfLineItem?: boolean;
};

