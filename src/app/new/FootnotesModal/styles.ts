import styled from 'styled-components';

export const ModalWrapper = styled.div(({ theme }) => ({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  backgroundColor: theme.colors.black300,
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
}));

export const ModalContainer = styled.div(({ theme }) => ({
  position: 'relative',
  background: theme.colors.white,
  padding: '24px',
  borderRadius: '8px',
  width: '60%',
  height: '80%',
  maxHeight: '80%',
  display: 'flex',
  flexDirection: 'column',
}));

export const TitleContainer = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '30px',
});

export const CloseIconContainer = styled.div({
  display: 'flex',
  cursor: 'pointer',
});

export const ControlButton = styled.div(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  cursor: 'pointer',
  alignItems: 'center',
  fontSize: '14px',
  fontWeight: 500,
  marginTop: '16px',
  marginBottom: '16px',
  flexShrink: 0,

  '&[data-is-disabled="true"]': {
    color: theme.colors.textDisabled,
    cursor: 'default',
  },
}));

export const FootnotesList = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  minHeight: 0,
  overflowY: 'auto',
  paddingRight: '8px',
  marginBottom: '16px',
});

export const FootnotesContainer = styled.div(({ theme }) => ({
  display: 'flex',
  position: 'relative',
  padding: '24px',
  borderRadius: '16px',
  backgroundColor: theme.colors.lightGray,
}));

export const ButtonsContainer = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '8px',
  flexShrink: 0,
  marginTop: 'auto',
});

export const ItemWrapper = styled.div({
  display: 'flex',
  width: '100%',
  gap: '15px',
  flexDirection: 'column',
});

export const RemoveItem = styled.div({
  position: 'absolute',
  right: 0,
  padding: '8px',
});

export const FieldLabel = styled.div(({ theme }) => ({
  color: theme.colors.textSecondary,
  lineHeight: '21px',
  marginBottom: '2px',
  fontSize: '14px',
}));

export const TextAreaWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  width: '100%',
});
