import { ReferenceDataServer } from '@/api/java';

export interface FundGroups {
  id: number;
  fundGroupId: number;
  fundGroupName: string;
}

export const getFundGroups = async () => {
  try {
    const { data } = await ReferenceDataServer.get<FundGroups[]>('/fund-groups');
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting fund groups`);
    }
  }

  return null;
};

export interface Funds {
  id: number;
  fundId: string;
  fundGroupId: string;
  fundName: string;
}

export const getFunds = async (fundGroupId: number) => {
  try {
    const { data } = await ReferenceDataServer.get<Funds[]>('/funds', {
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

export interface Accounts {
  accountNo: string;
  capitalCategory: string;
  callDistributionReason: string;
  defaultDescription: string;
  insideCommitment: string;
}

export const getAccounts = async (
  sponsorId: string,
  fsGrouping = 'Capital',
  capitalCategory = 'Cont-Management-fees',
) => {
  try {
    const { data } = await ReferenceDataServer.get<Accounts[]>('/accounts', {
      params: { sponsorId, fsGrouping, capitalCategory },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting accounts`);
    }
  }

  return null;
};
