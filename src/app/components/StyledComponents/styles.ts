import styled from 'styled-components';

export const ItemCheckbox = styled.input.attrs({ type: 'checkbox' })({
  display: 'flex',
  flexShrink: 0,
  alignItems: 'center',
  justifyContent: 'center',
  width: '18px',
  height: '18px',
  marginRight: '8px',

  appearance: 'none',
  borderRadius: '4px',
  border: '1px solid #666769',
  backgroundColor: '#ffffff',

  cursor: 'pointer',

  '&::before': {
    content: '""',
    width: '10px',
    height: '8px',
    transform: 'scale(0)',
    transition: '120ms transform ease-in-out',
    backgroundSize: 'contain',
    backgroundImage: 'url(icons/marker-icon.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },

  '&:checked::before': {
    transform: 'scale(1)',
  },

  '&:disabled::before': {
    backgroundImage: 'url(icons/marker-icon-disabled.svg)',
  },

  '&:focus-visible': {
    outline: 'none',
  },

  '&:disabled': {
    cursor: 'default',
    background: '#f0f1f1',
    border: '1px solid #b7b7b8',
  },
});
