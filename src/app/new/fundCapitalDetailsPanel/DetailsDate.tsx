import { FC, useEffect } from 'react';
import dayjs from 'dayjs';
import { observer } from 'mobx-react-lite';
import Image from 'next/image';
import DatePicker from '@/app/components/DatePicker';
import { capEventSettingsStore, entityDatesStore } from '@/stores';
import { parseValidDate } from '@/utils/datePickerUtils';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { DATE_TYPES } from '@/const/dateTypes';
import { datePickerStyles } from './style';
import { DetailsDateProps } from './types';

const DetailsDate: FC<DetailsDateProps> = ({ entityLabel, dateType, testId, onDateChange }) => {
  const entityNoticeDate = entityDatesStore.getEntityNoticeDate(entityLabel);
  const entityDueDate = entityDatesStore.getEntityDueDate(entityLabel);

  const currentDate = dateType === DATE_TYPES.NOTICE ? entityNoticeDate : entityDueDate;

  const defaultTestId = `details-${dateType}-date`;
  const finalTestId = testId || defaultTestId;

  const pickerIcon = () => (
    <Image src="icons/calendar-black.svg" width={20} height={20} alt="calendar" />
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

  const handleDateChange = (value: PickerValue) => {
    const parsedDate = parseValidDate(value);
    if (parsedDate === null) {
      if (value === null) {
        if (dateType === DATE_TYPES.NOTICE) {
          entityDatesStore.setEntityNoticeDate(entityLabel, null);
        } else {
          entityDatesStore.setEntityDueDateManually(entityLabel, null);
        }
        if (onDateChange) onDateChange(null as unknown as Date);
      }
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

  const defaultValue = currentDate ? dayjs(currentDate) : null;

  return (
    <DatePicker
      label={getLabel()}
      onChange={handleDateChange}
      defaultValue={defaultValue}
      minDate={getMinDate()}
      maxDate={getMaxDate()}
      testId={finalTestId}
      pickerIcon={pickerIcon}
      {...datePickerStyles}
      maxWidth={defaultValue === null ? '115px' : datePickerStyles.maxWidth}
    />
  );
};

export default observer(DetailsDate);
