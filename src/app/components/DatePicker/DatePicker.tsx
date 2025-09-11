import React, { FC } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateValidationError, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { theme } from '@/ui/globalStyles';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { FieldLabel, Wrapper } from '@/app/components/DatePicker/styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { ThemeProvider, createTheme } from '@mui/material/styles';

const defaultTheme = createTheme({
  typography: {
    fontFamily: `"IBM Plex Sans", "Arial" sans-serif`,
  },
});

type DatePickerStyleProps = {
  width?: number;
  minWidth?: string;
  maxWidth?: string;
  inputHeight?: string;
  inputWidth?: string;
  inputPadding?: string;
  inputFontWeight?: string;
  labelColor?: string;
  labelMargin?: string;
  margin?: string;
  borderColor?: string;
  backgroundColor?: string;
};

type DatePickerProps = DatePickerStyleProps & {
  isDisabled?: boolean;
  defaultValue?: PickerValue;
  onChange: (value: PickerValue) => void;
  minDate?: Dayjs;
  setIsValidDate?: (value: boolean) => void;
  maxDate?: Dayjs;
  label?: string;
  testId: string;
  pickerIcon?: () => React.ReactNode;
  format?: string;
};

export const DatePicker: FC<DatePickerProps> = ({
  label,
  isDisabled = false,
  defaultValue,
  onChange = () => {},
  minDate = dayjs(),
  setIsValidDate = () => {},
  maxDate,
  testId,
  pickerIcon,
  format,
  ...styleProps
}) => {
  const {
    width = '100%',
    inputHeight = '32px',
    inputWidth = 'auto',
    inputPadding = '0 14px',
    inputFontWeight = '400',
    maxWidth = 'auto',
    minWidth = '150px',
    labelColor = theme.colors.textSecondary,
    labelMargin = '0 0 2px 0',
    margin = '0',
    borderColor = theme.colors.gray500,
    backgroundColor = theme.colors.white,
  } = styleProps;

  const onSetIsValidDate = (newError: DateValidationError) => {
    setIsValidDate(newError === null);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Wrapper data-testid={prepareDataTestId(testId, 'DatePicker', 'Wrapper')}>
        <FieldLabel
          $color={labelColor}
          $margin={labelMargin}
          data-testid={prepareDataTestId(testId, 'DatePicker', 'Label')}
        >
          {label}
        </FieldLabel>

        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            onChange={onChange}
            minDate={minDate}
            maxDate={maxDate}
            value={defaultValue}
            disabled={isDisabled}
            format={format}
            slots={{ openPickerIcon: pickerIcon }}
            slotProps={{
              textField: {
                InputProps: {
                  sx: {
                    height: inputHeight,
                    fontSize: '14px',
                    color: theme.colors.textPrimary,
                    fontWeight: inputFontWeight,
                    width: inputWidth,
                    padding: inputPadding,
                    backgroundColor,
                  },
                },
                sx: {
                  width,
                  minWidth,
                  maxWidth,
                  margin,
                  '& fieldset': {
                    borderColor: borderColor,
                    borderWidth: '1px',
                  },
                  '& .MuiInputAdornment-root': {
                    marginLeft: 0,
                  },
                  '& button': {
                    padding: '3px',
                  },
                },
              },
            }}
            onError={onSetIsValidDate}
          />
        </LocalizationProvider>
      </Wrapper>
    </ThemeProvider>
  );
};
