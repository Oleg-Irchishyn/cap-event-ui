import { Account } from '@/clients/ReferenceData';

export type LineItemRow = {
  id: string;
  amount: number;
} & Omit<Account, 'accountNo'>;
