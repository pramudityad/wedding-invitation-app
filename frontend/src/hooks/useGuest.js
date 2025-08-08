import { useState } from 'react';
import { submitRSVP, getGuestList } from '../api/guest';

export const useGuest = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [guestList, setGuestList] = useState([]);

  const handleRSVP = async (rsvpData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await submitRSVP(rsvpData);
      return response;
    } catch (err) {
      setError(err.message || 'RSVP submission failed');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const fetchGuestList = async () => {
    setLoading(true);
    setError(null);
    try {
      const guests = await getGuestList();
      setGuestList(guests);
      return guests;
    } catch (err) {
      setError(err.message || 'Failed to fetch guest list');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    guestList,
    submitRSVP: handleRSVP,
    fetchGuestList
  };
};