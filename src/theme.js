import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#FFD86B',
      contrastText: '#000',
    },
    secondary: {
      main: '#000',
      contrastText: '#fff',
    },
    background: {
      default: '#181A20',
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
});

export default theme;
