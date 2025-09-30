export interface EntityCapitalDetailsPanelProps {
  entityLabel: string;
  entityName?: string;
  testId?: string;
  entityId?: string;
}

export interface DetailsReadOnlyInfoProps {
  title: string;
  description: string;
  testId?: string;
  entityId?: string;
}

type DateType = 'notice' | 'due';

export interface DetailsDateProps {
  entityLabel: string;
  dateType: DateType;
  testId?: string;
  onDateChange?: (date: Date) => void;
}
