import styled from 'styled-components';

export const HeaderWrapper = styled.div<{ $headerAlignment: string }>(({ $headerAlignment }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: $headerAlignment ?? 'flex-start',
  width: '100%',
}));

export const HeaderName = styled.span(({ theme }) => ({
  color: theme.colors.textSecondary,
  fontWeight: '500',
}));

export const IconWrapper = styled.span({
  display: 'flex',
  marginLeft: '5px',
});

export const HelpIcon = styled.img.attrs({
  src: '/cap-event/icons/help-icon.svg',
})({
  width: '15px',
  height: '15px',
});
