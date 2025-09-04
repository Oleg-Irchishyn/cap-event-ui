import axios from 'axios';

export const JAVA_BASE_URL = 'api/v1';

export const CapEventPackageServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOSTNAME}/${JAVA_BASE_URL}/cap-event-package`,
});

export const FundsPackageServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOSTNAME}/${JAVA_BASE_URL}/reference-data`,
});

export const TemplateLibraryServer = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_HOSTNAME}/${JAVA_BASE_URL}/template-library`,
});
