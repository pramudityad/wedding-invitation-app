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
import FloralDecorations from './FloralDecorations';

const StyledInvitationContainer = styled(Box)(({ theme }) => ({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  background: 'linear-gradient(135deg, #2a2520 0%, #1a1614 100%)',
  padding: theme.spacing(2, 4),
  position: 'relative',
  overflowX: 'hidden',
  '&::before': {
    content: '""',
    position: 'fixed',
    inset: 0,
    zIndex: 0,
    background: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22600%22%3E%3Cdefs%3E%3CradialGradient id=%22bg%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23f5f1e8;stop-opacity:1%22 /%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23e8dfd0;stop-opacity:1%22 /%3E%3C/radialGradient%3E%3C/defs%3E%3Crect width=%22400%22 height=%22600%22 fill=%22url(%23bg)%22/%3E%3C/svg%3E") center/cover',
    opacity: 0.03,
    pointerEvents: 'none',
  },
}));

const StyledInvitationWrapper = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 10,
  width: '100%',
  maxWidth: '500px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  paddingBottom: theme.spacing(8),
  [theme.breakpoints.down('sm')]: {
    maxWidth: '380px',
  },
}));

const StyledCard = styled(Box)(({ theme }) => ({
  position: 'relative',
  width: '100%',
  minHeight: '100vh',
  background: theme.palette.wedding.cream,
  boxShadow: '0 20px 60px rgba(107, 93, 84, 0.25), 0 10px 20px rgba(107, 93, 84, 0.15)',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  textAlign: 'center',
  overflow: 'visible',
  borderRadius: '10rem 10rem 0 0',
  animation: 'fadeInUp 1s ease-out',
  paddingBottom: theme.spacing(4),
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(40px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
}));

const InternalBorder = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: '1rem',
  borderRadius: '9rem 9rem 0 0',
  border: '1px solid rgba(107, 93, 84, 0.3)',
  pointerEvents: 'none',
}));

const StyledCardContent = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: theme.spacing(6, 3),
  zIndex: 20,
  position: 'relative',
}));

const PaperTexture = styled(Box)(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  pointerEvents: 'none',
  opacity: 0.04,
  backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22100%22 height=%22100%22%3E%3Cfilter id=%22noise%22%3E%3CfeTurbulence type=%22fractalNoise%22 baseFrequency=%220.9%22 numOctaves=%224%22 /%3E%3C/filter%3E%3Crect width=%22100%22 height=%22100%22 filter=%22url(%23noise)%22 opacity=%220.3%22/%3E%3C/svg%3E")',
  zIndex: 10,
}));

const RingsIcon = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(3),
  color: theme.palette.wedding.bronze,
  opacity: 0.9,
  animation: 'fadeIn 1.2s ease-out 0.3s both',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'scale(0.8)' },
    to: { opacity: 0.9, transform: 'scale(1)' },
  },
}));

const StyledWeddingTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '0.875rem',
  letterSpacing: '0.2em',
  textTransform: 'uppercase',
  color: theme.palette.wedding.bronze,
  marginBottom: theme.spacing(3),
  lineHeight: 1.8,
  animation: 'fadeIn 1.4s ease-out 0.5s both',
  fontWeight: 400,
}));

const StyledCoupleNames = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '4rem',
  color: theme.palette.wedding.bronze,
  lineHeight: 1,
  transform: 'rotate(-2deg)',
  animation: 'fadeIn 1.6s ease-out 0.7s both',
  marginBottom: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    fontSize: '5rem',
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '3rem',
  },
}));

const StyledDivider = styled(Box)(({ theme }) => ({
  width: '75%',
  marginBottom: theme.spacing(4),
  color: theme.palette.wedding.bronze,
  animation: 'fadeIn 2s ease-out 1.1s both',
}));

const StyledCountdownSection = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(4),
}));

const StyledCountdownLabel = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '0.875rem',
  fontStyle: 'italic',
  color: theme.palette.wedding.bronze,
  marginBottom: theme.spacing(1),
}));

