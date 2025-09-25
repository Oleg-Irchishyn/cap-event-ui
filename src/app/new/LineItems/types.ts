import { Account } from '@/clients/ReferenceData';

export type LineItemRow = {
  id: string;
  amount: number;
  inheritedId?: string;
  investment: string;
  allocationBasis: string;
} & Omit<Account, 'accountNo'>;
