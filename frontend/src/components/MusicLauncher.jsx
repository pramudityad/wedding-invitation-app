import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { MusicNote, PlayArrow } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMusicContext } from '../contexts/MusicContext';

const StyledMusicSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const StyledMusicButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#5a4c4d',
  color: 'white',
  borderRadius: '25px',
  padding: theme.spacing(1.5, 3),
  fontSize: theme.typography.pxToRem(16),
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#4a3c3d',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(90, 76, 77, 0.3)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(1),
  },
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  color: '#666',
  fontSize: theme.typography.pxToRem(14),
  marginBottom: theme.spacing(2),
  fontStyle: 'italic',
}));

export default function MusicLauncher() {
  const { isMusicAvailable, isPlayerVisible, showPlayer } = useMusicContext();
  const { t } = useTranslation();

  // Don't render if music is not available or player is already visible
  if (!isMusicAvailable || isPlayerVisible) {
    return null;
  }

  return (
    <StyledMusicSection>      
      <StyledMusicButton
        startIcon={<PlayArrow />}
        onClick={showPlayer}
      >
        <MusicNote sx={{ mr: 1 }} />
        {t('music.playButton')}
      </StyledMusicButton>
    </StyledMusicSection>
  );
}