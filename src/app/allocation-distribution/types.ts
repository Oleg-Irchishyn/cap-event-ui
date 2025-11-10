import { ChangeEvent } from 'react';
import { RowClickedEvent } from 'ag-grid-community';

type DistributionRow = {
  id?: string;
  investor: string;
  entityId: string;
  entityName: string;
  description: string;
  dataPoints?: string;
  investmentTitle?: string;
  investmentName?: string;
  allocatedAmount: number;
  isAggregated?: boolean;
  ceBoxFileId?: string;
};

interface DistributionTableProps {
  rows: DistributionRow[];
  testId?: string;
  isLoading?: boolean;
  onRowClicked?: (e: RowClickedEvent) => void;
}

interface DistributionJsonUploadButtonProps {
  isLoading: boolean;
  payload: string;
  handleUpload: () => Promise<void>;
  testId?: string;
}

interface DistributionJsonParseFieldProps {
  payload: string;
  onSetPayload: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  testId?: string;
}

export type {
  DistributionJsonParseFieldProps,
  DistributionJsonUploadButtonProps,
  DistributionRow,
  DistributionTableProps,
};
