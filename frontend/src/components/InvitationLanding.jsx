import { Box, Typography, Button, Snackbar, Alert } from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
import { submitRSVP, getGuestByName } from '../api/guest';
import { getAllComments } from '../api/comments';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function InvitationLanding() {
  const navigate = useNavigate();
  const { token } = useAuthContext();

  const [username, setUsername] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState(null);
  const [featuredComments, setFeaturedComments] = useState([]);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success',
  });

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch {
        return null;
      }
    };

    const jwtData = parseJwt(token);
    const username = jwtData?.username;
    setUsername(username || '');

    const fetchData = async () => {
      try {
        const [guestData, commentsData] = await Promise.all([
          username ? getGuestByName(username) : Promise.resolve(null),
          getAllComments(),
        ]);

        if (guestData) {
          setRsvpStatus(guestData.Attending);
        }

        setRsvpCount(guests.length);

        if (commentsData && commentsData.comments) {
          setFeaturedComments(commentsData.comments.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [token, navigate]);

  const handleRSVP = async (attending) => {
    try {
      await submitRSVP({ attending, name: username });
      setRsvpStatus(attending);
      setSnackbar({
        open: true,
        message: `Thank you for your RSVP! We've noted you'll ${attending ? '' : 'not '}be attending.`,
        severity: 'success',
      });

    } catch {
      setSnackbar({
        open: true,
        message: 'Failed to submit RSVP. Please try again.',
        severity: 'error',
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f7',
        p: 6,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          maxWidth: 800,
          p: 8,
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
          backgroundColor: 'white',
        }}
      >
        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 300,
            color: '#333',
            mb: 4,
            fontSize: { xs: '2.5rem', sm: '3rem' },
          }}
        >
          Wedding Invitation
        </Typography>

        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            color: '#555',
            mb: 5,
            fontSize: '1.25rem',
          }}
        >
          Join us as we celebrate our love and begin our new journey together
          <br />
          {username ? `Welcome, ${username}!` : 'Loading welcome message...'}
        </Typography>

        {featuredComments.length > 0 && (
          <Box sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h6" sx={{ mb: 3 }}>
              Recent Guest Comments:
            </Typography>
            {featuredComments.map((comment, index) => (
              <Box
                key={comment.ID || index}
                sx={{
                  textAlign: 'left',
                  mb: 2,
                  p: 3,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: '6px',
                  borderLeft: '3px solid #e0e0e0',
                }}
              >
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "{comment.Content}"
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ display: 'block', mt: 1, color: '#666' }}
                >
                  — {comment.GuestName}, {new Date(comment.CreatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}

        <Box sx={{ mt: 6, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            {rsvpStatus === null
              ? 'Will you be attending?'
              : rsvpStatus
              ? 'You are attending - Thank you!'
              : 'You are not attending - We will miss you!'}
          </Typography>

          {rsvpStatus === null && (
            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'center',
              mb: 3
            }}>
              <Button
                variant="contained"
                color="success"
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: '50px',
                  minWidth: '120px',
                  ':hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }
                }}
                onClick={() => handleRSVP(true)}
              >
                Yes
              </Button>
              <Button
                variant="contained"
                color="error"
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: '50px',
                  minWidth: '120px',
                  ':hover': {
                    transform: 'scale(1.05)',
                    transition: 'transform 0.2s'
                  }
                }}
                onClick={() => handleRSVP(false)}
              >
                No
              </Button>
            </Box>
          )}
        </Box>

        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
          <Button variant="outlined" onClick={() => navigate('/venue')}>
            Venue Map
          </Button>
          <Button variant="outlined" onClick={() => navigate('/comments')}>
            Guest Comments
          </Button>
        </Box>
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
