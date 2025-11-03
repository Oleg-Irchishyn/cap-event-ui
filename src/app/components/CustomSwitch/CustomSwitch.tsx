import { FC } from 'react';
import { ThemeProvider, createTheme, styled } from '@mui/material/styles';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch, { SwitchProps } from '@mui/material/Switch';
import { Wrapper } from './styles';

const muiTheme = createTheme({
  typography: {
    fontFamily: 'var(--font-ibm-plex-sans), "IBM Plex Sans", "Arial", sans-serif',
  },
});

const IOSSwitch = styled((props: SwitchProps) => (
  <Switch focusVisibleClassName=".Mui-focusVisible" disableRipple {...props} />
))(({ theme }) => ({
  width: 40,
  height: 24,
  padding: 0,

  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 2,
    transitionDuration: '300ms',
    '&.Mui-checked': {
      transform: 'translateX(16px)',
      color: '#fff',
      '& + .MuiSwitch-track': {
        backgroundColor: '#0067A3',
        opacity: 1,
        border: 0,
        ...theme.applyStyles('dark', {
          backgroundColor: '#003470',
        }),
      },
      '&.Mui-disabled + .MuiSwitch-track': {
        opacity: 0.5,
      },
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      color: '#003470',
      border: '6px solid #fff',
    },
    '&.Mui-disabled .MuiSwitch-thumb': {
      color: theme.palette.grey[100],
      ...theme.applyStyles('dark', {
        color: theme.palette.grey[600],
      }),
    },
    '&.Mui-disabled + .MuiSwitch-track': {
      opacity: 0.7,
      ...theme.applyStyles('dark', {
        opacity: 0.3,
      }),
    },
  },
  '& .MuiSwitch-thumb': {
    boxSizing: 'border-box',
    width: 20,
    height: 20,
  },
  '& .MuiSwitch-track': {
    borderRadius: 26 / 2,
    backgroundColor: '#E9E9EA',
    opacity: 1,
    transition: theme.transitions.create(['background-color'], {
      duration: 500,
    }),
    ...theme.applyStyles('dark', {
      backgroundColor: '#39393D',
    }),
  },
}));

type Props = {
  checked: boolean;
  onChange: () => void;
  label?: string;
  disabled?: boolean;
};

const CustomSwitch: FC<Props> = ({ label, disabled, checked, onChange }) => {
  return (
    <Wrapper>
      <ThemeProvider theme={muiTheme}>
        <FormControlLabel
          label={label}
          disabled={disabled}
          style={{ marginRight: 0 }}
          slotProps={{ typography: { fontSize: 14 } }}
          control={
            <IOSSwitch checked={checked} onChange={onChange} disabled={disabled} sx={{ m: 1 }} />
          }
        />
      </ThemeProvider>
    </Wrapper>
  );
};

export default CustomSwitch;
