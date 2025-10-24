import { ICellRendererParams, EditableCallbackParams } from 'ag-grid-community';
import React, { KeyboardEventHandler, useEffect, useState, FC, useMemo } from 'react';
import { AmountInput } from '@/app/new/LineItems/styles';
import { formatValue } from '@/app/new/LineItems/utils';

export const AmountCell: FC<ICellRendererParams> = (props) => {
  const [inputValue, setInputValue] = useState('');

  const isCellEditable = useMemo(
    () =>
      typeof props.colDef?.editable === 'function'
        ? props.colDef?.editable(props as EditableCallbackParams)
        : true,
    [props],
  );

  useEffect(() => {
    if (props.value !== undefined) {
      const formattedValue = formatValue(props.value);
      setInputValue(formattedValue);
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
    // Handle both $123 and ($123) formats
    let value = inputValue;
    if (inputValue.startsWith('$')) {
      value = inputValue.slice(1);
    } else if (inputValue.startsWith('($') && inputValue.endsWith(')')) {
      value = '-' + inputValue.slice(2, -1);
    }

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
    // Handle both $123 and ($123) formats
    let value = inputValue;
    if (inputValue.startsWith('$')) {
      value = inputValue.slice(1);
    } else if (inputValue.startsWith('($') && inputValue.endsWith(')')) {
      value = '-' + inputValue.slice(2, -1);
    }

    const numValue = parseFloat(value.replace(/,/g, ''));

    if (value === '' || value === '-' || isNaN(numValue)) {
      // Show empty string to display placeholder instead of $0.00
      setInputValue('');
      if (props.setValue) {
        props.setValue(0);
      }
    } else {
      setInputValue(formatValue(numValue));
      if (props.setValue) {
        props.setValue(numValue);
      }
    }
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
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
