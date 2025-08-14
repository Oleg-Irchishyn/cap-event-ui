import React, { FC } from 'react';

import { BUTTON_THEMES, ButtonWrapper, Text } from './styles';

type ButtonProps = {
  children: React.ReactNode;
  textStyle?: React.CSSProperties;
  disabled?: boolean;
  style?: React.CSSProperties;
  onClick: () => void;
  buttonTheme: string;
  width?: string;
  testId: string;
};

const Button: FC<ButtonProps> = (props) => {
  const {
    children,
    textStyle = {},
    disabled = false,
    style = {},
    onClick = () => {},
    buttonTheme = BUTTON_THEMES.secondary,
    width = '250px',
    testId,
  } = props;

  return (
    <ButtonWrapper
      data-testid={testId}
      data-theme={buttonTheme}
      type="button"
      width={width}
      onClick={onClick}
      disabled={disabled}
      style={style}
    >
      <Text style={textStyle}>{children}</Text>
    </ButtonWrapper>
  );
};

export default Button;
