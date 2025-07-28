import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

// Define styles as constants
const styles = {
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    p: 4,
    backgroundColor: '#f9f9f7'
  },
  innerCard: {
    maxWidth: 400,
    width: '100%',
    p: { xs: 3, md: 4 },
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 400,
    color: '#333',
    mb: 4,
    textAlign: 'center'
  },
  buttonStatic: {
    py: 1.5,
    fontSize: '1rem',
    borderRadius: '8px',
    backgroundColor: '#a7a7a3',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#999990',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    },
    '&:disabled': {
      backgroundColor: '#cccccc',
      color: '#666666'
    }
  }
};

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthContext();

  useEffect(() => {
    const pathSegments = window.location.pathname.split('/');
    const loginIndex = pathSegments.findIndex(segment => segment === 'login');
    
    if (loginIndex !== -1 && loginIndex < pathSegments.length - 1) {
      const encodedName = pathSegments[loginIndex + 1];
      try {
        const name = decodeURIComponent(encodedName);
        handleAutoLogin(name);
      } catch (error) {
        console.error('Error decoding name:', error);
        setError('Invalid name format. Please check the URL.');
      }
    } else {
      setError('Please provide your name in the URL path.');
    }
  }, []);

  const handleAutoLogin = async (name) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(name)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      setError('Could not verify your name. Please check the URL.')
      setIsLoading(false)
    }
  }

  return (
    <Box sx={styles.outerContainer}>
      <Box sx={styles.innerCard}>
        <Typography variant="h5" component="h1" gutterBottom sx={styles.title}>
          Welcome, Please Log In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
            <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> Logging in...
          </Box>
        )}
      </Box>
    </Box>
  );
}
