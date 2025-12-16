import styled from 'styled-components';
import { theme } from '@/ui/globalStyles';

export const PanelContainer = styled.div({
  display: 'flex',
  gap: '24px',
  justifyContent: 'flex-start',
  flexWrap: 'wrap',
  alignItems: 'baseline',
  margin: '24px 0 0 0',
});

export const PanelItem = styled.div({
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-start',
  alignItems: 'baseline',
  width: '100%',
});

export const PanelItemTitle = styled.div(({ theme }) => ({
  fontSize: '16px',
  fontWeight: 500,
  margin: '0',
  color: theme.colors.textPrimary,
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'center',
  gap: '8px',
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
  cursor: 'pointer',
});
