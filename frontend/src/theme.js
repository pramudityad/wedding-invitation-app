import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#6B5D54',
    },
    secondary: {
      main: '#8B7355',
    },
    background: {
      default: '#1a1614',
      paper: '#FFFEF5',
    },
    text: {
      primary: '#6B5D54',
      secondary: '#8B7355',
    },
    wedding: {
      cream: '#FFFEF5',
      bronze: '#6B5D54',
      gold: '#C9A961',
      accent: '#8B7355',
    },
  },
  typography: {
    fontFamily: [
      '"Montserrat"',
      'sans-serif'
    ].join(','),
    h1: {
      fontFamily: '"Great Vibes", cursive',
      fontWeight: 400,
      fontSize: '3.5rem',
    },
    h2: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 400,
      fontSize: '1.75rem',
    },
    h3: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 400,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", serif',
      fontWeight: 400,
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