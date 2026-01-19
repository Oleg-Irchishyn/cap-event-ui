import { ColDef, RowClickedEvent } from 'ag-grid-community';
import { LineItemRow } from '@/app/new/LineItems/types';

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
  lineItemId?: string;
  [key: string]: string | number | boolean | undefined;
};

interface PreviewScreenTableProps {
  rows: PreviewScreenRow[];
  testId?: string;
  isLoading?: boolean;
  onRowClicked?: (e: RowClickedEvent) => void;
  columnDefs: ColDef[];
  topGridColumnDefs: ColDef[];
  lineItems: [string, LineItemRow[]][];
}

type SubTotalTableRow = {
  id?: string;
  entityName: string;
  allocatedAmount: number;
  commitment?: number;
  isTotalRow?: boolean;
  [key: string]: string | number | boolean | undefined;
};

export type { PreviewScreenRow, PreviewScreenTableProps, SubTotalTableRow };

export const LINE_ITEMS_FIELDS = 'lineItemsFields';
export const GENERAL_INFO = 'generalInfo';
