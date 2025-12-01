import { InvestorEntry } from '@/clients/CapEventPackage';
import { Account } from '@/clients/ReferenceData';

export type LineItemRow = {
  id: string;
  amount: number;
  inheritedFundGroupLineItemId?: string;
  investment: string;
  allocationBasis: string;
  prDate?: Date;
  prFlag?: string;
  mgmtFee?: boolean;
  batchNo?: number;
  originAccountKey?: string;
} & Account;

export type AllocationPreviewTableProps = {
  rows: InvestorEntry[];
  testId?: string;
  isLoading?: boolean;
  allocationBasis: string;
};

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
