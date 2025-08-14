import styled from 'styled-components';

import { customScrollbarSCSS } from '@/ui/globalStyles';

export const DropdownWrapper = styled.div(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '100%',
  minWidth: '120px',
  cursor: 'pointer',

  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '19px',
  fontStyle: 'normal',
  color: theme.colors.primary,

  '&[data-is-disabled="true"]': {
    cursor: 'default',
    pointerEvents: 'none',
    backgroundColor: theme.colors.gray,
  },

  '&[data-is-read-only="true"]': {
    cursor: 'default',
    backgroundColor: theme.colors.gray300,
  },
}));

export const FieldLabel = styled.div(({ theme }) => ({
  color: theme.colors.textSecondary,
  lineHeight: '21px',
  marginBottom: '2px',
  fontSize: '14px',
}));

export const LabelContainer = styled.div(() => ({
  display: 'flex',
  justifyContent: 'space-between',
}));

export const ErrorLabel = styled.div(({ theme }) => ({
  display: 'flex',
  color: theme.colors.error,
  alignItems: 'center',
  gap: '8px',
}));

export const InputFiledWrapper = styled.div(({ theme }) => ({
  position: 'relative',
  width: '100%',
  height: '40px',
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  backgroundColor: theme.colors.white,
  justifyContent: 'space-between',
  cursor: 'pointer',
  borderRadius: '4px',
  outline: `1px solid ${theme.colors.gray500}`,

  '&[data-is-open="true"]': {
    outline: `1px solid ${theme.colors.primary}`,
  },

  '&[data-is-error="true"]': {
    outline: `1px solid ${theme.colors.error}`,
  },

  '&[data-is-disabled="true"],&[data-is-read-only="true"]': {
    cursor: 'default',
    backgroundColor: theme.colors.gray300,
  },

  '&:hover': {
    outline: `1px solid ${theme.colors.primary}`,
  },
}));

export const Placeholder = styled.div(({ theme }) => ({
  marginLeft: '12px',
  color: theme.colors.textDisabled,
}));

export const SingleSelectInputWrapper = styled.div({
  overflow: 'hidden',
});

export const SingleSelectInput = styled.div(({ theme }) => ({
  margin: '10px 12px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  color: theme.colors.textPrimary,
}));

export const MultiSelectInputWrapper = styled.div({
  display: 'flex',
  flexGrow: '1',
  overflow: 'hidden',
  flexDirection: 'row',
  width: '100%',
  height: '40px',
  padding: '4px',
  alignItems: 'center',
  gap: '4px',
});

export const SelectedInputLabel = styled.div(({ theme }) => ({
  padding: '7px 4px 6px 8px',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textOverflow: 'ellipsis',
  color: theme.colors.textPrimary,

  '&[data-is-disabled="true"]': {
    color: theme.colors.textDisabled,
  },
}));

export const ChevronButton = styled.button({
  border: 0,
  padding: 0,
  width: '20px',
  height: '20px',
  margin: '10px',
  flexGrow: 0,
  flexShrink: 0,
  appearance: 'none',
  transition: 'all .2s ease-in-out',
  cursor: 'pointer',
  background: `transparent url(/icons/chevron-down.svg) no-repeat center center`,

  '&[data-is-open="true"]': {
    transform: 'rotate(180deg)',
  },

  '&[data-is-disabled="true"],&[data-is-read-only="true"]': {
    cursor: 'default',
  },
});

export const ListViewWrapper = styled.div(({ theme }) => ({
  position: 'absolute',
  width: '100%',
  top: '46px',
  overflow: 'hidden',
  borderRadius: '4px',
  backgroundColor: theme.colors.white,
  boxShadow: '0px 0px 12px rgba(0,0,0,0.25)',
  zIndex: 3,
}));

export const ListViewContainer = styled.div`
  position: relative;
  ${customScrollbarSCSS},
`;

