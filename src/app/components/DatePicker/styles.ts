import styled from 'styled-components';

export const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
});

export const FieldLabel = styled.div(({ theme }) => ({
  color: theme.colors.textSecondary,
  lineHeight: '21px',
  marginBottom: '2px',
  fontSize: '14px',
}));
