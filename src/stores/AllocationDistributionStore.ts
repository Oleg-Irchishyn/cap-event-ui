import { makeAutoObservable } from 'mobx';
import axios from 'axios';
import { CapEventPackageApi, BoxConnectorApi } from '@/api';
import { CapEventProcessRequest } from '@/clients/CapEventPackage';
import { parseToDistributionRows } from '@/utils/parseToDistributionRows';
import type { DistributionRow } from '@/app/allocation-distribution/types';
import { ToastApi } from '@/providers/types';

class AllocationDistributionStore {
  rows: DistributionRow[] = [];
  isLoading = false;

  constructor() {
    makeAutoObservable(this);
  }

  async processPayload(payload: string, toast?: ToastApi): Promise<DistributionRow[]> {
    try {
      let requestPayload: CapEventProcessRequest;
      try {
        requestPayload = JSON.parse(payload) as CapEventProcessRequest;
      } catch {
        const msg = 'Invalid JSON';
        toast?.error?.(msg);
        return [];
      }

      this.isLoading = true;
      this.rows = [];
      const response = await CapEventPackageApi.default.process(requestPayload);
      const parsed = parseToDistributionRows(response);
      this.rows = parsed;
      return parsed;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      toast?.error?.(message);
      this.rows = [];
      return [];
    } finally {
      this.isLoading = false;
    }
  }

  async fetchDoc(ceBoxFileId: string, toast?: ToastApi): Promise<Blob | undefined> {
    try {
      if (!ceBoxFileId) return;
      const base = BoxConnectorApi.request.config.BASE ?? '';
      const url = `${base}/files/${encodeURIComponent(ceBoxFileId)}/content`;
      const resp = await axios.get(url, {
        responseType: 'blob',
        headers: { Accept: 'application/octet-stream' },
        withCredentials: BoxConnectorApi.request.config.WITH_CREDENTIALS ?? false,
      });
      return resp.data as Blob;
    } catch {
      toast?.error?.('Failed to fetch Box file content');
      return;
    }
  }
}

export const allocationDistributionStore = new AllocationDistributionStore();
