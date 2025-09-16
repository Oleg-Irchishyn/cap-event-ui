import styled from 'styled-components';

export const DropdownWrapper = styled.div(({ theme }) => ({
  cursor: 'default',
  padding: '0px 8px',
  backgroundColor: 'transparent',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontSize: '14px',

  '&[data-is-open="true"]': {
    border: `1px solid ${theme.colors.primary}`,
  },

  '&[data-is-clickable="true"]': {
    cursor: 'pointer',
  },
}));

export const ControlButton = styled.div(({ theme }) => ({
  display: 'flex',
  gap: '8px',
  cursor: 'pointer',
  justifySelf: 'flex-end',
  alignItems: 'center',
  marginTop: '17px',
  fontSize: '14px',
  fontWeight: 400,

  '&[data-is-disabled="true"]': {
    color: theme.colors.textDisabled,
    cursor: 'default',
  },
}));

export const AmountInput = styled.input(({ theme }) => ({
  width: '100%',
  height: '100%',
  textAlign: 'end',
  border: 'none',
  paddingRight: '4px',
  backgroundColor: 'transparent',
  fontSize: '14px',
  fontWeight: 400,

  '&:focus': {
    outline: 'none',
  },

  '&::placeholder': {
    fontStyle: 'italic',
    color: theme.colors.textDisabled,
  },
}));

export const TableControls = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  gap: '16px',
});

export const ApplyText = styled.div(({ theme }) => ({
  display: 'flex',
  fontSize: '14px',
  fontWeight: 400,
  color: theme.colors.accentGreen,

  '&[data-is-disabled="true"]': {
    color: theme.colors.textDisabled,
    cursor: 'default',
  },
}));

export const TableTitleWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

export const TotalAmount = styled.div(({ theme }) => ({
  color: theme.colors.textPrimary,
  fontSize: '16px',
  fontWeight: 500,
}));

export const AddNewOption = styled.div({
  display: 'flex',
  justifyContent: 'center',
  margin: '10px',
  cursor: 'pointer',
});

export const DropdownContainer = styled.div({
  position: 'relative',
  width: '100%',
  height: '100%',
});

export const Label = styled.span(({ theme }) => ({
  color: theme.colors.textPrimary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  fontWeight: 400,

  '&[data-is-placeholder="true"]': {
    color: theme.colors.textDisabled,
    fontStyle: 'italic',
  },
}));

export const DropdownMenu = styled.div(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.colors.white,
  border: '1px solid #ccc',
  borderRadius: '4px',
  zIndex: 99999,
  maxHeight: '250px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  marginTop: '2px',
}));

export const SearchWrapper = styled.div(({ theme }) => ({
  padding: '8px',
  borderBottom: `1px solid ${theme.colors.gray300}`,
}));

export const OptionsWrapper = styled.div({
  maxHeight: '200px',
  overflow: 'auto',
});

export const Option = styled.div(({ theme }) => ({
  padding: '10px 12px',
  cursor: 'pointer',
  fontSize: '14px',

  '&:hover': {
    backgroundColor: theme.colors.gray100,
  },

  '&[data-is-selected="true"]': {
    backgroundColor: theme.colors.gray300,
  },
}));

export const AltView = styled.div(({ theme }) => ({
  padding: '12px',
  textAlign: 'center',
  color: theme.colors.textSecondary,
  fontSize: '14px',
  fontStyle: 'italic',
}));
