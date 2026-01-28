import axios, { AxiosInstance, AxiosRequestHeaders } from 'axios';
import * as CapEventPackage from '@/clients/CapEventPackage';
import * as ReferenceData from '@/clients/ReferenceData';
import { getSessionIdFromUrl } from '@/utils/getSessionIdFromUrl';
import { getAccessTokenWithRefresh } from '@/utils/tokenStorage';

const createHeadersWithSessionId = async (): Promise<Record<string, string>> => {
  const sessionId = getSessionIdFromUrl();
  const bearerToken = await getAccessTokenWithRefresh();
  const headers: Record<string, string> = {};

  if (sessionId) headers['Session-Id'] = sessionId;
  if (bearerToken) headers['Authorization'] = `Bearer ${bearerToken}`;

  return headers;
};

const createAxios = (baseURL: string): AxiosInstance => {
  const instance = axios.create({ baseURL });
  instance.interceptors.request.use(async (config) => {
    const extra = await createHeadersWithSessionId();
    // AxiosRequestHeaders is not a plain index signature, so spread carefully
    const current = config.headers ?? {};
    config.headers = { ...current, ...extra } as AxiosRequestHeaders;
    return config;
  });
  return instance;
};

// ---------- CapEventPackage ----------
const capEventBase = `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_CAP_EVENT_PACKAGE_API}`;
const capEventAxios = createAxios(capEventBase);
const capEventConfig = new CapEventPackage.Configuration({ basePath: capEventBase });
const capEventDefault = new CapEventPackage.DefaultApi(capEventConfig, capEventBase, capEventAxios);

export const CapEventPackageApi = {
  default: capEventDefault,
  request: {
    config: {
      BASE: capEventBase,
      WITH_CREDENTIALS: false,
    },
  },
};

// ---------- ReferenceData ----------
const refBase = `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_REFERENCE_DATA_API}`;
const refAxios = createAxios(refBase);
const refConfig = new ReferenceData.Configuration({ basePath: refBase });

export const ReferenceDataApi = {
  accounts: new ReferenceData.AccountsApi(refConfig, refBase, refAxios),
  allocationBases: new ReferenceData.AllocationBasesApi(refConfig, refBase, refAxios),
  entities: new ReferenceData.EntitiesApi(refConfig, refBase, refAxios),
  fundGroups: new ReferenceData.FundGroupsApi(refConfig, refBase, refAxios),
  investments: new ReferenceData.InvestmentsApi(refConfig, refBase, refAxios),
  sponsors: new ReferenceData.SponsorsApi(refConfig, refBase, refAxios),
};
