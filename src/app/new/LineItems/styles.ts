import { theme } from '@/ui/globalStyles';
import styled, { css, keyframes } from 'styled-components';

const spin = keyframes({
  from: { transform: 'rotate(0deg)' },
  to: { transform: 'rotate(360deg)' },
});

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
  fontSize: '14px',
  fontWeight: 500,

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
  padding: '0',
  backgroundColor: 'transparent',
  fontSize: '14px',
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',

  '&:focus': {
    outline: 'none',
  },

  '&::placeholder': {
    fontStyle: 'italic',
    color: theme.colors.textDisabled,
  },
}));

export const TextInput = styled.input(({ theme }) => ({
  width: '100%',
  height: '100%',
  textAlign: 'left',
  border: 'none',
  padding: '0',
  backgroundColor: 'transparent',
  fontSize: '14px',
  fontWeight: 500,
  overflow: 'hidden !important',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  '&:focus': {
    outline: 'none',
  },

  '&::placeholder': {
    fontStyle: 'italic',
    color: theme.colors.textDisabled,
  },
}));

export const DrCrInput = styled.input(({ theme }) => ({
  width: '100%',
  height: '100%',
  textAlign: 'left',
  border: 'none',
  padding: '0 8px',
  backgroundColor: 'transparent',
  fontSize: '14px',
  fontWeight: 500,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',

  '&:focus': {
    outline: 'none',
  },

  '&[disabled]': {
    fontStyle: 'italic',
    color: theme.colors.textDisabled,
  },
}));

export const DateCellWrapper = styled.div(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  display: 'flex',
  alignItems: 'center',
  cursor: 'pointer',

  // Override MUI DatePicker styles to make it look like a cell
  '& .MuiTextField-root': {
    width: '100%',
    height: '100%',
  },

  '& .MuiInputBase-root': {
    height: '100%',
    fontSize: '14px',
    color: theme.colors.textPrimary,
    backgroundColor: 'transparent',
    border: 'none',
    borderRadius: '0',

    '&:hover': {
      backgroundColor: 'transparent',
    },

    '&.Mui-focused': {
      backgroundColor: 'transparent',
      boxShadow: 'none',
    },

    '&.Mui-disabled': {
      color: theme.colors.textSecondary,
      cursor: 'default',
    },
  },

  '& .MuiOutlinedInput-notchedOutline': {
    border: 'none',
  },

  '& .MuiInputAdornment-root': {
    color: theme.colors.textSecondary,
    marginLeft: '0',
  },

  '& .MuiIconButton-root': {
    padding: '4px',
    color: theme.colors.textSecondary,

    '&:hover': {
      backgroundColor: 'transparent',
    },
  },

  // Inherited data styling
  '&[data-is-inherited="true"] .MuiInputBase-root': {
    color: theme.colors.textSecondary,
  },

  '&[data-is-inherited="true"] .MuiInputAdornment-root': {
    color: theme.colors.textSecondary,
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

export const AddNewOptionWrapper = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: '10px',
  cursor: 'pointer',
  fontSize: '14px',
  gap: '4px',

  '&:hover': {
    backgroundColor: theme.colors.gray100,
  },
}));

export const AddLabel = styled.div(({ theme }) => ({
  display: 'flex',
  color: theme.colors.textDisabled,
}));

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

  '&[data-is-clickable="false"]': {
    color: theme.colors.textSecondary,
  },

  '&[data-is-placeholder="true"]': {
    color: theme.colors.textDisabled,
    fontStyle: 'italic',
  },

  '&[data-is-inherited="true"]': {
    color: theme.colors.textSecondary,
  },
}));

