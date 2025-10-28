import styled from 'styled-components';

export const HeaderWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  width: '100%',
});

export const HeaderName = styled.span(({ theme }) => ({
  color: theme.colors.textSecondary,
  fontWeight: '500',
}));

export const IconWrapper = styled.span({
  display: 'flex',
  marginLeft: '5px',
});

export const HelpIcon = styled.img.attrs({
  src: 'icons/help-icon.svg',
})({
  width: '15px',
  height: '15px',
});
