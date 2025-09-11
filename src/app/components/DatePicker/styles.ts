import styled from 'styled-components';

export const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

export const FieldLabel = styled.div<{ $color: string; $margin: string }>(
  ({ $color, $margin }) => `
   color: ${$color};
   line-height: 21px;
   margin: ${$margin};
   font-size: 14px;
`,
);
