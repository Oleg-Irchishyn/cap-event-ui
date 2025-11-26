import styled from 'styled-components';

export const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

export const FieldLabel = styled.div<{ $color: string; $margin: string }>(
  ({ $color, $margin }) => `
  display: flex;
   color: ${$color};
   line-height: 21px;
   margin: ${$margin};
   font-size: 14px;
`,
);

export const IconWrapper = styled.div({
  display: 'flex',
  margin: '3px 4px',
});
