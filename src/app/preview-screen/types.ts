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
  commitment?: number;
  isAggregated?: boolean;
};

interface PreviewScreenTableProps {
  rows: PreviewScreenRow[];
  testId?: string;
  isLoading?: boolean;
  onRowClicked?: (e: RowClickedEvent) => void;
}

type SubTotalTableRow = Pick<
  PreviewScreenRow,
  'id' | 'entityName' | 'allocatedAmount' | 'commitment'
>;

export type { PreviewScreenRow, PreviewScreenTableProps, SubTotalTableRow };
