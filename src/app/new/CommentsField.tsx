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

const MAX_SYMBOLS_COUNT = 1200;

const CommentsField = () => {
  const [value, setValue] = useState('');

  return (
    <Wrapper>
      <Title>Comments</Title>
      <TextAreaWrapper>
        <TextAreaLabel>Comment Text Area</TextAreaLabel>
        <TextAreaContainer>
          <Counter>
            {value.length} of {MAX_SYMBOLS_COUNT}
          </Counter>
          <TextArea
            name="comment"
            rows={10}
            value={value}
            placeholder="Enter text"
            maxLength={MAX_SYMBOLS_COUNT}
            onChange={(e) => setValue(e.target.value)}
          />
        </TextAreaContainer>
      </TextAreaWrapper>
    </Wrapper>
  );
};

export default CommentsField;
