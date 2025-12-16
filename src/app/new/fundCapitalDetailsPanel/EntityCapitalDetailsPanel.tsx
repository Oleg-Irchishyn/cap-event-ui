import { FC } from 'react';
import { observer } from 'mobx-react-lite';
import DetailsEntityName from '@/app/new/fundCapitalDetailsPanel/DetailsEntityName';
import DetailsDate from '@/app/new/fundCapitalDetailsPanel/DetailsDate';
import { EntityCapitalDetailsPanelProps } from './types';
import { PanelContainer } from './style';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import ManagementFeeDetails from '@/app/new/fundCapitalDetailsPanel/ManagementFeeDetails';

const EntityCapitalDetailsPanel: FC<EntityCapitalDetailsPanelProps> = ({
  entityLabel,
  entityName,
  testId = 'panel-container',
  entityId = '',
}) => {
  return (
    <PanelContainer data-testid={prepareDataTestId(testId)}>
      <DetailsEntityName title={entityLabel ?? entityName} entityId={entityId} />
      <DetailsDate entityLabel={entityLabel} dateType="notice" testId={`${testId}-notice-date`} />
      <DetailsDate entityLabel={entityLabel} dateType="due" testId={`${testId}-due-date`} />
      <ManagementFeeDetails entityId={entityId} entityLabel={entityLabel} />
    </PanelContainer>
  );
};

export default observer(EntityCapitalDetailsPanel);
