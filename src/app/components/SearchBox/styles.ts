import styled from 'styled-components';

export const SearchWrapper = styled.div<{ width?: number }>(({ theme, width }) => ({
  position: 'relative',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '32px',
  background: theme.colors.white,
  border: `1px solid ${theme.colors.gray500}`,
  borderRadius: '4px',
  padding: '7px 28px 5px 40px',

  '@media (max-width: 750px)': {
    width: '100%',
  },
}));

export const SearchInput = styled.input(({ theme }) => ({
  fontWeight: 400,
  fontSize: '14px',
  lineHeight: '21px',
  height: '32px',
  width: '100%',
  outline: 'none',
  border: 'none',
  backgroundColor: 'transparent',

  '&::placeholder': {
    color: theme.colors.textDisabled,
  },
}));

export const SearchIcon = styled.img.attrs({
  src: '/icons/search.svg',
})({
  position: 'absolute',
  top: '15px',
  left: '15px',
  width: '15px',
  height: '15px',
});

export const ClearIcon = styled.img.attrs({
  src: '/icons/cross.svg',
})({
  position: 'absolute',
  top: '50%',
  width: '8px',
  right: '8px',
  height: '8px',
  cursor: 'pointer',
  transform: 'translateY(-50%)',
});
