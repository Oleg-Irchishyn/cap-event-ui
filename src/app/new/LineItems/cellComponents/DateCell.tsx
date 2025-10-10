import { ICellRendererParams, EditableCallbackParams } from 'ag-grid-community';
import React, { FC, useMemo, useState, useEffect } from 'react';
import DatePicker from '@/app/components/DatePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs, { Dayjs } from 'dayjs';
import { DateCellWrapper } from '../styles';
import { parseValidDate } from '@/utils/datePickerUtils';
import Image from 'next/image';

export const DateCell: FC<ICellRendererParams> = (props) => {
  const params =
    (typeof props.colDef?.cellEditorParams === 'function'
      ? props.colDef?.cellEditorParams(props)
      : props.colDef?.cellEditorParams) || {};

  const defaultValue = dayjs(params.defaultValue);

  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(defaultValue);

  const isCellEditable = useMemo(
    () =>
      typeof props.colDef?.editable === 'function'
        ? props.colDef?.editable(props as EditableCallbackParams)
        : props.colDef?.editable,
    [props],
  );

  useEffect(() => {
    if (props.value) {
      const parsedDate = parseValidDate(props.value);
      setSelectedDate(parsedDate ? dayjs(parsedDate) : null);
    } else {
      setSelectedDate(isCellEditable ? defaultValue : null);
    }
  }, [isCellEditable, props.value]);

  const handleDateChange = (value: PickerValue) => {
    const parsedDate = parseValidDate(value);
    if (parsedDate) {
      setSelectedDate(dayjs(parsedDate));
      props.setValue?.(parsedDate);
    } else {
      setSelectedDate(isCellEditable ? defaultValue : null);
      props.setValue?.(isCellEditable ? defaultValue : null);
    }
  };

  useEffect(() => {
    handleDateChange(null);
  }, [isCellEditable]);

  const pickerIcon = () => <Image src="icons/calendar.svg" width={13} height={13} alt="calendar" />;

  return (
    <DateCellWrapper data-is-inherited={!!props.data?.inheritedId}>
      <DatePicker
        testId="date-picker-cell"
        compact
        label=""
        onChange={handleDateChange}
        defaultValue={selectedDate}
        minDate={dayjs('1900-01-01')}
        inputHeight="35px"
        inputWidth="100%"
        inputPadding="0 8px 0 8px"
        margin="0"
        minWidth="auto"
        backgroundColor="transparent"
        borderColor="transparent !important"
        pickerIcon={pickerIcon}
        isDisabled={!isCellEditable}
      />
    </DateCellWrapper>
  );
};
