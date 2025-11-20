import styled from 'styled-components';

export const AttachmentsHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: '8px',
});

export const AttachmentsHeaderGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
});

export const AttachmentsHint = styled.div(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  fontStyle: 'italic',
  marginLeft: '8px',
  marginRight: '8px',
  color: theme.colors.textSecondary,
}));

export const AttachmentsCounter = styled.div(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  fontStyle: 'italic',
  color: theme.colors.textSecondary,
}));

export const FileNumber = styled('span')(({ theme }) => ({
  marginRight: '8px',
  color: theme.colors.textSecondary,
}));

export const FileNameWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
});

export const FileName = styled('span')({
  display: 'inline-block',
  textDecoration: 'underline',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  maxWidth: '324px',
});

export const VisuallyHiddenInput = styled('input')({
  clip: 'rect(0 0 0 0)',
  clipPath: 'inset(50%)',
  height: 1,
  overflow: 'hidden',
  position: 'absolute',
  bottom: 0,
  left: 0,
  whiteSpace: 'nowrap',
  width: 1,
});

export const EmptyFileAreaContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
});

export const AddFilesButtonText = styled.span(({ theme }) => ({
  marginLeft: '8px',
  color: theme.colors.textSecondary,
}));

export const DropdownHint = styled.div(({ theme }) => ({
  fontSize: '13px',
  fontStyle: 'italic',
  marginLeft: '8px',
  color: theme.colors.textSecondary,
}));

export const BrowseLabel = styled.label(({ theme }) => ({
  display: 'inline-block',
  padding: '8px',
  background: 'none',
  border: 'none',
  color: theme.colors.primary,
  cursor: 'pointer',
  textDecoration: 'underline',
}));

export const DropAreaContainer = styled.div(({ theme }) => ({
  padding: '24px',
  border: `1px dashed ${theme.colors.gray500}`,
  borderRadius: '8px',
  textAlign: 'center',
  marginTop: '24px',
  '&[data-is-drag-over="true"]': {
    backgroundColor: theme.colors.skyBlue,
    border: `1px dashed ${theme.colors.accentBlue}`,
    opacity: 1,
  },
  '&[data-file-count="true"]': {
    textAlign: 'left',
  },
}));

export const FileListStyled = styled.div({
  display: 'flex',
  flexWrap: 'wrap',
  gap: '10px',
  alignItems: 'center',
});

export const FileListItem = styled.div(({ theme }) => ({
  height: '36px',
  fontSize: '14px',
  opacity: '1',
  transformOrigin: '50% 50%',
  borderRadius: '8px',
  cursor: 'grab',
  backgroundColor: `rgba(${theme.colors.pastelYellow}, 0.48)`,
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexShrink: '0',
  '&[data-hovered="true"]': {
    backgroundColor: `rgba(${theme.colors.pastelYellow}, 1)`,
  },
  '&[data-with-opacity="true"]': {
    opacity: '0.5',
  },
  '&[data-is-dragging="true"]': {
    cursor: 'grabbing',
  },
}));

export const IconButton = styled.div({
  width: '20px',
  height: '20px',
  marginLeft: '8px',
  marginRight: '12px',
  backgroundColor: 'transparent',
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  opacity: 0,
  '&[data-hovered="true"]': {
    opacity: 1,
  },
});

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
    backgroundImage: 'url(/cap-event/icons/marker-icon.svg)',
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'center',
  },

  '&:checked::before': {
    transform: 'scale(1)',
  },

  '&:disabled::before': {
    backgroundImage: 'url(/cap-event/icons/marker-icon-disabled.svg)',
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

// Icons

export const DownloadArrowIcon = styled.img.attrs({
  src: '/cap-event/icons/download-arrow.svg',
})({
  width: '15px',
  height: '15px',
});

export const TrashIcon = styled.img.attrs({
  src: '/cap-event/icons/trash.svg',
})({
  width: '15px',
  height: '15px',
});

export const DragIcon = styled.img.attrs({
  src: '/cap-event/icons/drag-icon.svg',
})({
  width: '20px',
  height: '20px',
  opacity: 0,
  fontSize: '16px',
  '&[data-hovered="true"]': {
    opacity: 1,
  },
});
