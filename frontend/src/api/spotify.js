import api from './axiosConfig';

export const startSpotifyAuth = async () => {
  try {
    const response = await api.get('/spotify/auth');
    return response.data;
  } catch (error) {
    console.error('Spotify auth failed:', error);
    throw error;
  }
};

export const getPlaylists = async () => {
  try {
    const response = await api.get('/spotify/playlists');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch playlists:', error);
    throw error;
  }
};

export const playMusic = async () => {
  try {
    const response = await api.post('/spotify/play', {});
    return response.data;
  } catch (error) {
    console.error('Play command failed:', error);
    throw error;
  }
};

export const pauseMusic = async () => {
  try {
    const response = await api.post('/spotify/pause', {});
    return response.data;
  } catch (error) {
    console.error('Pause command failed:', error);
    throw error;
  }
};