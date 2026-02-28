import { Box, Snackbar, Alert, CircularProgress, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useMusicContext } from '../contexts/MusicContext';
import { useNavigate } from 'react-router-dom';
import { useState, useCallback, memo } from 'react';

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
import useScrollAnimation from '../hooks/useScrollAnimation';
import useGuestData from '../hooks/useGuestData';

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

const LoadingContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: '#FBF7F0',
});

const StyledCircularProgress = styled(CircularProgress)({
  color: '#2C3E6B',
});

const LoadingText = styled(Typography)({
  marginTop: '16px',
  color: '#2C3E6B',
  fontFamily: "'Poppins', sans-serif",
});

const LanguageSwitcherContainer = styled(Box)({
  position: 'fixed',
  top: 16,
  right: 16,
  zIndex: 1100,
});

const GalleryLinkContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(4),
}));

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

const MusicLauncherContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(2),
  paddingBottom: theme.spacing(2),
}));

const StyledSnackbarAlert = styled(Alert)({
  width: '100%',
});

const ScrollSection = memo(function ScrollSection({ children, enabled }) {
  const [ref, isVisible] = useScrollAnimation(enabled);
  return (
    <AnimatedSection ref={ref} className={isVisible ? 'visible' : ''}>
      {children}
    </AnimatedSection>
  );
});

function InvitationLanding() {
  const navigate = useNavigate();
  const { showPlayer } = useMusicContext();
  const { t } = useTranslation();

  const {
    username,
    rsvpStatus,
    featuredComments,
    isLoading,
    handleRSVP,
    snackbar,
    handleCloseSnackbar,
  } = useGuestData();

  const [splashVisible, setSplashVisible] = useState(true);
  const [mainVisible, setMainVisible] = useState(false);

  const handleOpenInvitation = useCallback(() => {
    setSplashVisible(false);
    setMainVisible(true);

    if (showPlayer) {
      showPlayer();
    }
  }, [showPlayer]);

  if (isLoading && !username) {
    return (
      <LoadingContainer>
        <StyledCircularProgress size={60} />
        <LoadingText>
          {t('invitation.loading')}
        </LoadingText>
      </LoadingContainer>
    );
  }

  return (
    <>
      <WatercolorBackground />

      <SplashOverlay visible={splashVisible} guestName={username} onOpen={handleOpenInvitation} />

      <LanguageSwitcherContainer>
        <LanguageSwitcher />
      </LanguageSwitcherContainer>

      {mainVisible && (
        <PageWrapper>
          <ScrollSection enabled={mainVisible}>
            <QuranSection />
          </ScrollSection>

          <SectionDivider />

          <ScrollSection enabled={mainVisible}>
            <EventSection />
          </ScrollSection>

          <SectionDivider />

          <ScrollSection enabled={mainVisible}>
            <CountdownSection />
          </ScrollSection>

          <SectionDivider />

          <ScrollSection enabled={mainVisible}>
            <CoupleSection />
          </ScrollSection>

          <SectionDivider />

          <ScrollSection enabled={mainVisible}>
            <RsvpSection rsvpStatus={rsvpStatus} isLoading={isLoading} handleRSVP={handleRSVP} />
          </ScrollSection>

          <SectionDivider />

          <ScrollSection enabled={mainVisible}>
            <WishesPreview comments={featuredComments} navigate={navigate} username={username} />
          </ScrollSection>

          <SectionDivider />

          <ScrollSection enabled={mainVisible}>
            <GiftBox />
          </ScrollSection>

          <SectionDivider />

          <ScrollSection enabled={mainVisible}>
            <GalleryLinkContainer>
              <GalleryLinkButton onClick={() => navigate('/gallery')}>
                {t('navigation.photoGallery')}
              </GalleryLinkButton>
            </GalleryLinkContainer>
          </ScrollSection>

          <SectionDivider />

          <ScrollSection enabled={mainVisible}>
            <ThankYouSection />
          </ScrollSection>

          <MusicLauncherContainer>
            <MusicLauncher />
          </MusicLauncherContainer>
        </PageWrapper>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <StyledSnackbarAlert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </StyledSnackbarAlert>
      </Snackbar>
    </>
  );
}

export default memo(InvitationLanding);
