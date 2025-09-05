import styled from 'styled-components';
import Image from 'next/image';

export const ButtonContainer = styled.div({
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
  margin: '24px 16px 0 16px',
});

export const Title = styled.div(({ theme }) => ({
  display: 'flex',
  fontSize: '16px',
  fontWeight: 500,
  color: theme.colors.primary,
}));

export const Container = styled.div(({ theme }) => ({
  backgroundColor: theme.colors.lightGray,
  borderRadius: '16px',
  margin: '24px 16px 0 16px',
  padding: '24px',
}));

export const DropdownWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: 'repeat(5, minmax(0, 1fr))',
  gap: '16px',
  marginTop: '24px',
  width: '100%',
});

export const Counter = styled.div(({ theme }) => ({
  position: 'absolute',
  bottom: 1,
  left: 12,
  width: `calc(100% - 30px)`,
  height: '24px',
  fontSize: '12px',
  color: theme.colors.textDisabled,
  zIndex: 2,
  pointerEvents: 'none',
  backgroundColor: 'white',
}));

export const TextAreaContainer = styled.div({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  width: '100%',
});

export const Wrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
});

export const TextAreaWrapper = styled.div({
  display: 'flex',
  position: 'relative',
  flexDirection: 'column',
});

export const TextAreaLabel = styled.span(({ theme }) => ({
  fontSize: '14px',
  color: theme.colors.textSecondary,
  marginBottom: '8px',
}));

export const TextArea = styled.textarea(({ theme }) => ({
  borderRadius: '4px',
  position: 'relative',
  borderColor: theme.colors.gray500,
  padding: '12px',
  paddingBottom: '32px',
  fontFamily: 'IBM Plex Sans Fallback',
  resize: 'vertical',
  outline: 'none',

  '&::placeholder': {
    color: theme.colors.textDisabled,
    fontSize: '14px',
    fontFamily: 'IBM Plex Sans Fallback',
  },

  '&:focus': {
    border: `1px solid ${theme.colors.primary}`,
  },
}));

export const Label = styled.span(({ theme }) => ({
  fontSize: '14px',
  color: theme.colors.primary,
}));

export const SubLabel = styled.span(({ theme }) => ({
  fontSize: '14px',
  color: theme.colors.textPrimary,
}));

export const ChevronIcon = styled.img.attrs({
  src: 'icons/chevron-down-secondary.svg',
})({
  transition: 'all .2s ease-in-out',

  '&[data-is-open="true"]': {
    transform: 'rotate(180deg)',
  },
});

export const CellPlaceholder = styled.span(({ theme }) => ({
  fontSize: '14px',
  color: theme.colors.textDisabled,
  fontStyle: 'italic',
  fontWeight: 400,
}));
