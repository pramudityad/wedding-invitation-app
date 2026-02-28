import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography, Tooltip, Alert } from '@mui/material';
import { MusicNote, Close, ExpandLess, ExpandMore } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useMusicContext } from '../contexts/MusicContext';
import { memo, useCallback } from 'react';

const StyledPlayerContainer = styled(Box)(({ theme }) => ({
  position: 'fixed',
  bottom: theme.spacing(2),
  right: theme.spacing(2),
  zIndex: 1300,
  maxWidth: '400px',
  [theme.breakpoints.down('sm')]: {
    bottom: theme.spacing(1),
    right: theme.spacing(1),
    left: theme.spacing(1),
    maxWidth: 'none',
  },
}));

const StyledMiniPlayer = styled(Box)(({ theme }) => ({
  backgroundColor: '#2C3E6B',
  borderRadius: '50px',
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#4A5E8B',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
  },
}));

const StyledExpandedPlayer = styled(Box)({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  border: '2px solid #E8D5A8',
  overflow: 'hidden',
});

const StyledPlayerHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#2C3E6B',
  color: 'white',
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StyledPlayerTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 400,
  fontSize: theme.typography.pxToRem(16),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StyledIframeContainer = styled(Box)({
  position: 'relative',
  paddingBottom: '225px',
  height: 0,
  backgroundColor: '#f5f5f5',
  '& iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
});

const StyledMiniPlayerText = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: theme.typography.pxToRem(14),
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 500,
}));

const StyledMiniPlayerIcon = styled(MusicNote)({
  color: 'white',
  fontSize: 24,
});

const StyledExpandIcon = styled(ExpandLess)({
  color: 'white',
  fontSize: 20,
});

const StyledMusicNoteInherit = styled(MusicNote)({
  fontSize: 'inherit',
});

const StyledMinimizeButton = styled(IconButton)({
  color: 'white',
  marginRight: '8px',
});

const StyledCloseButton = styled(IconButton)({
  color: 'white',
});

const StyledHiddenIframeContainer = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'expanded',
})(({ expanded }) => ({
  position: expanded ? 'relative' : 'absolute',
  top: expanded ? 'auto' : '-9999px',
  left: expanded ? 'auto' : '-9999px',
  width: expanded ? 'auto' : '1px',
  height: expanded ? 'auto' : '1px',
  opacity: expanded ? 1 : 0,
  pointerEvents: expanded ? 'auto' : 'none',
}));

const StyledErrorAlert = styled(Alert)({
  margin: '8px',
});

const StyledFooterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(1),
}));

const StyledEnjoyText = styled(Typography)({
  display: 'block',
  textAlign: 'center',
  color: '#666',
  marginTop: '8px',
  fontStyle: 'italic',
  fontFamily: "'Poppins', sans-serif",
});

function PersistentMusicPlayer() {
  const {
    isPlayerVisible,
    isPlayerExpanded,
    hasError,
    isMusicAvailable,
    embedUrl,
    hidePlayer,
    togglePlayerExpanded,
    onPlayerError,
  } = useMusicContext();
  const { t } = useTranslation();

  const handlePlayerError = useCallback(() => {
    onPlayerError();
  }, [onPlayerError]);

  if (!isMusicAvailable || !isPlayerVisible) {
    return null;
  }

  return (
    <StyledPlayerContainer>
      <StyledHiddenIframeContainer expanded={isPlayerExpanded}>
        {hasError ? (
          <StyledErrorAlert severity="warning">
            {t('music.connectionError')}
          </StyledErrorAlert>
        ) : (
          <StyledIframeContainer>
            <iframe
              src={embedUrl}
              title={t('music.playlistTitle')}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={handlePlayerError}
            />
          </StyledIframeContainer>
        )}
      </StyledHiddenIframeContainer>

      {!isPlayerExpanded ? (
        <StyledMiniPlayer onClick={togglePlayerExpanded}>
          <StyledMiniPlayerIcon />
          <StyledMiniPlayerText>
            {t('music.miniPlayerText')}
          </StyledMiniPlayerText>
          <StyledExpandIcon />
        </StyledMiniPlayer>
      ) : (
        <StyledExpandedPlayer>
          <StyledPlayerHeader>
            <StyledPlayerTitle>
              <StyledMusicNoteInherit />
              {t('music.playlistTitle')}
            </StyledPlayerTitle>
            <Box>
              <Tooltip title={t('common.minimize')}>
                <StyledMinimizeButton size="small" onClick={togglePlayerExpanded}>
                  <ExpandMore />
                </StyledMinimizeButton>
              </Tooltip>
              <Tooltip title={t('common.close')}>
                <StyledCloseButton size="small" onClick={hidePlayer}>
                  <Close />
                </StyledCloseButton>
              </Tooltip>
            </Box>
          </StyledPlayerHeader>

          <StyledFooterContainer>
            <StyledEnjoyText variant="caption">
              {t('music.enjoyPlaylist')}
            </StyledEnjoyText>
          </StyledFooterContainer>
        </StyledExpandedPlayer>
      )}
    </StyledPlayerContainer>
  );
}

export default memo(PersistentMusicPlayer);
