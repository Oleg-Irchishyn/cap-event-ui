import { Account } from '@/clients/ReferenceData';

export type LineItemRow = {
  id: string;
  amount: number;
  inheritedId?: string;
  investment: string;
  allocationBasis: string;
  prDate?: Date;
  prFlag?: string;
} & Account;

export type AllocationPreviewTableProps = {
  rows: AllocationPreviewTableData[];
  testId?: string;
  isLoading?: boolean;
};

export type AllocationPreviewTableData = {
  optOut: boolean;
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