export const ScrollContainer = styled.div`
  max-height: 240px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const ItemWrapper = styled.div<{ withdescription?: number }>(
  ({ theme, withdescription }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: withdescription ? 'space-between' : 'flex-start',
    height: withdescription ? '48px' : '40px',
    paddingLeft: '12px',
    cursor: 'pointer',
    backgroundColor: theme.colors.white,

    '&[data-is-withbackground="true"]': {
      '&:hover': {
        backgroundColor: theme.colors.gray100,
      },

      '&[data-is-disabled="true"]': {
        cursor: 'default',
        backgroundColor: theme.colors.gray100,
        color: theme.colors.textDisabled,
      },

      '&[data-is-selected="true"]': {
        backgroundColor: theme.colors.gray500,
      },
    },
  }),
);

export const ItemCheckbox = styled.input.attrs({ type: 'checkbox' })`
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;

  width: 20px;
  height: 20px;
  margin-right: 10px;

  appearance: none;
  border-radius: 4px;
  border: 1px solid #666769;
  background-color: #ffffff;

  cursor: pointer;

  &::before {
    content: '';
    width: 10px;
    height: 8px;
    transform: scale(0);
    transition: 120ms transform ease-in-out;
    background-size: contain;
    background-image: url(/icons/marker-icon.svg);
    background-repeat: no-repeat;
    background-position: center;
  }

  &:checked::before {
    transform: scale(1);
  }

  &:disabled::before {
    background-image: url(/icons/marker-icon-disabled.svg);
  }

  &:focus-visible {
    outline: none;
  }

  &:disabled {
    cursor: default;
    background: #f0f1f1;
    border: 1px solid #b7b7b8;
  }
`;

export const ItemLabel = styled.p<{ withdescription?: number }>(({ theme, withdescription }) => ({
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  margin: withdescription ? '0' : '10px 0',
  color: theme.colors.textPrimary,

  '&[data-is-disabled="true"]': {
    cursor: 'default',
    color: theme.colors.textDisabled,
  },
}));

export const ItemDescription = styled.div(({ theme }) => ({
  color: theme.colors.descriptionText,
  fontSize: '12px',
  fontWeight: 400,
  lineHeight: '20px',
  marginRight: '12px',

  '&[data-is-disabled="true"]': {
    color: theme.colors.textDisabled,
  },
}));

export const SearchContainer = styled.div({
  position: 'relative',
  padding: '8px 12px',
});

export const ControlsContainer = styled.div`
  position: relative;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  gap: 4px;
  cursor: default;
  padding: 6px 12px;
`;

export const ControlsLine = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
});

export const ControlsLabel = styled.div(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  paddingLeft: '12px',
  fontSize: '14px',
  color: theme.colors.textSecondary,
}));

const ControlsButton = styled.button`
  border: 0;
  padding: 0;

  width: 24px;
  height: 24px;

  margin: 0;
  appearance: none;

  cursor: pointer;

  &[data-is-disabled='true'],
  [data-is-read-only='true'] {
    cursor: default;
  }
`;

export const SelectAllButton = styled(ControlsButton)`
  background: transparent url(/icons/select-all.svg) no-repeat center center;

  &[data-is-disabled='true'] {
    background: transparent url(/icons/select-all-disabled.svg) no-repeat center center;
  }
`;

export const DeselectButton = styled(ControlsButton)`
  background: transparent url(/icons/deselect-all.svg) no-repeat center center;

  &[data-is-disabled='true'] {
    background: transparent url(/icons/deselect-all-disabled.svg) no-repeat center center;
  }
`;

export const AlternativeButton = styled(ControlsButton)`
  background: transparent url(/icons/alt.svg) no-repeat center center;
`;

export const SelectedInputWrapper = styled.div(({ theme }) => ({
  display: 'none',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '4px',
  backgroundColor: theme.colors.gray100,
  maxWidth: 'calc(100% - 65px)',
  cursor: 'unset',

  '&[data-is-disabled="true"]': {
    backgroundColor: theme.colors.gray100,
  },
}));

export const RemoveButton = styled.button(({ theme }) => ({
  width: '32px',
  height: '32px',
  border: 0,
  padding: 0,
  cursor: 'pointer',
  appearance: 'none',
  background: `transparent url(/icons/cross.svg) no-repeat center center;`,

  '&[data-is-disabled="true"]': {
    cursor: 'default',
    backgroundImage: 'none',
    mask: `url(/icons/cross.svg) no-repeat 50% 50%;`,
    backgroundColor: theme.colors.textDisabled,
  },
}));

export const HiddenOptions = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  padding-left: 28px;
  visibility: hidden;
  background: transparent url(/icons/three-dots.svg) no-repeat left 4px center;
`;

export const HiddenOptionsCounter = styled.div(({ theme }) => ({
  padding: '6px',
  borderRadius: '4px',
  backgroundColor: theme.colors.gray100,
  color: theme.colors.textSecondary,

  '&[data-is-disabled="true"]': {
    backgroundColor: theme.colors.gray100,
    color: theme.colors.textDisabled,
  },
}));

export const ItemLabelWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
});

export const LabelWrapper = styled.div({
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
});

export const Separator = styled.div(({ theme }) => ({
  border: `1px solid ${theme.colors.gray100}`,
}));
