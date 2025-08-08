import { styled } from '@mui/material/styles';
import { Box, Typography, Alert, Collapse, IconButton } from '@mui/material';
import { MusicNote, ExpandMore, ExpandLess } from '@mui/icons-material';
import { useState } from 'react';

const StyledMusicSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledMusicHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  cursor: 'pointer',
  padding: theme.spacing(1),
  borderRadius: '8px',
  transition: 'background-color 0.2s',
  '&:hover': {
    backgroundColor: 'rgba(90, 76, 77, 0.05)',
  },
}));

const StyledMusicTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 400,
  color: '#5a4c4d',
  fontSize: theme.typography.pxToRem(24),
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(28),
  },
}));

const StyledPlayerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingBottom: '300px', // Fixed height for compact player
  height: 0,
  overflow: 'hidden',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  border: '2px solid #e8e3d9',
  backgroundColor: '#fff',
  '& iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  color: '#666',
  fontSize: theme.typography.pxToRem(14),
  textAlign: 'center',
  marginBottom: theme.spacing(2),
  fontStyle: 'italic',
}));

// Utility function to extract YouTube playlist ID from URL
const extractPlaylistId = (url) => {
  if (!url) return null;
  
  // Handle different YouTube URL formats
  const patterns = [
    /[?&]list=([^#\&\?]*)/,           // Standard playlist URL
    /youtube\.com\/playlist\?list=([^#\&\?]*)/,  // Direct playlist URL
    /youtu\.be\/.*[?&]list=([^#\&\?]*)/,         // Short URL with playlist
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  
  // If no pattern matches, assume the URL itself might be just the playlist ID
  if (url.length > 10 && url.length < 50 && !url.includes('/')) {
    return url;
  }
  
  return null;
};

export default function InlineMusicPlayer() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [playerError, setPlayerError] = useState(false);
  
  // Get playlist URL from environment variable
  const playlistUrl = import.meta.env.VITE_YOUTUBE_PLAYLIST_URL;
  const playlistId = extractPlaylistId(playlistUrl);

  const handleToggleExpanded = () => {
    setIsExpanded(!isExpanded);
  };

  const handlePlayerError = () => {
    setPlayerError(true);
  };

  // Don't render if no playlist URL is configured
  if (!playlistUrl || !playlistId) {
    return null;
  }

  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=0&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3`;

  return (
    <StyledMusicSection>
      <StyledMusicHeader onClick={handleToggleExpanded}>
        <StyledMusicTitle>
          <MusicNote sx={{ fontSize: 'inherit' }} />
          Wedding Playlist
        </StyledMusicTitle>
        <IconButton 
          size="small" 
          sx={{ 
            ml: 1, 
            color: '#5a4c4d',
            transition: 'transform 0.2s',
            transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        >
          <ExpandMore />
        </IconButton>
      </StyledMusicHeader>

      <Collapse in={isExpanded}>
        <StyledDescription>
          Enjoy our carefully selected wedding songs while you browse
        </StyledDescription>

        {playerError ? (
          <Alert severity="warning" sx={{ borderRadius: '12px' }}>
            Unable to load the music playlist. Please check your internet connection or try again later.
          </Alert>
        ) : (
          <StyledPlayerContainer>
            <iframe
              src={embedUrl}
              title="Wedding Playlist"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onError={handlePlayerError}
            />
          </StyledPlayerContainer>
        )}

        <Typography 
          variant="body2" 
          sx={{ 
            mt: 2, 
            color: '#999', 
            fontStyle: 'italic',
            textAlign: 'center',
            fontSize: '0.8rem',
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          Click any song to play • Use YouTube controls for volume
        </Typography>
      </Collapse>
    </StyledMusicSection>
  );
}