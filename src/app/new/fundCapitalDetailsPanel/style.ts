import styled from 'styled-components';

export const PanelContainer = styled.div({
  display: 'flex',
  gap: '16px',
  justifyContent: 'flex-start',
  margin: '24px 0 0 0',
});

export const PanelItem = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
});

export const PanelItemTitle = styled.h2(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  margin: '0 0 8px 0',
  color: theme.colors.accentBlue,
}));

export const PanelItemDescription = styled.span(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  color: theme.colors.textPrimary,
}));