const StyledCountdownValue = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 700,
  color: theme.palette.wedding.bronze,
  fontSize: '2rem',
  letterSpacing: '0.1em',
}));

const StyledWelcomeMessage = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  color: theme.palette.wedding.bronze,
  marginBottom: theme.spacing(4),
  fontSize: '0.9rem',
  lineHeight: 1.6,
}));

const SectionContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  marginBottom: theme.spacing(6),
  animation: 'fadeIn 2.4s ease-out 1.5s both',
  '& > *': {
    animation: 'fadeIn 2.6s ease-out 1.7s both',
  },
}));

const LanguageSwitcherWrapper = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1000,
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  backgroundColor: '#1a1614',
}));

const RingsIconSVG = () => (
  <svg viewBox="0 0 100 80" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: '4.5rem', height: '4.5rem' }}>
    <circle cx="35" cy="45" r="23" />
    <circle cx="65" cy="45" r="23" />
    <path d="M50 8 L54 18 L50 28 L46 18 Z" fill="currentColor" stroke="none" />
    <path d="M50 2 L50 8" strokeWidth="1" />
    <path d="M44 8 L56 8" strokeWidth="1" />
  </svg>
);

const DividerSVG = () => (
  <svg viewBox="0 0 200 20" fill="none" stroke="currentColor" strokeWidth="1">
    <path d="M10,10 Q50,20 100,10 Q150,0 190,10" opacity="0.5" />
    <circle cx="100" cy="10" r="3" fill="currentColor" />
    <path d="M90,10 Q80,10 85,5" strokeWidth="1" />
    <path d="M110,10 Q120,10 115,5" strokeWidth="1" />
  </svg>
);

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
    timeLeft: 0
  });

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

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

  const updateCountdown = useCallback(() => {
    if (!weddingDate) return;
    
    const now = new Date();
    const timeLeft = weddingDate - now;
    const absTimeLeft = Math.abs(timeLeft);

    const days = Math.floor(absTimeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor((absTimeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((absTimeLeft % (1000 * 60 * 60)) / (1000 * 60));

    setCountdown({ days, hours, minutes, timeLeft });
  }, [weddingDate]);

  useEffect(() => {
    if (!weddingDate) return;

    updateCountdown();

    const interval = setInterval(updateCountdown, 60000);
    return () => clearInterval(interval);
  }, [weddingDate, updateCountdown]);

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
      <LoadingContainer>
        <CircularProgress size={60} sx={{ color: '#C9A961' }} />
        <Typography sx={{ mt: 2, color: '#FFFEF5', fontFamily: "'Montserrat', sans-serif" }}>
          {t('invitation.loading')}
        </Typography>
      </LoadingContainer>
    );
  }

  return (
    <StyledInvitationContainer>
      <FloralDecorations />
      <StyledInvitationWrapper>
        <StyledCard>
          <InternalBorder />
          <PaperTexture />
          <LanguageSwitcherWrapper>
            <LanguageSwitcher />
          </LanguageSwitcherWrapper>

          <StyledCardContent>
            <RingsIcon>
              <RingsIconSVG />
            </RingsIcon>

            <StyledWeddingTitle>
              {t('invitation.title')}
            </StyledWeddingTitle>

            <StyledCoupleNames>
              {t('invitation.coupleNames')}
            </StyledCoupleNames>

            <StyledDivider>
              <DividerSVG />
            </StyledDivider>

            <StyledCountdownSection>
              <StyledCountdownLabel>
                {countdown.timeLeft > 0 ? t('invitation.countdownActive') : t('invitation.countdownPast')}
              </StyledCountdownLabel>
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

            <SectionContainer>
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
            </SectionContainer>
          </StyledCardContent>
        </StyledCard>
      </StyledInvitationWrapper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ zIndex: 2000 }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledInvitationContainer>
  );
}

export default memo(InvitationLanding);
