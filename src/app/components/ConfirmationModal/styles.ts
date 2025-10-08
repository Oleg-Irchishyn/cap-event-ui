import styled from 'styled-components';

const ModalWrapper = styled.div(({ theme }) => ({
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

const ModalContainer = styled.div(({ theme }) => ({
  position: 'relative',
  background: theme.colors.white,
  padding: '24px',
  borderRadius: '8px',
  maxWidth: '540px',
  width: '100%',
  boxSizing: 'border-box',
}));

const ModalTitle = styled.div(({ theme }) => ({
  display: 'flex',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '1.5',
  color: theme.colors.textPrimary,
}));

const ModalHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
  padding: '8px 0',
});

const ModalCloseButton = styled.button({
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '4px',
});

const ModalContent = styled.div({
  marginBottom: '24px',
});

const ModalDescription = styled.p(({ theme }) => ({
  margin: '0 0 24px',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '1.5',
  color: theme.colors.textPrimary,
}));

const ModalSubDescription = styled.p(({ theme }) => ({
  margin: '0',
  fontSize: '14px',
  fontWeight: 400,
  lineHeight: '1.5',
  color: theme.colors.textPrimary,
}));

const ModalButtonContainer = styled.div({
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
});

export {
  ModalWrapper,
  ModalContainer,
  ModalTitle,
  ModalHeader,
  ModalCloseButton,
  ModalContent,
  ModalDescription,
  ModalSubDescription,
  ModalButtonContainer,
};
