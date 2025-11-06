import React, { FC, useState, useRef } from 'react';

import { BUTTON_THEMES, ButtonWrapper, Text } from './styles';
import Tooltip from '@/app/components/Tooltip';

type ButtonProps = {
  children: React.ReactNode;
  textStyle?: React.CSSProperties;
  disabled?: boolean;
  disabledTooltipText?: string;
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
    disabledTooltipText,
  } = props;

  const [showTooltip, setShowTooltip] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const showTooltipHandler = () => {
    if (disabledTooltipText && disabled) {
      setShowTooltip(true);
    }
  };

  const handleMouseEnter = () => {
    showTooltipHandler();
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  return (
    <div
      ref={wrapperRef}
      style={{
        position: 'relative',
        width,
        display: 'inline-block',
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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
      <Tooltip
        showTooltip={showTooltip}
        tooltipMessage={disabledTooltipText ?? ''}
        targetRef={wrapperRef}
      />
    </div>
  );
};

export default Button;
