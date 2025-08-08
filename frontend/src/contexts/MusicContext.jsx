import { createContext, useContext, useState, useCallback, useMemo } from 'react';

const MusicContext = createContext();

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within a MusicProvider');
  }
  return context;
}

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

export function MusicProvider({ children }) {
  // Get playlist URL from environment variable
  const playlistUrl = import.meta.env.VITE_YOUTUBE_PLAYLIST_URL;
  const playlistId = extractPlaylistId(playlistUrl);
  
  // Music player state
  const [isPlayerVisible, setIsPlayerVisible] = useState(false);
  const [isPlayerExpanded, setIsPlayerExpanded] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  // Show the music player
  const showPlayer = useCallback(() => {
    if (playlistId) {
      setIsPlayerVisible(true);
      setIsInitialized(true);
    }
  }, [playlistId]);

  // Hide the music player
  const hidePlayer = useCallback(() => {
    setIsPlayerVisible(false);
    setIsPlayerExpanded(false);
  }, []);

  // Toggle player expanded state
  const togglePlayerExpanded = useCallback(() => {
    setIsPlayerExpanded(prev => !prev);
  }, []);

  // Handle player ready state
  const onPlayerReady = useCallback(() => {
    setIsPlayerReady(true);
    setHasError(false);
  }, []);

  // Handle player error
  const onPlayerError = useCallback(() => {
    setHasError(true);
    setIsPlayerReady(false);
  }, []);

  // Check if music is available
  const isMusicAvailable = Boolean(playlistUrl && playlistId);

  // Generate embed URL
  const embedUrl = playlistId 
    ? `https://www.youtube.com/embed/videoseries?list=${playlistId}&autoplay=0&controls=1&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&enablejsapi=1&origin=${window.location.origin}`
    : null;

  const value = useMemo(() => ({
    // State
    isPlayerVisible,
    isPlayerExpanded,
    isPlayerReady,
    hasError,
    isInitialized,
    isMusicAvailable,
    playlistId,
    embedUrl,
    
    // Actions
    showPlayer,
    hidePlayer,
    togglePlayerExpanded,
    onPlayerReady,
    onPlayerError,
  }), [
    isPlayerVisible,
    isPlayerExpanded,
    isPlayerReady,
    hasError,
    isInitialized,
    isMusicAvailable,
    playlistId,
    embedUrl,
    showPlayer,
    hidePlayer,
    togglePlayerExpanded,
    onPlayerReady,
    onPlayerError,
  ]);

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}