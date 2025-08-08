import { styled } from '@mui/material/styles';
import { Box, Typography, Alert } from '@mui/material';
import { MusicNote } from '@mui/icons-material';
import { useState } from 'react';

const StyledMusicContainer = styled(Box)(({ theme }) => ({
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
  maxWidth: 900,
  width: '100%',
  padding: theme.spacing(4, 6),
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
  backgroundColor: '#ffffff',
  border: '1px solid #e0e0e0',
}));

const StyledMusicTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 400,
  color: '#5a4c4d',
  marginBottom: theme.spacing(2),
  fontSize: theme.typography.pxToRem(32),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(36),
  },
}));

const StyledDescription = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  color: '#666',
  marginBottom: theme.spacing(4),
  fontSize: theme.typography.pxToRem(16),
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(18),
  },
}));

const StyledPlayerContainer = styled(Box)(({ theme }) => ({
  position: 'relative',
  paddingBottom: '56.25%', // 16:9 aspect ratio
  height: 0,
  overflow: 'hidden',
  borderRadius: '12px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
  border: '2px solid #e8e3d9',
  '& iframe': {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    border: 'none',
  },
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

export default function MusicPlayer() {
  const [playerError, setPlayerError] = useState(false);
  
  // Get playlist URL from environment variable
  const playlistUrl = import.meta.env.VITE_YOUTUBE_PLAYLIST_URL;
  const playlistId = extractPlaylistId(playlistUrl);

  const handlePlayerError = () => {
    setPlayerError(true);
  };

  if (!playlistUrl || !playlistId) {
    return (
      <StyledMusicContainer>
        <StyledCard>
          <StyledMusicTitle>
            <MusicNote sx={{ fontSize: 'inherit' }} />
            Wedding Playlist
          </StyledMusicTitle>
          <Alert severity="info" sx={{ mt: 2 }}>
            Music playlist is not configured yet. Please check back later!
          </Alert>
        </StyledCard>
      </StyledMusicContainer>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=0&controls=1&showinfo=1&rel=0&modestbranding=1`;

  return (
    <StyledMusicContainer>
      <StyledCard>
        <StyledMusicTitle>
          <MusicNote sx={{ fontSize: 'inherit' }} />
          Wedding Playlist
        </StyledMusicTitle>
        
        <StyledDescription>
          Enjoy our carefully curated wedding songs while you browse the invitation
        </StyledDescription>

        {playerError ? (
          <Alert severity="warning" sx={{ mt: 2 }}>
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
            mt: 3, 
            color: '#999', 
            fontStyle: 'italic',
            fontFamily: "'Montserrat', sans-serif"
          }}
        >
          Click on any song to start playing • Use the controls to adjust volume
        </Typography>
      </StyledCard>
    </StyledMusicContainer>
  );
}