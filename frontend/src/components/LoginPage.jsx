import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

// Define styles as constants
const styles = {
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    width: '100vw',
    p: 4,
    backgroundColor: '#FBF7F0 !important',
    background: '#FBF7F0',
    position: 'relative'
  },
  innerCard: {
    maxWidth: 400,
    width: '100%',
    p: { xs: 3, md: 4 },
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(44, 62, 107, 0.08)',
    backgroundColor: '#ffffff',
    border: '1px solid #E8D5A8'
  },
  title: {
    fontFamily: "'Great Vibes', cursive",
    fontWeight: 400,
    color: '#2C3E6B',
    mb: 4,
    textAlign: 'center',
    fontSize: '36px',
  },
  buttonStatic: {
    py: 1.5,
    fontSize: '1rem',
    borderRadius: '8px',
    backgroundColor: '#2C3E6B',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#4A5E8B',
      boxShadow: '0 2px 6px rgba(44, 62, 107, 0.3)'
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
  const { name } = useParams();
  const { login } = useAuthContext();
  const { t } = useTranslation();

  useEffect(() => {
    if (name) {
      try {
        const decodedName = decodeURIComponent(name);
        handleAutoLogin(decodedName);
      } catch (error) {
        console.error('Error decoding name:', error);
        setError(t('login.invalidName'));
      }
    } else {
      setError(t('login.provideName'));
    }
  }, [name]);

  const handleAutoLogin = async (name) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(name)
      navigate('/')
    } catch (error) {
      console.error('Login failed:', error)
      setError(t('login.verificationFailed'))
      setIsLoading(false)
    }
  }

  return (
    <Box sx={styles.outerContainer}>
      <Box sx={{ 
        position: 'absolute', 
        top: 24, 
        right: 24, 
        zIndex: 10
      }}>
        <LanguageSwitcher />
      </Box>
      <Box sx={styles.innerCard}>
        <Typography variant="h5" component="h1" gutterBottom sx={styles.title}>
          {t('login.welcome')}
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
            {error}
          </Alert>
        )}

        {isLoading && (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mt: 3 }}>
            <CircularProgress size={24} sx={{ color: '#2C3E6B', mr: 1 }} /> {t('login.loggingIn')}
          </Box>
        )}
      </Box>
    </Box>
  );
}
