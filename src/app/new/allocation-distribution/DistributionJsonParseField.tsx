import {
  TextAreaWrapper,
  TextAreaLabel,
  TextAreaContainer,
  TextArea,
  Counter,
} from '@/app/new/styles';
import { FC } from 'react';
import { prepareDataTestId } from '@/utils/prepareDataTestId';
import { DistributionJsonParseFieldProps } from './types';

const MAX_LENGTH = 20000;

const DistributionJsonParseField: FC<DistributionJsonParseFieldProps> = ({
  payload,
  onSetPayload,
  testId = 'distribution-json-parse-field',
}) => {
  return (
    <TextAreaWrapper>
      <TextAreaLabel>Allocation Distribution JSON</TextAreaLabel>
      <TextAreaContainer>
        <Counter>
          {payload.length} of {MAX_LENGTH}
        </Counter>
        <TextArea
          data-testid={prepareDataTestId('textarea', testId)}
          name="allocation-payload"
          rows={12}
          value={payload}
          placeholder="Paste JSON here"
          maxLength={MAX_LENGTH}
          onChange={onSetPayload}
        />
      </TextAreaContainer>
    </TextAreaWrapper>
  );
};

export default DistributionJsonParseField;
