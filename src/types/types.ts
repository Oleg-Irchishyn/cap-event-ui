import { FundGroups } from '@/api/referenceData';

export type FundGroupItem = Omit<FundGroups, 'id'>;
