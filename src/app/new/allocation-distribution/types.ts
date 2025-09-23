type DistributionRow = {
  id?: string;
  investor: string;
  entityId: string;
  entityName: string;
  description: string;
  investmentTitle?: string;
  investmentName?: string;
  allocatedAmount: number;
};

interface DistributionTableProps {
  rows: DistributionRow[];
  testId?: string;
  isLoading?: boolean;
}

interface DistributionJsonUploadButtonProps {
  isLoading: boolean;
  payload: string;
  handleUpload: () => Promise<void>;
  testId?: string;
}

interface DistributionJsonParseFieldProps {
  payload: string;
  onSetPayload: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  testId?: string;
}

export type {
  DistributionJsonParseFieldProps,
  DistributionJsonUploadButtonProps,
  DistributionRow,
  DistributionTableProps,
};
