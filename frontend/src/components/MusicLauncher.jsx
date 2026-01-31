import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';
import { MusicNote, PlayArrow } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMusicContext } from '../contexts/MusicContext';

const StyledMusicSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
}));

const StyledMusicButton = styled(Button)(({ theme }) => ({
  backgroundColor: '#C9A961',
  color: 'white',
  borderRadius: '25px',
  padding: theme.spacing(1.5, 3),
  fontSize: '1rem',
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 500,
  textTransform: 'none',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#b89850',
    transform: 'translateY(-2px)',
    boxShadow: '0 4px 15px rgba(201, 169, 97, 0.3)',
  },
  '& .MuiButton-startIcon': {
    marginRight: theme.spacing(0.5),
  },
}));

export default function MusicLauncher() {
  const { isMusicAvailable, isPlayerVisible, showPlayer } = useMusicContext();
  const { t } = useTranslation();

  if (!isMusicAvailable || isPlayerVisible) {
    return null;
  }

  return (
    <StyledMusicSection>      
      <StyledMusicButton
        startIcon={<PlayArrow />}
        onClick={showPlayer}
      >
        <MusicNote sx={{ mr: 0.5 }} />
        {t('music.playButton')}
      </StyledMusicButton>
    </StyledMusicSection>
  );
}
