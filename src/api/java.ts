import axios from 'axios';

export const JAVA_BASE_URL = 'api/v1';

export const CapEventPackageServer = axios.create({
  baseURL: `capeventpackage/${JAVA_BASE_URL}`,
});

export const TemplateLibraryServer = axios.create({
  baseURL: `template-library/${JAVA_BASE_URL}`,
});
