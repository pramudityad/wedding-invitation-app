import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';

const OuterContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100vw',
  padding: '32px',
  backgroundColor: '#FBF7F0 !important',
  background: '#FBF7F0',
  position: 'relative',
});

const LanguageSwitcherPositioner = styled(Box)({
  position: 'absolute',
  top: 24,
  right: 24,
  zIndex: 10,
});

const InnerCard = styled(Box)(({ theme }) => ({
  maxWidth: 400,
  width: '100%',
  padding: theme.spacing(3),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
  borderRadius: '12px',
  boxShadow: '0 4px 20px rgba(44, 62, 107, 0.08)',
  backgroundColor: '#ffffff',
  border: '1px solid #E8D5A8',
}));

const StyledTitle = styled(Typography)({
  fontFamily: "'Great Vibes', cursive",
  fontWeight: 400,
  color: '#2C3E6B',
  marginBottom: '32px',
  textAlign: 'center',
  fontSize: '36px',
});

const StyledErrorAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: theme.spacing(3),
}));

const StyledCircularProgress = styled(CircularProgress)({
  color: '#2C3E6B',
  marginRight: '8px',
});

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
    <OuterContainer>
      <LanguageSwitcherPositioner>
        <LanguageSwitcher />
      </LanguageSwitcherPositioner>
      <InnerCard>
        <StyledTitle variant="h5" component="h1" gutterBottom>
          {t('login.welcome')}
        </StyledTitle>

        {error && (
          <StyledErrorAlert severity="error">
            {error}
          </StyledErrorAlert>
        )}

        {isLoading && (
          <LoadingContainer>
            <StyledCircularProgress size={24} /> {t('login.loggingIn')}
          </LoadingContainer>
        )}
      </InnerCard>
    </OuterContainer>
  );
}
