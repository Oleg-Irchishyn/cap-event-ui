import styled from 'styled-components';

export const Container = styled.div({
  minWidth: 0,
  display: 'flex',
  flexDirection: 'column',
});

export const AttachmentsHeader = styled.div({
  display: 'flex',
  justifyContent: 'space-between',
  paddingTop: '8px',
});

export const AttachmentsHeaderGroup = styled.div({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: '24px',
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

export const DropAreaTitle = styled.div({
  display: 'flex',
  fontSize: '16px',
  fontWeight: 500,
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
  position: 'relative',
  padding: '24px',
  border: `1px dashed ${theme.colors.gray500}`,
  borderRadius: '8px',
  textAlign: 'center',
  marginTop: '16px',
  minHeight: '54px',
  flex: '1 1 auto',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  '&[data-is-drag-over="true"]': {
    backgroundColor: theme.colors.skyBlue,
    border: `1px dashed ${theme.colors.accentBlue}`,
    opacity: 1,
  },
  '&[data-files-count="true"]': {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
}));

export const DropAreaCover = styled.div(({ theme }) => ({
  position: 'absolute',
  opacity: 0.5,
  background: theme.colors.gray100,
  top: 0,
  bottom: 0,
  right: 0,
  left: 0,
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

export const DropAreaWrapper = styled.div({
  display: 'grid',
  gridTemplateColumns: '1fr 48px 1fr',
  gap: '16px',
  alignItems: 'stretch',
  marginBottom: '24px',
});

export const DropAreaDividerBoxContainer = styled.div({
  display: 'flex',
  alignItems: 'center',
});

export const DropAreaDividerBox = styled.div(({ theme }) => ({
  padding: '20px 12px',
  border: `1px dashed ${theme.colors.gray500}`,
  borderRadius: '8px',
  display: 'flex',
  flexDirection: 'column',
  height: '104px',
  boxSizing: 'border-box',
  marginTop: '45px',
}));

// Icons

export const PDFIcon = styled.img.attrs({
  src: '/cap-event/icons/pdf-icon.svg',
})({
  width: '21px',
  height: '28px',
  marginBottom: '8px',
});
export const DOCXIcon = styled.img.attrs({
  src: '/cap-event/icons/docx-icon.svg',
})({
  width: '21px',
  height: '28px',
});

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

export const IconWrapper = styled.span({
  display: 'flex',
  marginLeft: '5px',
});

export const HelpIcon = styled.img.attrs({
  src: 'icons/help-icon.svg',
})({
  width: '15px',
  height: '15px',
});
