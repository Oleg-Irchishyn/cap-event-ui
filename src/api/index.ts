import axios from 'axios';
import { ReferenceDataClient } from '@/clients/ReferenceData';
import { CapEventPackageClient } from '@/clients/CapEventPackage';
import { TemplateLibraryClient } from '@/clients/TemplateLibrary';

export const ReferenceDataApi = new ReferenceDataClient({
  BASE: `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_REFERENCE_DATA_API}`,
});

export const CapEventPackageApi = new CapEventPackageClient({
  BASE: `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_CAP_EVENT_PACKAGE_API}`,
});

export const TemplateLibraryApi = new TemplateLibraryClient({
  BASE: `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_TEMPLATE_LIBRARY_API}`,
});

// temporary solution to retrieve sessionId as it's no longer exist in reference data openapi
export const _ReferenceDataServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOSTNAME}${process.env.NEXT_PUBLIC_BASE_URL}${process.env.NEXT_PUBLIC_REFERENCE_DATA_API}`,
});
