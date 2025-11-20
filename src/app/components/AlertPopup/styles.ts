import styled from 'styled-components';

export const AlertContainer = styled.div(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  minHeight: '110px',
  padding: '10px',
  borderRadius: '5px',
  boxShadow: '0px 0px 5px black',
  boxSizing: 'border-box',
  zIndex: 10,

  '&[data-status="error"]': {
    backgroundColor: theme.colors.alertError,
  },
}));

export const AlertHeader = styled.div({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  marginBottom: '20px',
});

export const AlertName = styled.div({
  fontSize: '20px',
  fontWeight: 400,
  marginLeft: '8px',
});

export const ErrorSection = styled.div({
  marginBottom: '16px',
});

export const AlertMessage = styled.div({
  textAlign: 'left',
});

export const FileName = styled.span({
  textDecoration: 'underline',
  whiteSpace: 'nowrap',
});

export const ErrorIcon = styled.img.attrs({
  src: '/cap-event/icons/error-icon.svg',
})({
  width: '24px',
  height: '24px',
});

export const CloseButton = styled.button({
  position: 'absolute',
  right: '20px',
  width: '20px',
  height: '20px',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  appearance: 'none',
  background: `transparent url(/cap-event/icons/cross.svg) no-repeat center center;`,
});
