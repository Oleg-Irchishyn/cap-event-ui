import { useState } from 'react';
import {
  Title,
  Wrapper,
  TextAreaWrapper,
  TextAreaLabel,
  TextArea,
  Counter,
  TextAreaContainer,
} from '@/app/new/styles';
import BackgroundContainer from '@/app/components/BackgroundContainer';

const MAX_SYMBOLS_COUNT = 1200;

const CommentsField = () => {
  const [value, setValue] = useState('');

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
              onChange={(e) => setValue(e.target.value)}
            />
          </TextAreaContainer>
        </TextAreaWrapper>
      </Wrapper>
    </BackgroundContainer>
  );
};

export default CommentsField;
