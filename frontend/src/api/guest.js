import api from './axiosConfig';

export const submitRSVP = async (rsvpData) => {
  try {
    const response = await api.post('/rsvp', rsvpData);
    return response.data;
  } catch (error) {
    console.error('RSVP submission failed:', error);
    throw error;
  }
};

export const getGuestByName = async (name) => {
  try {
    const response = await api.get(`/admin/guests?name=${name}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch guest:', error);
    throw error;
  }
};

export const getGuestList = async () => {
  try {
    const response = await api.get('/admin/rsvps');
    return response.data;
  } catch (error) {
    console.error('Failed to fetch guest list:', error);
    throw error;
  }
};
