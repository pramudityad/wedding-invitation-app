import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#333',
    },
    secondary: {
      main: '#555',
    },
    background: {
      default: '#f9f9f7',
      paper: '#ffffff',
    },
    text: {
      primary: '#333',
      secondary: '#555',
    },
  },
  typography: {
    fontFamily: [
      '"Montserrat"',
      'sans-serif'
    ].join(','),
    h1: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 300,
      fontSize: '3rem',
    },
    h2: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 300,
    },
    h3: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 300,
    },
    h4: {
      fontFamily: '"Playfair Display", serif',
      fontWeight: 300,
    },
    h5: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 300,
    },
    h6: {
      fontFamily: '"Montserrat", sans-serif',
      fontWeight: 400,
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          textTransform: 'none',
          padding: '8px 24px',
        },
        outlined: {
          borderColor: '#333',
          color: '#333',
          '&:hover': {
            backgroundColor: 'rgba(0,0,0,0.04)',
            borderColor: '#222',
          }
        }
      }
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '6px',
            '& fieldset': {
              borderColor: '#e0e0e0',
            },
            '&:hover fieldset': {
              borderColor: '#999',
            },
          },
        }
      }
    }
  }
});

export default theme;