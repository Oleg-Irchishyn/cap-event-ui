import { Accounts } from '@/api/referenceData';

export type LineItemRow = {
  id: string;
  amount: number;
} & Omit<Accounts, 'accountNo'>;
