import { DefaultTheme } from 'styled-components';

export const theme: DefaultTheme = {
  colors: {
    primary: '#0067A3',
    secondary: '#003470',
    white: '#FFFFFF',
    gray: '#FAFAFA',
    gray50: '#EAEAEA',
    gray100: '#F0F1F1',
    gray300: '#DFE1E1',
    gray500: '#C0C4C4',
    textDisabled: '#B7B7B8',
    textPrimary: '#010205',
    textSecondary: '#666769',
    descriptionText: '#838486',
    error: '#DA5151',
    border: '#666769',
  },
};

export const customScrollbarSCSS = `
  ::-webkit-scrollbar {
    width: 16px;
  }

  ::-webkit-scrollbar-track {
    background: #FFFFFF;
  }

  ::-webkit-scrollbar-thumb {
    border-radius: 10px;
    background-color: #DDDDDD;
    background-clip: content-box;
    border: 4px solid transparent;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: #999999;
    background-clip: content-box;
    border: 4px solid transparent;
  }

  ::-webkit-scrollbar-thumb:active {
    background: #646464;
    background-clip: content-box;
    border: 4px solid transparent;
  }
`;
