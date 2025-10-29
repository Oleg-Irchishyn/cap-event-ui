import { FC } from 'react';
import { ICellRendererParams } from 'ag-grid-community';

import { ActionButtonsWrapper } from '../styles';

import DeleteCell from './DeleteCell';
import DuplicateRowCell from './DuplicateRowCell';
import PreviewIconCell from './PreviewIconCell';

export const ActionsCell: FC<ICellRendererParams> = (props) => {
  if (props.data?.isTotalRow) return null;

  return (
    <ActionButtonsWrapper>
      <PreviewIconCell {...props} />
      <DuplicateRowCell {...props} />
      <DeleteCell {...props} />
    </ActionButtonsWrapper>
  );
};
