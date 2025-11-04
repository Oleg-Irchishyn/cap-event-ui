import React, { FC, KeyboardEventHandler, useEffect, useState } from 'react';
import { EditableCallbackParams, ICellRendererParams } from 'ag-grid-community';

import { TextInput } from '../styles';
import { TEXT_INPUT_MAX_LENGTH } from '../const';

type TextInputCellProps = ICellRendererParams & {
  placeholder?: string;
  name?: string;
  maxLength?: number;
};

export const TextInputCell: FC<TextInputCellProps> = (props) => {
  const [inputValue, setInputValue] = useState('');

  const effectiveMaxLength = props.maxLength ?? TEXT_INPUT_MAX_LENGTH;
  const inputName = props.name ?? 'text-input-cell';
  const inputPlaceholder = props.placeholder ?? 'Enter Value';

  const isCellEditable =
    typeof props.colDef?.editable === 'function'
      ? (props.colDef?.editable as (p: EditableCallbackParams) => boolean)(
          props as unknown as EditableCallbackParams,
        )
      : !!props.colDef?.editable;

  useEffect(() => {
    setInputValue((props.value as string) || '');
  }, [props.value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const nextValue = e.target.value.trim().slice(0, effectiveMaxLength);
    setInputValue(nextValue);
  };

  const handleBlur = () => {
    const nextValue = (inputValue || '').trim().slice(0, effectiveMaxLength);
    setInputValue(nextValue);
    props.setValue?.(nextValue);
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.nativeEvent.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    }
  };

  if (props.data?.isTotalRow) return null;

  return (
    <TextInput
      disabled={!isCellEditable}
      name={inputName}
      type="text"
      value={inputValue}
      placeholder={inputPlaceholder}
      autoComplete="off"
      maxLength={effectiveMaxLength}
      onChange={handleChange}
      onDoubleClick={(e) => e.stopPropagation()}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};
