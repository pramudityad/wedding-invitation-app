import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const Overlay = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'visible',
})(({ visible }) => ({
  position: 'fixed',
  inset: 0,
  background: 'rgba(251,247,240,0.95)',
  backdropFilter: 'blur(8px)',
  zIndex: 50,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'opacity 0.8s ease, visibility 0.8s ease',
  ...(visible ? {} : {
    opacity: 0,
    visibility: 'hidden',
    pointerEvents: 'none',
  }),
}));

const CoverSection = styled(Box)({
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 30px',
  position: 'relative',
  maxWidth: '520px',
  width: '100%',
  textAlign: 'center',
});

const CoupleNamesCover = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '52px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  lineHeight: 1.2,
  marginBottom: '8px',
  animation: 'fadeInUp 1.2s ease-out',
  '@keyframes fadeInUp': {
    from: { opacity: 0, transform: 'translateY(30px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  [theme.breakpoints.down('sm')]: {
    fontSize: '42px',
  },
}));

const GettingMarried = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '11px',
  letterSpacing: '4px',
  textTransform: 'uppercase',
  color: theme.palette.wedding?.navyLight || '#4A5E8B',
  marginBottom: '40px',
  animation: 'fadeInUp 1.2s ease-out 0.2s both',
}));

const DearLabel = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '12px',
  color: '#5A5A5A',
  marginBottom: '4px',
  animation: 'fadeInUp 1.2s ease-out 0.4s both',
});

const GuestNameText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '32px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginBottom: '40px',
  animation: 'fadeInUp 1.2s ease-out 0.5s both',
  [theme.breakpoints.down('sm')]: {
    fontSize: '26px',
  },
}));

const OpenButton = styled(Button)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '11px',
  letterSpacing: '3px',
  textTransform: 'uppercase',
  padding: '14px 36px',
  border: `1.5px solid ${theme.palette.wedding?.navy || '#2C3E6B'}`,
  background: 'transparent',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  borderRadius: 0,
  animation: 'fadeInUp 1.2s ease-out 0.7s both',
  transition: 'all 0.4s ease',
  '&:hover': {
    background: theme.palette.wedding?.navy || '#2C3E6B',
    color: '#FFFFFF',
  },
}));

export default function SplashOverlay({ visible, guestName, onOpen }) {
  const { t } = useTranslation();

  const brideShort = import.meta.env.VITE_BRIDE_SHORT_NAME || 'Bride';
  const groomShort = import.meta.env.VITE_GROOM_SHORT_NAME || 'Groom';

  return (
    <Overlay visible={visible}>
      <CoverSection>
        <CoupleNamesCover>
          {brideShort} & {groomShort}
        </CoupleNamesCover>
        <GettingMarried>{t('splash.areGettingMarried')}</GettingMarried>
        <DearLabel>{t('splash.dear')}</DearLabel>
        <GuestNameText>{guestName || t('common.guest')}</GuestNameText>
        <OpenButton onClick={onOpen}>
          {t('splash.openButton')}
        </OpenButton>
      </CoverSection>
    </Overlay>
  );
}