export const DropdownMenu = styled.div(({ theme }) => ({
  position: 'absolute',
  backgroundColor: theme.colors.white,
  border: '1px solid #ccc',
  borderRadius: '4px',
  zIndex: 9999,
  maxHeight: '250px',
  overflow: 'hidden',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
  marginTop: '4px',
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

export const InvestmentOptionWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '4px',
});

export const InvestmentTitleWrapper = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

export const InvestmentLabel = styled.div(({ theme }) => ({
  color: theme.colors.textPrimary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

export const InvestmentSubLabel = styled.div(({ theme }) => ({
  color: theme.colors.textDisabled,
  fontSize: '12px',
}));

export const InvestmentRefreshButton = styled.div(({ theme }) => ({
  padding: '12px',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none',
  '&:hover': {
    backgroundColor: theme.colors.gray100,
  },

  '&[data-is-loading="true"]': {
    justifyContent: 'center',
  },
}));

export const RefreshIcon = styled.img.attrs({
  src: '/cap-event/icons/refresh-icon.svg',
})({
  width: '15px',
  height: '15px',
  marginRight: '10px',
});

export const Loader = styled.span`
  width: 16px;
  height: 16px;
  border: 3px solid ${({ theme }) => theme.colors.gray500};
  border-bottom-color: transparent;
  border-radius: 50%;
  display: inline-block;
  box-sizing: border-box;
  animation: ${css`
    ${spin} 1s linear infinite
  `};
`;

export const LinkButtonWrapper = styled.a({
  textDecoration: 'none',
  color: 'inherit',

  '&:visited': {
    color: 'inherit',
  },

  '&:hover': {
    color: 'inherit',
    textDecoration: 'none',
  },
});

export const InvestmentNewItemButton = styled.div(({ theme }) => ({
  padding: '12px',
  cursor: 'pointer',
  fontSize: '14px',
  display: 'flex',
  alignItems: 'center',
  borderBottom: `1px solid ${theme.colors.gray300}`,
  textDecoration: 'none',

  '&:hover': {
    backgroundColor: theme.colors.gray100,
  },
}));

export const PlusIcon = styled.img.attrs({
  src: '/cap-event/icons/plus.svg',
})({
  width: '14px',
  height: '14px',
  marginRight: '10px',
});

export const RedirectIcon = styled.img.attrs({
  src: '/cap-event/icons/link.svg',
})({
  width: '12px',
  height: '12px',
  padding: '2px',
  marginLeft: '8px',
  cursor: 'pointer',
});

export const ActionButtonsWrapper = styled.div({
  width: '100%',
  height: '100%',
  boxSizing: 'border-box',
  padding: '0 10px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
});

export const DeleteButton = styled.button({
  width: '15px',
  height: '15px',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  background: `url(/cap-event/icons/trash-enabled.svg) no-repeat center center;`,
  backgroundSize: 'contain',

  '&[data-is-disabled="true"]': {
    background: `url(/cap-event/icons/trash.svg) no-repeat center center;`,
    backgroundSize: 'contain',
    cursor: 'default',
  },
});

export const DuplicateRowButton = styled.button({
  width: '15px',
  height: '15px',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  background: `url(/cap-event/icons/duplicate-row.svg) no-repeat center center;`,
  backgroundSize: 'contain',

  '&[data-is-disabled="true"]': {
    opacity: 0.5,
    cursor: 'default',
  },
});

export const CellWrapper = styled.div({
  display: 'flex',
  padding: '10px 2px',
  boxSizing: 'border-box',
  cursor: 'pointer',
});

export const PreviewButton = styled.button({
  width: '15px',
  height: '15px',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  background: `url(/cap-event/icons/eye-enabled.svg) no-repeat center center;`,
  backgroundSize: 'contain',

  '&[data-is-disabled="true"]': {
    background: `url(/cap-event/icons/eye-disabled.svg) no-repeat center center;`,
    backgroundSize: 'contain',
    cursor: 'default',
  },
});

export const ModalWrapper = styled.div(({ theme }) => ({
  position: 'fixed',
  boxSizing: 'border-box',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  paddingTop: '64px',
  paddingLeft: '25px',
  paddingRight: '25px',
  backgroundColor: theme.colors.black300,
  backdropFilter: 'blur(10px)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 10,
}));

export const ModalContainer = styled.div(({ theme }) => ({
  position: 'relative',
  background: theme.colors.lightGray,
  padding: '24px',
  borderRadius: '8px',
  width: '100%',
  boxSizing: 'border-box',
}));

export const ModalHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '32px',
  padding: '8px 0',
});

export const ModalButtonContainer = styled.div({
  display: 'flex',
  gap: '8px',
  justifyContent: 'flex-end',
});

export const ModalContent = styled.div({
  overflow: 'auto',
  maxHeight: '400px',

  '&::-webkit-scrollbar': {
    width: '7px',
    height: '7px',
    backgroundColor: 'transparent',
  },

  '&::-webkit-scrollbar-thumb': {
    backgroundColor: `${theme.colors.gray300}`,
    borderRadius: '10px',
  },
});

export const TotalItemsRow = styled.div({
  display: 'flex',
  justifyContent: 'flex-end',
  fontSize: '14px',
  fontWeight: '400',
});

export const AllocationPreviewMetaDataWrapper = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '24px',
  marginBottom: '32px',
});

export const AllocationPreviewMetaDataItem = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
  maxWidth: '259px',
  textAlign: 'left',
});

export const AllocationPreviewMetaDataItemLabel = styled.div({
  fontSize: '14px',
  fontWeight: '400',
  color: theme.colors.accentBlue,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
});

export const AllocationPreviewMetaDataItemValue = styled.div({
  fontSize: '14px',
  fontWeight: '500',
  color: theme.colors.textPrimary,
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '100%',
});
