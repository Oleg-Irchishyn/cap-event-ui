import { FundGroups } from '@/api/fundsPackage';

export type FundGroupItem = Omit<FundGroups, 'id'>;
