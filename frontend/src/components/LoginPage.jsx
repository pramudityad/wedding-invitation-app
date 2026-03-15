import { Box, Typography, CircularProgress, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts/AuthContext';
import LanguageSwitcher from './LanguageSwitcher';
import { COLORS } from '../constants';

const OuterContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  width: '100vw',
  padding: '32px',
  backgroundColor: `${COLORS.background} !important`,
  background: COLORS.background,
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
  backgroundColor: COLORS.white,
  border: `1px solid ${COLORS.goldLight}`,
}));

const StyledTitle = styled(Typography)({
  fontFamily: "'Great Vibes', cursive",
  fontWeight: 400,
  color: COLORS.navy,
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
  color: COLORS.navy,
  marginRight: '8px',
});

export default function LoginPage() {
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { name } = useParams();
  const { login } = useAuthContext();
  const { t } = useTranslation();

  const handleAutoLogin = useCallback(async (guestName) => {
    setIsLoading(true);
    setError('');
    
    try {
      await login(guestName);
      navigate('/');
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('Login failed:', err);
      setError(t('login.verificationFailed'));
      setIsLoading(false);
    }
  }, [login, navigate, t]);

  useEffect(() => {
    if (name) {
      try {
        const decodedName = decodeURIComponent(name);
        handleAutoLogin(decodedName);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.error('Error decoding name:', err);
        setError(t('login.invalidName'));
      }
    } else {
      setError(t('login.provideName'));
    }
  }, [name, handleAutoLogin, t]);

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
