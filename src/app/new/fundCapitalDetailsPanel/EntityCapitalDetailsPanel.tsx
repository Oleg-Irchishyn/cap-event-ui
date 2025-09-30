import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import DetailsReadOnlyInfo from '@/app/new/fundCapitalDetailsPanel/DetailsReadOnlyInfo';
import DetailsDate from '@/app/new/fundCapitalDetailsPanel/DetailsDate';
import { EntityCapitalDetailsPanelProps } from './types';
import { PanelContainer } from './style';
import { prepareDataTestId } from '@/utils/prepareDataTestId';

const EntityCapitalDetailsPanel: FC<EntityCapitalDetailsPanelProps> = ({
  entityLabel,
  entityName,
  testId = 'panel-container',
  entityId = '',
}) => {
  return (
    <PanelContainer data-testid={prepareDataTestId(testId)}>
      <DetailsReadOnlyInfo
        title="Entity"
        description={entityLabel ?? entityName}
        entityId={entityId}
      />
      <DetailsDate entityLabel={entityLabel} dateType="notice" testId={`${testId}-notice-date`} />
      <DetailsDate entityLabel={entityLabel} dateType="due" testId={`${testId}-due-date`} />
    </PanelContainer>
  );
};

export default observer(EntityCapitalDetailsPanel);
