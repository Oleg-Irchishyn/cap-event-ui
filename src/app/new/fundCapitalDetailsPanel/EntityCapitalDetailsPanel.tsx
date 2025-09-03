import { FC } from 'react';
import DetailsReadOnlyInfo from '@/app/new/fundCapitalDetailsPanel/DetailsReadOnlyInfo';
import { EntityCapitalDetailsPanelProps } from './types';
import { PanelContainer } from './style';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

const EntityCapitalDetailsPanel: FC<EntityCapitalDetailsPanelProps> = ({
  entityLabel,
  entityName,
  testId = 'panel-container',
}) => {
  return (
    <PanelContainer data-testid={prepareDataTestId(testId)}>
      <DetailsReadOnlyInfo title="Entity" description={entityLabel ?? entityName} />
    </PanelContainer>
  );
};

export default EntityCapitalDetailsPanel;
