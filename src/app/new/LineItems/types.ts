import { Account } from '@/clients/ReferenceData';

export type LineItemRow = {
  id: string;
  amount: number;
  inheritedId?: string;
} & Omit<Account, 'accountNo'>;
