import { Box, Typography, Button } from '@mui/material';

export default function MusicPlayer() {
  return (
    <Box sx={{ p: 2, textAlign: 'center' }}>
      <Typography variant="h5" gutterBottom>
        Wedding Playlist
      </Typography>
      <Typography variant="body1" sx={{ mb: 3 }}>
        Enjoy our selected wedding songs
      </Typography>
      <Button 
        variant="contained" 
        color="secondary"
        onClick={() => alert('Spotify integration coming soon!')}
      >
        Connect to Spotify
      </Button>
    </Box>
  );
}