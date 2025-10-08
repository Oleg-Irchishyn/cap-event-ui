import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    colors: {
      primary: string;
      secondary: string;
      white: string;
      black: string;
      black300: string;
      black500: string;
      gray: string;
      gray50: string;
      gray100: string;
      gray300: string;
      gray500: string;
      lightGray: string;
      textDisabled: string;
      textPrimary: string;
      textSecondary: string;
      descriptionText: string;
      error: string;
      border: string;
      pastelYellow: string;
      skyBlue: string;
      accentBlue: string;
      alertError: string;
      accentGreen: string;
    };
  }
}
