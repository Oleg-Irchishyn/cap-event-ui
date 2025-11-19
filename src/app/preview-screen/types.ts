import { RowClickedEvent } from 'ag-grid-community';

type PreviewScreenRow = {
  id?: string;
  investor: string;
  investorId?: string;
  investorName?: string;
  classID?: string;
  additionalInvestorType?: string;
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

interface PreviewScreenTableProps {
  rows: PreviewScreenRow[];
  testId?: string;
  isLoading?: boolean;
  onRowClicked?: (e: RowClickedEvent) => void;
}

export type { PreviewScreenRow, PreviewScreenTableProps };
