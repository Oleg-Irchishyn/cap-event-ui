import { FC, useEffect, useState } from 'react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import DatePicker from '@/app/components/DatePicker';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { parseValidDate } from '@/utils/datePickerUtils';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DATE_TYPES } from '@/const/dateTypes';
import { theme } from '@/ui/globalStyles';
import { datePickerStyles } from './style';
import { DetailsDateProps } from './types';

const DetailsDate: FC<DetailsDateProps> = ({ entityLabel, dateType, testId, onDateChange }) => {
  const entityNoticeDate = entityDatesStore.getEntityNoticeDate(entityLabel);
  const entityDueDate = entityDatesStore.getEntityDueDate(entityLabel);

  const currentDate = dateType === DATE_TYPES.NOTICE ? entityNoticeDate : entityDueDate;

  const defaultTestId = `details-${dateType}-date`;
  const finalTestId = testId || defaultTestId;

  const pickerIcon = () => (
    <Image src="/cap-event/icons/calendar-black.svg" width={20} height={20} alt="calendar" />
  );

  useEffect(() => {
    if (dateType === DATE_TYPES.NOTICE && entityDatesStore.noticeDate) {
      const currentEntityDate = entityDatesStore.getEntityNoticeDate(entityLabel);
      if (
        !currentEntityDate ||
        currentEntityDate.getTime() !== entityDatesStore.noticeDate.getTime()
      ) {
        entityDatesStore.setEntityNoticeDate(entityLabel, entityDatesStore.noticeDate);
        entityDatesStore.calculateAndSetEntityDueDate(
          entityLabel,
          capEventSettingsStore.fundEntities,
        );
      }
    }
  }, [entityLabel, dateType]);

  const [inputValue, setInputValue] = useState<PickerValue>(
    currentDate ? dayjs(currentDate) : null,
  );

  const [isValid, setIsValid] = useState(true);
  const handleValidityChange = (valid: boolean) => {
    setIsValid(valid);
    if (dateType === DATE_TYPES.DUE) {
      entityDatesStore.setEntityDueDateInputValidity(entityLabel, valid);
    }
    if (dateType === DATE_TYPES.NOTICE) {
      entityDatesStore.setEntityNoticeDateInputValidity(entityLabel, valid);
    }
  };

  useEffect(() => {
    setInputValue(currentDate ? dayjs(currentDate) : null);
  }, [currentDate]);

  const handleDateChange = (value: PickerValue) => {
    setInputValue(value);
    const parsedDate = parseValidDate(value);
    if (value === null) {
      if (dateType === DATE_TYPES.NOTICE) {
        entityDatesStore.setEntityNoticeDate(entityLabel, null);
      } else {
        entityDatesStore.setEntityDueDateManually(entityLabel, null);
      }
      if (onDateChange) onDateChange(null as unknown as Date);
      return;
    }

    if (parsedDate === null) {
      return;
    }

    const date = parsedDate;

    if (dateType === DATE_TYPES.NOTICE) {
      entityDatesStore.setEntityNoticeDate(entityLabel, date);
      entityDatesStore.calculateAndSetEntityDueDate(
        entityLabel,
        capEventSettingsStore.fundEntities,
      );
      entityDatesStore.setDifferentDatesState();
    } else {
      entityDatesStore.setEntityDueDateManually(entityLabel, date);
      capEventSettingsStore.updateEntityLineItemPRDate(entityLabel, date);
    }

    if (onDateChange) {
      onDateChange(date);
    }
    setInputValue(dayjs(date));
  };

  const getMaxDate = () => {
    if (dateType === DATE_TYPES.NOTICE) {
      return dayjs().add(1, 'months');
    }
    if (dateType === DATE_TYPES.DUE) {
      return entityNoticeDate ? dayjs(entityNoticeDate).add(1, 'months') : undefined;
    }
  };

  const getMinDate = () => {
    if (dateType === DATE_TYPES.DUE) {
      return entityNoticeDate ? dayjs(entityNoticeDate) : dayjs();
    }
  };

  const getLabel = () => {
    return dateType === DATE_TYPES.NOTICE ? 'Notice Date' : 'Due Date';
  };

  const defaultValue = inputValue;

  return (
    <DatePicker
      label={getLabel()}
      onChange={handleDateChange}
      defaultValue={defaultValue}
      setIsValidDate={handleValidityChange}
      minDate={getMinDate()}
      maxDate={getMaxDate()}
      testId={finalTestId}
      pickerIcon={pickerIcon}
      {...datePickerStyles}
      inputColor={isValid ? theme.colors.textPrimary : theme.colors.error}
      maxWidth={defaultValue === null ? '115px' : datePickerStyles.maxWidth}
    />
  );
};

export default observer(DetailsDate);
