import { ICellRendererParams } from 'ag-grid-community';
import React, { FC } from 'react';
import styled from 'styled-components';

const TotalRowCategoryLabel = styled.span`
  font-weight: 700;
  padding: 0 8px;
`;

export const TotalRowCategoryCell: FC<ICellRendererParams> = (props) => {
  return <TotalRowCategoryLabel data-testid="total-row-label">{props.value}</TotalRowCategoryLabel>;
};
