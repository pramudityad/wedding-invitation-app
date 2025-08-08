import { styled } from '@mui/material/styles';
import { Box, IconButton, Typography, Tooltip, Collapse, Alert } from '@mui/material';
import { MusicNote, Close, ExpandLess, ExpandMore } from '@mui/icons-material';
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
  backgroundColor: '#5a4c4d',
  borderRadius: '50px',
  padding: theme.spacing(1),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
  cursor: 'pointer',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#4a3c3d',
    transform: 'translateY(-2px)',
    boxShadow: '0 6px 25px rgba(0,0,0,0.4)',
  },
}));

const StyledExpandedPlayer = styled(Box)(({ theme }) => ({
  backgroundColor: '#ffffff',
  borderRadius: '12px',
  boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
  border: '2px solid #e8e3d9',
  overflow: 'hidden',
}));

const StyledPlayerHeader = styled(Box)(({ theme }) => ({
  backgroundColor: '#5a4c4d',
  color: 'white',
  padding: theme.spacing(1, 2),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
}));

const StyledPlayerTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 400,
  fontSize: theme.typography.pxToRem(16),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
}));

const StyledIframeContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingBottom: '225px', // Fixed height for compact player
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
}));

const StyledMiniPlayerText = styled(Typography)(({ theme }) => ({
  color: 'white',
  fontSize: theme.typography.pxToRem(14),
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
}));

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

  // Don't render if music is not available or player is not visible
  if (!isMusicAvailable || !isPlayerVisible) {
    return null;
  }

  const handlePlayerError = useCallback(() => {
    onPlayerError();
  }, [onPlayerError]);

  return (
    <StyledPlayerContainer>
      {/* Always render the iframe to keep music playing, hidden when minimized */}
      <Box 
        sx={{ 
          position: 'absolute',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
          ...(isPlayerExpanded && {
            position: 'relative',
            top: 'auto',
            left: 'auto',
            width: 'auto',
            height: 'auto',
            opacity: 1,
            pointerEvents: 'auto'
          })
        }}
      >
        {hasError ? (
          <Alert severity="warning" sx={{ m: 1 }}>
            Unable to load playlist. Please check your connection.
          </Alert>
        ) : (
          <StyledIframeContainer>
            <iframe
              src={embedUrl}
              title="Wedding Playlist"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={handlePlayerError}
            />
          </StyledIframeContainer>
        )}
      </Box>

      {!isPlayerExpanded ? (
        // Mini Player
        <StyledMiniPlayer onClick={togglePlayerExpanded}>
          <MusicNote sx={{ color: 'white', fontSize: 24 }} />
          <StyledMiniPlayerText>
            Wedding Music
          </StyledMiniPlayerText>
          <ExpandLess sx={{ color: 'white', fontSize: 20 }} />
        </StyledMiniPlayer>
      ) : (
        // Expanded Player
        <StyledExpandedPlayer>
          <StyledPlayerHeader>
            <StyledPlayerTitle>
              <MusicNote sx={{ fontSize: 'inherit' }} />
              Wedding Playlist
            </StyledPlayerTitle>
            <Box>
              <Tooltip title="Minimize">
                <IconButton 
                  size="small" 
                  onClick={togglePlayerExpanded}
                  sx={{ color: 'white', mr: 1 }}
                >
                  <ExpandMore />
                </IconButton>
              </Tooltip>
              <Tooltip title="Close">
                <IconButton 
                  size="small" 
                  onClick={hidePlayer}
                  sx={{ color: 'white' }}
                >
                  <Close />
                </IconButton>
              </Tooltip>
            </Box>
          </StyledPlayerHeader>

          <Box sx={{ p: 1 }}>
            <Typography 
              variant="caption" 
              sx={{ 
                display: 'block',
                textAlign: 'center',
                color: '#666',
                mt: 1,
                fontStyle: 'italic',
                fontFamily: "'Montserrat', sans-serif"
              }}
            >
              Enjoy our wedding playlist while browsing
            </Typography>
          </Box>
        </StyledExpandedPlayer>
      )}
    </StyledPlayerContainer>
  );
}

// Wrap with memo to prevent unnecessary iframe re-renders
export default memo(PersistentMusicPlayer);