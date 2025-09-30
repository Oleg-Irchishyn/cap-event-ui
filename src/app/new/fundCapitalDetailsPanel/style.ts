import styled from 'styled-components';
import { theme } from '@/ui/globalStyles';

export const PanelContainer = styled.div({
  display: 'flex',
  gap: '24px',
  justifyContent: 'flex-start',
  alignItems: 'baseline',
  margin: '24px 0 0 0',
});

export const PanelItem = styled.div({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
});

export const PanelItemTitle = styled.div(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 400,
  margin: '0 0 8px 0',
  color: theme.colors.accentBlue,
  display: 'flex',
  alignItems: 'baseline',
}));

export const PanelItemDescription = styled.span(({ theme }) => ({
  fontSize: '14px',
  fontWeight: 500,
  color: theme.colors.textPrimary,
}));

export const datePickerStyles = {
  labelColor: theme.colors.accentBlue,
  labelMargin: '0 0 4px 0',
  inputHeight: '24px',
  inputPadding: '0',
  inputFontWeight: '500',
  maxWidth: '105px',
  minWidth: 'auto',
  margin: '0 8px 0 0',
  borderColor: 'transparent !important',
  backgroundColor: 'transparent',
};

export const PressableWrapper = styled.div({
  display: 'flex',
  marginLeft: '7px',
  cursor: 'pointer',
});
