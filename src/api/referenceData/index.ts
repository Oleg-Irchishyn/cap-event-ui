import { ReferenceDataServer } from '@/api/java';

export interface FundGroups {
  id: string;
  name: string;
}

export const getFundGroups = async (sponsorId: string) => {
  try {
    const { data } = await ReferenceDataServer.get<FundGroups[]>('/fund-groups/search', {
      params: {
        sponsorId,
      },
    });
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting fund groups`);
    }
  }

  return null;
};

export interface FundEntities {
  id: string;
  name: string;
}

export const getEntities = async (
  fundGroupId: string,
  statuses = ['ACTIVE'],
  typesToExclude = ['ADMIN', 'ELIMINATION'],
) => {
  try {
    const { data } = await ReferenceDataServer.get<FundEntities[]>(
      `/fund-groups/${fundGroupId}/entities`,
      {
        params: {
          fundGroupId,
          statuses: statuses.join(','),
          typesToExclude: typesToExclude.join(','),
        },
      },
    );
    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`${error.message}. Error getting entities`);
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
