import { styled } from '@mui/material/styles';
import { Box, Typography, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
import { submitRSVP, getGuestByName, markInvitationOpened } from '../api/guest';
import { getAllComments } from '../api/comments';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef } from 'react';
import GuestCommentsSection from './GuestCommentsSection';
import RsvpSection from './RsvpSection';
import NavigationButtons from './NavigationButtons';

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

export default function InvitationLanding() {
  const navigate = useNavigate();
  const { token } = useAuthContext();

  const [username, setUsername] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [featuredComments, setFeaturedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasMarkedOpenedRef = useRef(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    const parseJwt = (token) => {
      try { 
        return JSON.parse(atob(token.split('.')[1])); 
      } catch { 
        return null; 
      }
    };

    const jwtData = parseJwt(token);
    const currentUsername = jwtData?.username;

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
          message: "Failed to load your data. Please refresh to try again.",
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
  }, [token, navigate]);

  const handleRSVP = useCallback(async (attending) => {
    if (!username || rsvpStatus !== null || isLoading) return;

    setIsLoading(true);
    try {
      await submitRSVP({ attending, name: username });
      setRsvpStatus(attending);
      setSnackbar({
        open: true,
        message: attending
          ? "We're thrilled you'll be celebrating with us!"
          : "We'll miss you but thank you for letting us know.",
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
      setSnackbar({
        open: true,
        message: 'Failed to submit RSVP. Please try again later.',
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
          Loading your invitation...
        </Typography>
      </Box>
    );
  }

  return (
    <StyledInvitationContainer>
      <StyledCard>
        <StyledWeddingTitle>
          You're Invited
        </StyledWeddingTitle>

        <StyledCoupleNames>
          [Couple's Names]
        </StyledCoupleNames>

        <StyledWelcomeMessage>
          We invite you to share in our joy as we unite in marriage.<br />
          {username ? `A special welcome to ${username}!` : 'Loading welcome message...'}
        </StyledWelcomeMessage>

        <GuestCommentsSection 
          comments={featuredComments} 
          navigate={navigate} 
        />

        <RsvpSection 
          rsvpStatus={rsvpStatus}
          isLoading={isLoading}
          handleRSVP={handleRSVP}
        />

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
