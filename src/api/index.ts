import axios from 'axios';
import { ReferenceDataClient } from '@/clients/ReferenceData';
import { CapEventPackageClient } from '@/clients/CapEventPackage';
import { TemplateLibraryClient } from '@/clients/TemplateLibrary';
import { BoxConnectorClient } from '@/clients/BoxConnector';
import { getSessionIdFromUrl } from '@/utils/getSessionIdFromUrl';

/**
 * Creates headers with Session-Id
 * Uses stored sessionId (from sessionStorage) which persists across navigation,
 * or falls back to URL query parameters for initial load
 */
const createHeadersWithSessionId = async (): Promise<Record<string, string>> => {
  const sessionId = getSessionIdFromUrl();
  const headers: Record<string, string> = {};

  if (sessionId) {
    headers['Session-Id'] = sessionId;
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

// temporary solution to retrieve sessionId as it's no longer exist in reference data openapi
export const _ReferenceDataServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_REFERENCE_DATA_API}`,
});

// Add interceptor to include Session-Id header for axios instance
_ReferenceDataServer.interceptors.request.use((config) => {
  const sessionId = getSessionIdFromUrl();
  if (sessionId) {
    config.headers = config.headers || {};
    config.headers['Session-Id'] = sessionId;
  }
  return config;
});
