import { useState } from 'react';
import { 
  startSpotifyAuth,
  getPlaylists,
  playMusic,
  pauseMusic
} from '../api/spotify';

export const useSpotify = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);

  const authenticate = async () => {
    setLoading(true);
    setError(null);
    try {
      const authData = await startSpotifyAuth();
      return authData;
    } catch (err) {
      setError(err.message || 'Spotify authentication failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchPlaylists = async () => {
    setLoading(true);
    setError(null);
    try {
      const playlistData = await getPlaylists();
      setPlaylists(playlistData);
      return playlistData;
    } catch (err) {
      setError(err.message || 'Failed to fetch playlists');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePlay = async () => {
    setLoading(true);
    setError(null);
    try {
      await playMusic();
      setIsPlaying(true);
    } catch (err) {
      setError(err.message || 'Failed to play music');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const handlePause = async () => {
    setLoading(true);
    setError(null);
    try {
      await pauseMusic();
      setIsPlaying(false);
    } catch (err) {
      setError(err.message || 'Failed to pause music');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    playlists,
    isPlaying,
    authenticate,
    fetchPlaylists,
    play: handlePlay,
    pause: handlePause
  };
};