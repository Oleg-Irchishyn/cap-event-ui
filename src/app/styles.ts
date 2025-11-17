import styled from 'styled-components';

export const ButtonContainer = styled.div(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  width: `calc(100% - 32px)`,
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
  alignItems: 'flex-start',
  padding: '24px 16px',
  backgroundColor: theme.colors.white,
}));

export const PageContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '56px',
});
