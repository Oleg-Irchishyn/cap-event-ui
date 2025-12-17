import styled from 'styled-components';

export const TableWrapper = styled.div({
  width: '100%',
  marginTop: '24px',
});

export const Header = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.white,
  padding: '12px 8px',
  fontSize: '14px',
  fontWeight: 600,
}));
