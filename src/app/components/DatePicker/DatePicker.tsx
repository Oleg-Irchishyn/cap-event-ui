import React, { FC } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { FieldLabel, Wrapper } from '@/app/components/DatePicker/styles';
import Image from 'next/image';

type DatePickerProps = {
  width?: number;
  isDisabled?: boolean;
  defaultValue?: PickerValue;
  onChange: (value: PickerValue) => void;
  minDate?: Dayjs;
  setIsValidDate?: (value: boolean) => void;
  maxDate?: Dayjs;
  label?: string;
};

export const DatePicker: FC<DatePickerProps> = ({
  label,
  width = '100%',
  isDisabled = false,
  defaultValue,
  onChange = () => {},
  minDate = dayjs(),
  setIsValidDate = () => {},
  maxDate = dayjs().add(11, 'years'),
}) => (
  <Wrapper>
    <FieldLabel>{label}</FieldLabel>

    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DesktopDatePicker
        onChange={onChange}
        minDate={minDate}
        maxDate={maxDate}
        value={defaultValue}
        disabled={isDisabled}
        slots={{
          openPickerIcon: () => (
            <Image src="/icons/calendar.svg" width={15} height={15} alt="calendar" />
          ),
        }}
        slotProps={{
          textField: {
            size: 'small',
            sx: {
              width,
              minWidth: '150px',
            },
          },
        }}
        onError={(newError) => setIsValidDate(newError === null)}
      />
    </LocalizationProvider>
  </Wrapper>
);
