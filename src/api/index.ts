import { ReferenceDataClient } from '@/clients/ReferenceData';
import { CapEventPackageClient } from '@/clients/CapEventPackage';
import { TemplateLibraryClient } from '@/clients/TemplateLibrary';
import { BoxConnectorClient } from '@/clients/BoxConnector';
import { getSessionIdFromUrl } from '@/utils/getSessionIdFromUrl';
import { getAccessTokenWithRefresh } from '@/utils/tokenStorage';

const createHeadersWithSessionId = async (): Promise<Record<string, string>> => {
  const sessionId = getSessionIdFromUrl();
  const bearerToken = await getAccessTokenWithRefresh();
  const headers: Record<string, string> = {};

  if (sessionId) {
    headers['Session-Id'] = sessionId;
  }

  if (bearerToken) {
    headers['Authorization'] = `Bearer ${bearerToken}`;
  }

  return headers;
};

export const CapEventPackageApi = new CapEventPackageClient({
  BASE: `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_CAP_EVENT_PACKAGE_API}`,
  HEADERS: createHeadersWithSessionId,
});

export const ReferenceDataApi = new ReferenceDataClient({
  BASE: `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_REFERENCE_DATA_API}`,
  HEADERS: createHeadersWithSessionId,
});

export const TemplateLibraryApi = new TemplateLibraryClient({
  BASE: `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_TEMPLATE_LIBRARY_API}`,
  HEADERS: createHeadersWithSessionId,
});

export const BoxConnectorApi = new BoxConnectorClient({
  BASE: `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_BOX_CONNECTOR_API}`,
  HEADERS: createHeadersWithSessionId,
});
