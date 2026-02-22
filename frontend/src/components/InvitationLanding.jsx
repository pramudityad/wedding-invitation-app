import { Box, Snackbar, Alert, CircularProgress, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts/AuthContext';
import { useMusicContext } from '../contexts/MusicContext';
import { submitRSVP, getGuestByName, markInvitationOpened } from '../api/guest';
import { getAllComments } from '../api/comments';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect, useCallback, useRef, useMemo, memo } from 'react';

import WatercolorBackground from './WatercolorBackground';
import SplashOverlay from './SplashOverlay';
import SectionDivider from './SectionDivider';
import QuranSection from './QuranSection';
import EventSection from './EventSection';
import CountdownSection from './CountdownSection';
import CoupleSection from './CoupleSection';
import RsvpSection from './RsvpSection';
import WishesPreview from './WishesPreview';
import GiftBox from './GiftBox';
import ThankYouSection from './ThankYouSection';
import MusicLauncher from './MusicLauncher';
import LanguageSwitcher from './LanguageSwitcher';

const PageWrapper = styled(Box)({
  maxWidth: '520px',
  margin: '0 auto',
  position: 'relative',
  zIndex: 1,
});

const AnimatedSection = styled(Box)({
  opacity: 0,
  transform: 'translateY(30px)',
  transition: 'opacity 0.8s ease-out, transform 0.8s ease-out',
  '&.visible': {
    opacity: 1,
    transform: 'translateY(0)',
  },
});

const GalleryLinkButton = styled(Button)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  padding: '12px 32px',
  border: `1.5px solid ${theme.palette.wedding?.navy || '#2C3E6B'}`,
  color: theme.palette.wedding?.navy || '#2C3E6B',
  borderRadius: 0,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.wedding?.navy || '#2C3E6B',
    color: '#FFFFFF',
  },
}));

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
  const { showPlayer } = useMusicContext();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [featuredComments, setFeaturedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasMarkedOpenedRef = useRef(false);

  const [splashVisible, setSplashVisible] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);
  const observerRef = useRef(null);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const jwtData = useMemo(() => parseJwt(token), [token]);
  const currentUsername = jwtData?.username;

  useEffect(() => {
    if (!token || !currentUsername) {
      navigate('/invite');
      return;
    }

    setUsername(currentUsername || '');

    const abortController = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [guestData, commentsData] = await Promise.all([
          getGuestByName(currentUsername, { signal: abortController.signal }),
          getAllComments({ limit: 3 }, { signal: abortController.signal }),
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
          markInvitationOpened().catch((err) => {
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
  }, [token, currentUsername, navigate, t]);

  const handleOpenInvitation = useCallback(() => {
    setSplashVisible(false);
    setMainVisible(true);

    if (showPlayer) {
      showPlayer();
    }

    // Start IntersectionObserver for scroll animations
    setTimeout(() => {
      const sections = document.querySelectorAll('.animate-on-scroll');
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible');
            }
          });
        },
        { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
      );
      sections.forEach((section) => observerRef.current.observe(section));
    }, 100);
  }, [showPlayer]);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  const handleRSVP = useCallback(
    async (attending) => {
      if (!username || rsvpStatus !== null || isLoading) return;

      setIsLoading(true);
      try {
        await submitRSVP({ attending, name: username });
        setRsvpStatus(attending);
        setSnackbar({
          open: true,
          message: attending ? t('invitation.rsvpYesSuccess') : t('invitation.rsvpNoSuccess'),
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
    },
    [username, rsvpStatus, isLoading, t]
  );

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  if (isLoading && !username) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          background: '#FBF7F0',
        }}
      >
        <CircularProgress size={60} sx={{ color: '#2C3E6B' }} />
        <Typography
          sx={{
            mt: 2,
            color: '#2C3E6B',
            fontFamily: "'Poppins', sans-serif",
          }}
        >
          {t('invitation.loading')}
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <WatercolorBackground />

      <SplashOverlay visible={splashVisible} guestName={username} onOpen={handleOpenInvitation} />

      <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1100 }}>
        <LanguageSwitcher />
      </Box>

      {mainVisible && (
        <PageWrapper>
          <AnimatedSection className="animate-on-scroll">
            <QuranSection />
          </AnimatedSection>

          <SectionDivider />

          <AnimatedSection className="animate-on-scroll">
            <EventSection />
          </AnimatedSection>

          <SectionDivider />

          <AnimatedSection className="animate-on-scroll">
            <CountdownSection />
          </AnimatedSection>

          <SectionDivider />

          <AnimatedSection className="animate-on-scroll">
            <CoupleSection />
          </AnimatedSection>

          <SectionDivider />

          <AnimatedSection className="animate-on-scroll">
            <RsvpSection rsvpStatus={rsvpStatus} isLoading={isLoading} handleRSVP={handleRSVP} />
          </AnimatedSection>

          <SectionDivider />

          <AnimatedSection className="animate-on-scroll">
            <WishesPreview comments={featuredComments} navigate={navigate} username={username} />
          </AnimatedSection>

          <SectionDivider />

          <AnimatedSection className="animate-on-scroll">
            <GiftBox />
          </AnimatedSection>

          <SectionDivider />

          <AnimatedSection className="animate-on-scroll">
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <GalleryLinkButton onClick={() => navigate('/gallery')}>
                {t('navigation.photoGallery')}
              </GalleryLinkButton>
            </Box>
          </AnimatedSection>

          <SectionDivider />

          <AnimatedSection className="animate-on-scroll">
            <ThankYouSection />
          </AnimatedSection>

          <Box sx={{ textAlign: 'center', py: 2 }}>
            <MusicLauncher />
          </Box>
        </PageWrapper>
      )}

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
    </>
  );
}

export default memo(InvitationLanding);
