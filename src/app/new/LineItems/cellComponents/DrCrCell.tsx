import React, { FC, useMemo } from 'react';
import { ICellRendererParams } from 'ag-grid-community';
import { DrCrInput } from '@/app/new/LineItems/styles';

const DISABLED_VALUE = '-';
const DEBIT_VALUE = 'Dr';
const CREDIT_VALUE = 'Cr';

export const DrCrCell: FC<ICellRendererParams> = (props) => {
  const displayValue = useMemo(() => {
    const raw = props.value ?? props.data?.amount;
    const amount = typeof raw === 'number' ? raw : Number(raw ?? 0);

    if (!amount) return DISABLED_VALUE;
    if (amount < 0) return DEBIT_VALUE;
    if (amount > 0) return CREDIT_VALUE;
    return DISABLED_VALUE;
  }, [props.value, props.data?.amount]);

  if (props.data?.isTotalRow) return null;

  return (
    <DrCrInput
      disabled={displayValue === DISABLED_VALUE}
      readOnly
      name="dr-cr-cell"
      type="text"
      value={displayValue}
      autoComplete="off"
    />
  );
};

export default DrCrCell;
