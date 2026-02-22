import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#2C3E6B', // navy
    },
    secondary: {
      main: '#C9A96E', // gold
    },
    background: {
      default: '#FBF7F0', // warm-white
      paper: '#FFFFFF',
    },
    text: {
      primary: '#3A3A3A',
      secondary: '#5A5A5A',
    },
    wedding: {
      cream: '#F5EDE3',
      gold: '#C9A96E',
      goldLight: '#E8D5A8',
      navy: '#2C3E6B',
      navyLight: '#4A5E8B',
      blush: '#F0E0D0',
      sky: '#B8CDE8',
      skyLight: '#D4E3F5',
      warmWhite: '#FBF7F0',
    },
  },
  typography: {
    fontFamily: ['"Poppins"', 'sans-serif'].join(','),
    h1: {
      fontFamily: '"Great Vibes", cursive',
      fontWeight: 400,
    },
    h2: {
      fontFamily: '"Great Vibes", cursive',
      fontWeight: 400,
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
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 300,
    },
    h6: {
      fontFamily: '"Poppins", sans-serif',
      fontWeight: 400,
    },
    body1: {
      fontFamily: '"Poppins", sans-serif',
    },
    body2: {
      fontFamily: '"Poppins", sans-serif',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
        },
        body: {
          overflowX: 'hidden',
          background: '#FBF7F0',
        },
        '::-webkit-scrollbar': {
          width: '4px',
        },
        '::-webkit-scrollbar-track': {
          background: 'transparent',
        },
        '::-webkit-scrollbar-thumb': {
          background: '#E8D5A8',
          borderRadius: '4px',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '4px',
          textTransform: 'uppercase',
          fontFamily: '"Poppins", sans-serif',
          letterSpacing: '2px',
          fontSize: '12px',
        },
        outlined: {
          borderColor: '#2C3E6B',
          color: '#2C3E6B',
          '&:hover': {
            backgroundColor: '#2C3E6B',
            color: '#FFFFFF',
            borderColor: '#2C3E6B',
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: '4px',
            fontFamily: '"Poppins", sans-serif',
            fontSize: '13px',
            '& fieldset': {
              borderColor: '#E8D5A8',
            },
            '&:hover fieldset': {
              borderColor: '#C9A96E',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2C3E6B',
            },
          },
        },
      },
    },
  },
});

export default theme;
