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
  background: theme.colors.white100,
  padding: '24px',
  borderRadius: '8px',
  maxWidth: '900px',
  minHeight: '90dvh',
  width: '100%',
  boxSizing: 'border-box',
}));

const ModalTitle = styled.div(({ theme }) => ({
  display: 'flex',
  fontSize: '16px',
  fontWeight: 500,
  lineHeight: '1.5',
  color: theme.colors.accentBlue,
}));

const ModalHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '24px',
  padding: '8px 0',
});

const ModalCloseButton = styled.button({
  background: 'transparent',
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

const ModalButtonContainer = styled.div({
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
});

const DocxContainer = styled.div(({ theme }) => ({
  maxHeight: '65dvh',
  overflow: 'auto',
  margin: '16px 0',

  '&::-webkit-scrollbar': {
    width: '7px',
    height: '7px',
    backgroundColor: 'transparent',
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: `${theme.colors.gray300}`,
    borderRadius: '10px',
  },

  '& .docx-preview-wrapper': {
    background: `${theme.colors.white100}`,
    padding: 0,
    marginBottom: 0,
  },

  '& .docx-preview-wrapper>section.docx-preview': {
    boxShadow: 'none',
    borderRadius: '4px',
  },
}));

export {
  DocxContainer,
  ModalButtonContainer,
  ModalCloseButton,
  ModalContainer,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalWrapper,
};
