import { ICellRendererParams } from 'ag-grid-community';
import { formatValue } from '@/app/new/LineItems/utils';
import styled from 'styled-components';

const TotalRowAmountValue = styled.div`
  font-weight: 700;
  text-align: right;
  letter-spacing: -0.1px;
`;

export const TotalRowAmountCell = (props: ICellRendererParams) => {
  const value = props.value ?? 0;
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numValue === 0) return <TotalRowAmountValue>{formatValue(0, true)}</TotalRowAmountValue>;
  return (
    <TotalRowAmountValue data-testid="total-row-amount">
      {formatValue(numValue)}
    </TotalRowAmountValue>
  );
};
