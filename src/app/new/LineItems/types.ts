import type { InvestorEntry, LineItemBase } from '@/clients/CapEventPackage';
import { Account } from '@/clients/ReferenceData';

// Derived Investment type from generated LineItemBase model
export type Investment = NonNullable<LineItemBase['investment']>;

export type LineItemRow = {
  id: string;
  inheritanceId?: string;
  amount: number;
  fundGroupLineItemInheritanceId?: string;
  investment?: Investment | string;
  allocationBasis: string;
  prDate?: Date;
  prFlag?: string;
  isMfLineItem?: boolean;
  batchNo?: number;
  originAccountKey?: string;
} & Account;

export type AllocationPreviewTableProps = {
  rows: InvestorEntry[];
  testId?: string;
  isLoading?: boolean;
  allocationBasis: string;
};

export type AllocationPreviewMetaDataType = {
  callDistributionReason: string;
  txnCurrency: string;
  investment: string;
  amount: string;
  allocationBasis: string;
};

export interface AllocationPreviewMetaDataProps {
  searchValue: string;
  clearSearchValue: () => void;
  onSearchValueChange: (value: string) => void;
  allocationPreviewMetaData: AllocationPreviewMetaDataType | null;
}

export type AllocationPreviewTableData = {
  optOut?: boolean;
  readOnly: boolean;
  rounded: boolean;
  investor: string;
  classID: string;
  additionalInvestorType: string;
  customerId: string;
  customerName: string;
  department: string;
  commitment: number;
  investedCapital: number;
  unfunded: number;
  managementFee: number;
  managementFeePercentage: number;
  amount: number;
  originalAmount: number;
  allocatedAmount: number;
  allocatedAmountNotRounded: number;
  isTransferEntry: boolean;
  trType: number;
  hasZeroCtb: boolean;
  investorToRound: boolean;
  location: string;
  dataPoints: string;
  isAggregated: boolean;
  lineItemAmount: number;
};

export interface PreviewModalTotalRow {
  customerId: string;
  allocatedAmount: number;
}

export type DynamicFieldType = 'unfunded' | 'investedCapital' | 'commitment';
export type ManagementFeeFieldType = 'managementFee';
export type AllocatedAmountFieldTypes = 'allocatedAmount';
