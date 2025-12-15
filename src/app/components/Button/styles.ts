import styled from 'styled-components';

export const BUTTON_THEMES = {
  secondary: 'secondary',
  primary: 'primary',
  text: 'text',
};

export const ButtonWrapper = styled.button<{ width: string }>(
  ({ theme, width }) => `
  position: relative;
  height: 40px;
  width: ${width};
  cursor: pointer;
  border: 1px solid ${theme.colors.primary};
  background-color: ${theme.colors.primary};
  color: ${theme.colors.white};
  border-radius: 6px;
  font-size: 14px;
  font-weight: 400;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0;
  padding: 9.5px 24px;

  &[disabled] {
    color: ${theme.colors.textDisabled};
    background-color: ${theme.colors.gray300};
    border: 1px solid ${theme.colors.gray300};
    cursor: not-allowed;
  }

  &:not([disabled]):active {
    background-color: ${theme.colors.primary};
    color: ${theme.colors.white};
  }

  &:not([disabled]):hover {
    color: ${theme.colors.white};
    background-color: ${theme.colors.secondary};
    border: 1px solid ${theme.colors.secondary};
  }

  &:not([disabled]):focus {
    outline: none;
  }

  &[data-theme="${BUTTON_THEMES.secondary}"] {
    background-color: #FFFFFF;
    color: #666769;
    border: 1px solid #666769;
    border-radius: 4px;
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    padding: 9.5px 24px;

    &[disabled] {
      opacity: 0.5;
      background-color: #FFFFFF;
      color: #B7B7B8;
      border-width: 1px solid #DFE1E1;
    }

    &:not([disabled]):hover {
      background-color: #FFFFFF;
      color: #666769;
      border: 1px solid #0081CC;
    }

    &:not([disabled]):focus {
      background-color: #FFFFFF;
      color: #666769;
      border: 2px solid #004E7A;
    }

    &:not([disabled]):active {
      background-color: #FFFFFF;
      color: #666769;
      border: 2px solid #004E7A;
    }
  }

  &[data-theme="${BUTTON_THEMES.text}"] {
    background: none;
    border: none;
    color: ${theme.colors.primary};
    margin: 0;
    font-size: 14px;
    font-weight: 400;
    padding: 8px;

    &:hover {
      background: none;
      border: none;
      color: ${theme.colors.primary};
    }
  }
  
  @media(max-width: 447px) {
    width: 100%;
  }
`,
);

export const Text = styled.div`
  display: flex;
`;
