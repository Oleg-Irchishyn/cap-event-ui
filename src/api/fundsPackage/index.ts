import { FundsPackageServer } from '@/api/java';

export interface FundGroups {
  id: number;
  fundGroupId: number;
  fundGroupName: string;
}

export interface Funds {
  id: number;
  fundId: string;
  fundGroupId: string;
  fundName: string;
}

export const getFundGroups = async () => {
  try {
    const { data } = await FundsPackageServer.get<FundGroups[]>('/fund-groups');
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting fund groups`);
    }
  }

  return null;
};

export const getFunds = async (fundGroupId: number) => {
  try {
    const { data } = await FundsPackageServer.get<Funds[]>('/funds', {
      params: { fundGroupId },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting funds`);
    }
  }

  return null;
};
