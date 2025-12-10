import styled from 'styled-components';

export const Container = styled.div(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  zIndex: 10,
  display: 'flex',
  gap: '24px',
  flexDirection: 'column',
  backgroundColor: theme.colors.white,
}));

export const ButtonContainer = styled.div(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  alignSelf: 'flex-end',
  marginRight: '24px',
  marginBottom: '24px',
}));

export const TitleContainer = styled.div(({ theme }) => ({
  display: 'flex',
  backgroundColor: theme.colors.gray400,
  padding: '19px 32px',
  color: theme.colors.primary,
}));

export const Title = styled.div(({ theme }) => ({
  display: 'flex',
  color: theme.colors.primary,
  fontWeight: 600,
  fontSize: '20px',
}));

export const PageContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  paddingTop: '120px',
});
