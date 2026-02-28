import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { submitRSVP, getGuestByName, markInvitationOpened } from '../api/guest';
import { getAllComments } from '../api/comments';

const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch {
    return null;
  }
};

/**
 * Hook that manages guest data fetching, RSVP submission, and snackbar notifications.
 * Handles JWT parsing, redirect on missing auth, and invitation open tracking.
 *
 * @returns {{ username: string, rsvpStatus: boolean|null, featuredComments: Array,
 *   isLoading: boolean, handleRSVP: Function, snackbar: Object, handleCloseSnackbar: Function }}
 */
export default function useGuestData() {
  const navigate = useNavigate();
  const { token } = useAuthContext();
  const { t } = useTranslation();

  const [username, setUsername] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [featuredComments, setFeaturedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const hasMarkedOpenedRef = useRef(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  const jwtData = useMemo(() => parseJwt(token), [token]);
  const currentUsername = jwtData?.username;

  useEffect(() => {
    if (!token || !currentUsername) {
      navigate('/invite');
      return;
    }

    setUsername(currentUsername || '');

    const abortController = new AbortController();

    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [guestData, commentsData] = await Promise.all([
          getGuestByName(currentUsername, { signal: abortController.signal }),
          getAllComments({ limit: 3 }, { signal: abortController.signal }),
        ]);

        if (abortController.signal.aborted) return;

        if (guestData?.Attending?.Valid) {
          setRsvpStatus(guestData.Attending.Bool);
        } else {
          setRsvpStatus(null);
        }

        setFeaturedComments(commentsData?.comments || []);

        if (guestData && !guestData.FirstOpenedAt?.Valid && !hasMarkedOpenedRef.current) {
          hasMarkedOpenedRef.current = true;
          markInvitationOpened().catch((err) => {
            console.error('Failed to mark invitation as opened:', err);
            hasMarkedOpenedRef.current = false;
          });
        }
      } catch (error) {
        if (abortController.signal.aborted) return;
        console.error('Failed to fetch data:', error);
        setSnackbar({
          open: true,
          message: t('invitation.loadError'),
          severity: 'error',
        });
      } finally {
        if (abortController.signal.aborted) return;
        setIsLoading(false);
      }
    };

    fetchData();

    return () => {
      abortController.abort();
    };
  }, [token, currentUsername, navigate, t]);

  const handleRSVP = useCallback(
    async (attending) => {
      if (!username || rsvpStatus !== null || isLoading) return;

      setIsLoading(true);
      try {
        await submitRSVP({ attending, name: username });
        setRsvpStatus(attending);
        setSnackbar({
          open: true,
          message: attending ? t('invitation.rsvpYesSuccess') : t('invitation.rsvpNoSuccess'),
          severity: 'success',
        });
      } catch (error) {
        console.error('Failed to submit RSVP:', error);
        setSnackbar({
          open: true,
          message: t('invitation.rsvpError'),
          severity: 'error',
        });
      } finally {
        setIsLoading(false);
      }
    },
    [username, rsvpStatus, isLoading, t]
  );

  const handleCloseSnackbar = useCallback((event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  return {
    username,
    rsvpStatus,
    featuredComments,
    isLoading,
    handleRSVP,
    snackbar,
    handleCloseSnackbar,
  };
}
