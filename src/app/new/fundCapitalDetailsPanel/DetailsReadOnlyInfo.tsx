import { FC } from 'react';
import { DetailsReadOnlyInfoProps } from './types';
import { PanelItem, PanelItemDescription, PanelItemTitle } from './style';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

const DetailsReadOnlyInfo: FC<DetailsReadOnlyInfoProps> = ({
  title,
  description,
  testId = 'details-read-only-info',
}) => {
  return (
    <PanelItem data-testid={prepareDataTestId(testId)}>
      <PanelItemTitle>{title}</PanelItemTitle>
      <PanelItemDescription> {description}</PanelItemDescription>
    </PanelItem>
  );
};

export default DetailsReadOnlyInfo;
