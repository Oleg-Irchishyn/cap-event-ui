import { PickerValue } from '@mui/x-date-pickers/internals';
import dayjs from 'dayjs';

export const parseValidDate = (value: PickerValue): Date | null => {
  if (value === null) return null;
  const parsed = dayjs(value);
  if (!parsed.isValid()) return null;
  return parsed.toDate();
};
