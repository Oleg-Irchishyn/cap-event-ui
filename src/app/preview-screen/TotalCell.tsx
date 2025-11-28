import { ICellRendererParams } from 'ag-grid-community';
import { formatValue } from '@/app/new/LineItems/utils';
import styled from 'styled-components';
import { Property } from 'csstype';
import { FC } from 'react';

const TotalRowCell = styled.div<{ $textAlign?: Property.TextAlign }>(({ $textAlign }) => ({
  fontWeight: '700',
  textAlign: $textAlign ?? 'right',
  letterSpacing: '-0.1px',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
}));

type Props = ICellRendererParams & { textAlign?: Property.TextAlign };

export const TotalCell: FC<Props> = (props) => {
  const value = props.value ?? 0;
  const numValue = typeof value === 'string' ? parseFloat(value) : value;
  if (numValue === 0) return <TotalRowCell>{formatValue(0, true)}</TotalRowCell>;

  if (typeof value === 'number') {
    return <TotalRowCell data-testid="total-row-amount">{formatValue(props.value)}</TotalRowCell>;
  }
  if (typeof value === 'string') {
    return (
      <TotalRowCell data-testid="total-row-amount" $textAlign={props.textAlign}>
        {props.value}
      </TotalRowCell>
    );
  }
};
