import { ICellRendererParams } from 'ag-grid-community';
import React, { KeyboardEventHandler, useEffect, useState, FC } from 'react';
import { AmountInput } from '@/app/new/LineItems/styles';
import { formatNumberToAmount } from '@/utils/formatNumberToAmount';

export const AmountCell: FC<ICellRendererParams> = (props) => {
  const [inputValue, setInputValue] = useState('');

  // Check if we're in editor mode by looking for editor-specific props
  const isEditorMode = !!(props.api && props.node);

  const isCellEditable =
    typeof props.colDef?.cellRendererParams === 'function'
      ? props.colDef?.cellRendererParams(props)
      : true;

  const formatValue = (value: number | string) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return '';
    if (numValue === null) return '';
    if (numValue === 0) return '';

    const formValue = formatNumberToAmount(numValue);

    return `$${formValue}`;
  };

  useEffect(() => {
    if (props.value !== undefined) {
      setInputValue(formatValue(props.value));
    }
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const cleanValue = e.target.value;
    // Allow empty string, negative sign, decimal point, and valid number patterns
    if (cleanValue === '' || cleanValue === '-' || /^-?\d*\.?\d{0,2}$/.test(cleanValue)) {
      setInputValue(cleanValue);
    }
  };

  const handleFocus = () => {
    const value = inputValue[0] === '$' ? inputValue.slice(1) : inputValue;
    const numValue = parseFloat(value.replace(/,/g, ''));
    // Only convert to number string if it's a valid number, otherwise keep the raw input
    if (!isNaN(numValue)) {
      setInputValue(numValue.toString());
    } else {
      // Keep the raw input for cases like "-" or incomplete numbers
      setInputValue(value);
    }
  };

  const handleBlur = () => {
    const value = inputValue[0] === '$' ? inputValue.slice(1) : inputValue;
    const numValue = parseFloat(value.replace(/,/g, ''));

    if (value === '' || value === '-' || isNaN(numValue)) {
      // Show empty string to display placeholder instead of $0.00
      setInputValue('');
      if (props.setValue && !isEditorMode) {
        props.setValue(0);
      }
    } else {
      setInputValue(formatValue(numValue));
      if (props.setValue && isEditorMode) {
        props.setValue(numValue);
      }
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      handleBlur();
    }
  };

  return (
    <AmountInput
      disabled={!isCellEditable}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      type="text"
      name="amount-input"
      value={inputValue}
      onChange={handleChange}
      placeholder="Enter Amount"
      autoComplete="off"
    />
  );
};
