import styled from 'styled-components';

export const BackgroundContainerWrapper = styled.div<{ $background: string }>(
  ({ $background }) => `
  position: relative;
  background-color: ${$background};
  border-radius: 16px;
  margin: 24px 16px 0 16px;
  padding: 24px;
`,
);
