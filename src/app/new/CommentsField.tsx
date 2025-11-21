import BackgroundContainer from '@/app/components/BackgroundContainer';
import {
  Counter,
  TextArea,
  TextAreaContainer,
  TextAreaLabel,
  TextAreaWrapper,
  Title,
  Wrapper,
} from '@/app/new/styles';
import { capEventSettingsStore } from '@/stores';
import { observer } from 'mobx-react-lite';
import { useState } from 'react';

const MAX_SYMBOLS_COUNT = 1200;

const CommentsField = () => {
  const [value, setValue] = useState(capEventSettingsStore.comment ?? '');

  const onHandleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const v = e.target.value;
    setValue(v);
    capEventSettingsStore.setComment(v);
  };

  return (
    <BackgroundContainer testId="comments-background">
      <Wrapper data-testid="comments-wrapper">
        <Title>Comments</Title>
        <TextAreaWrapper>
          <TextAreaLabel>Comment Text Area</TextAreaLabel>
          <TextAreaContainer>
            <Counter>
              {value.length} of {MAX_SYMBOLS_COUNT}
            </Counter>
            <TextArea
              name="comment"
              rows={5}
              value={value}
              placeholder="Enter text"
              maxLength={MAX_SYMBOLS_COUNT}
              style={{ maxHeight: '250px' }}
              onChange={onHandleChange}
            />
          </TextAreaContainer>
        </TextAreaWrapper>
      </Wrapper>
    </BackgroundContainer>
  );
};

export default observer(CommentsField);
