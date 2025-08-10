import { styled } from '@mui/material/styles';
import { Box, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts/AuthContext';
import { submitRSVP, getGuestByName, markInvitationOpened } from '../api/guest';
import { getAllComments } from '../api/comments';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';
import GuestCommentsSection from './GuestCommentsSection';
import RsvpSection from './RsvpSection';
import GiftBox from './GiftBox';
import MusicLauncher from './MusicLauncher';
import NavigationButtons from './NavigationButtons';
import LanguageSwitcher from './LanguageSwitcher';

const StyledInvitationContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundColor: '#f9f9f7',
  padding: theme.spacing(2, 4),
  textAlign: 'center',
}));

const StyledCard = styled(Box)(({ theme }) => ({
  maxWidth: 800,
  width: '100%',
  padding: theme.spacing(4, 6),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
}));

const StyledWeddingTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 400,
  color: '#333',
  marginBottom: theme.spacing(2),
  fontSize: theme.typography.pxToRem(32),
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(40),
  },
  [theme.breakpoints.up('md')]: {
    fontSize: theme.typography.pxToRem(48),
  },
}));

const StyledCoupleNames = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 600,
  color: '#5a4c4d',
  marginBottom: theme.spacing(4),
  fontSize: theme.typography.pxToRem(28),
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(32),
  },
  [theme.breakpoints.up('md')]: {
    fontSize: theme.typography.pxToRem(40),
  },
}));

const StyledCountdownSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(5),
}));

const StyledCountdownValue = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 600,
  color: '#5a4c4d',
  fontSize: theme.typography.pxToRem(24),
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(28),
  },
}));

const StyledWelcomeMessage = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  color: '#555',
  marginBottom: theme.spacing(5),
  fontSize: theme.typography.pxToRem(16),
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(18),
  },
  [theme.breakpoints.up('md')]: {
    fontSize: theme.typography.pxToRem(20),
  },
  lineHeight: 1.6,
}));

// Memoize JWT parsing function to avoid recreation on every render
const parseJwt = (token) => {
  try { 
    return JSON.parse(atob(token.split('.')[1])); 
  } catch { 
    return null; 
  }
};

function InvitationLanding() {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [featuredComments, setFeaturedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasMarkedOpenedRef = useRef(false);
  const [countdown, setCountdown] = useState({ 
    days: 0, 
    hours: 0, 
    minutes: 0,
    timeLeft: 0  // milliseconds until wedding; negative if wedding has passed
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  // Memoize wedding date to avoid recreation on every render
  const weddingDate = useMemo(() => {
    const dateStr = import.meta.env.VITE_APP_WEDDING_DATE;
    if (!dateStr) return null;
    const date = new Date(dateStr);
    if (isNaN(date)) {
      console.error('Invalid VITE_APP_WEDDING_DATE format. Use ISO-8601 format, e.g., 2024-10-05T17:00:00');
      return null;
    }
    return date;
  }, []);

  // Memoize countdown calculation function
  const updateCountdown = useCallback(() => {
    if (!weddingDate) return;
    
    const now = new Date();
    const timeLeft = weddingDate - now;
    const absTimeLeft = Math.abs(timeLeft);

    // Convert to days, hours, minutes
    const days = Math.floor(absTimeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absTimeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absTimeLeft % (1000 * 60 * 60)) / (1000 * 60));

    setCountdown({ days, hours, minutes, timeLeft });
  }, [weddingDate]);

  // Set up countdown timer
  useEffect(() => {
    if (!weddingDate) return;

    // Calculate immediately on mount
    updateCountdown();

    // Update every minute
    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [weddingDate, updateCountdown]);

  // Memoize JWT data to avoid parsing on every render
  const jwtData = useMemo(() => parseJwt(token), [token]);
  const currentUsername = jwtData?.username;

  useEffect(() => {
    if (!token || !currentUsername) {
      navigate('/login');
      return;
    }

    setUsername(currentUsername || '');

    const abortController = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [guestData, commentsData] = await Promise.all([
          getGuestByName(currentUsername, { signal: abortController.signal }),
          getAllComments({ limit: 3 }, { signal: abortController.signal })
        ]);

        if (abortController.signal.aborted) return;

        if (guestData?.Attending?.Valid) {
          setRsvpStatus(guestData.Attending.Bool);
        } else {
          setRsvpStatus(null);
        }

        setFeaturedComments(commentsData?.comments || []);

        if (guestData && !guestData.FirstOpenedAt?.Valid && !hasMarkedOpenedRef.current) {
          hasMarkedOpenedRef.current = true;
          markInvitationOpened().catch(err => {
            console.error('Failed to mark invitation as opened:', err);
            hasMarkedOpenedRef.current = false;
          });
        }
      } catch (error) {
        if (abortController.signal.aborted) return;
        console.error('Failed to fetch data:', error);
        setSnackbar({
          open: true,
          message: t('invitation.loadError'),
          severity: 'error',
        });
      } finally {
        if (abortController.signal.aborted) return;
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [token, currentUsername, navigate]);

  const handleRSVP = useCallback(async (attending) => {
    if (!username || rsvpStatus !== null || isLoading) return;

    setIsLoading(true);
    try {
      await submitRSVP({ attending, name: username });
      setRsvpStatus(attending);
      setSnackbar({
        open: true,
        message: attending
          ? t('invitation.rsvpYesSuccess')
          : t('invitation.rsvpNoSuccess'),
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
      setSnackbar({
        open: true,
        message: t('invitation.rsvpError'),
        severity: 'error',
      });
    } finally {
      setIsLoading(false);
    }
  }, [username, rsvpStatus, isLoading]);

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  if (isLoading && !username) {
    return (
      <Box sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '100vh', 
        backgroundColor: '#f9f9f7' 
      }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2, color: '#666', fontFamily: "'Montserrat', sans-serif" }}>
          {t('invitation.loading')}
        </Typography>
      </Box>
    );
  }

  return (
    <StyledInvitationContainer>
      <Box sx={{ position: 'absolute', top: 16, right: 16, zIndex: 1000 }}>
        <LanguageSwitcher />
      </Box>
      <StyledCard>
        <StyledWeddingTitle>
          {t('invitation.title')}
        </StyledWeddingTitle>

        <StyledCoupleNames>
          {t('invitation.coupleNames')}
        </StyledCoupleNames>

        <StyledCountdownSection>
          <Typography variant="h6" sx={{ 
            mb: 1,
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            color: '#333',
          }}>
            {countdown.timeLeft > 0 ? t('invitation.countdownActive') : t('invitation.countdownPast')}
          </Typography>
          <StyledCountdownValue>
            {countdown.timeLeft > 0 
              ? `${countdown.days}d : ${countdown.hours}h : ${countdown.minutes}m`
              : weddingDate?.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })
            }
          </StyledCountdownValue>
        </StyledCountdownSection>

        <StyledWelcomeMessage>
          {t('invitation.welcomeMessage')}<br />
          {username ? t('invitation.personalWelcome', { username }) : t('invitation.loading')}
        </StyledWelcomeMessage>

        <GuestCommentsSection 
          comments={featuredComments} 
          navigate={navigate} 
        />

        <MusicLauncher />

        <RsvpSection 
          rsvpStatus={rsvpStatus}
          isLoading={isLoading}
          handleRSVP={handleRSVP}
        />

        <GiftBox />

        <NavigationButtons navigate={navigate} />
      </StyledCard>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledInvitationContainer>
  );
}

// Wrap with memo to prevent unnecessary re-renders
export default memo(InvitationLanding);
