import React, { FC, useRef, useState } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateValidationError, DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { theme } from '@/ui/globalStyles';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { FieldLabel, IconWrapper, Wrapper } from '@/app/components/DatePicker/styles';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Image from 'next/image';
import Tooltip from '@/app/components/Tooltip';

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
  inputColor?: string;
  inputFontWeight?: string;
  labelColor?: string;
  labelMargin?: string;
  margin?: string;
  borderColor?: string;
  backgroundColor?: string;
  disabledColor?: string;
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
  compact?: boolean;
  warningMessage?: string;
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
  compact = false,
  warningMessage,
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
    inputColor = theme.colors.textPrimary,
    borderColor = theme.colors.gray500,
    backgroundColor = theme.colors.white,
    disabledColor = theme.colors.textSecondary,
  } = styleProps;
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);

  const onSetIsValidDate = (newError: DateValidationError) => {
    // Treat any validation error, including 'invalidDate', as invalid input.
    setIsValidDate(!newError);
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Wrapper
        data-testid={prepareDataTestId(testId, 'DatePicker', 'Wrapper')}
        style={{ width: compact ? '100%' : '' }}
      >
        <FieldLabel
          $color={labelColor}
          $margin={labelMargin}
          data-testid={prepareDataTestId(testId, 'DatePicker', 'Label')}
        >
          {label}
          {warningMessage && (
            <IconWrapper
              ref={tooltipRef}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
            >
              <Tooltip
                showTooltip={showTooltip}
                tooltipMessage={warningMessage}
                targetRef={tooltipRef}
                position="center"
              />
              <Image src={'/cap-event/icons/warning.svg'} alt="warning" width={16} height={16} />
            </IconWrapper>
          )}
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
                    color: inputColor,
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
                  '& .MuiPickersSectionList-root': {
                    padding: '5px 0',
                    width: compact ? '100%' : '',
                  },
                  '& .MuiPickersInputBase-root': {
                    alignItems: compact ? 'baseline' : '',
                  },
                  '&.Mui-disabled': {
                    color: disabledColor,
                    WebkitTextFillColor: disabledColor,
                  },
                  '& button': {
                    padding: '0 8px',
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
