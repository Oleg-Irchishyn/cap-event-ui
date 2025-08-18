import styled from 'styled-components';

export const ButtonContainer = styled.div({
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
  marginTop: '24px',
});

export const Title = styled.div(({ theme }) => ({
  display: 'flex',
  fontSize: '16px',
  fontWeight: 500,
  color: theme.colors.primary,
}));

export const Container = styled.div({
  margin: '24px',
});

export const DropdownWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: '16px',
  marginTop: '24px',
  width: '100%',
});
