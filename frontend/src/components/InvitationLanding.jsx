import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { getGuestList } from '../api/guest';
import { getAllComments } from '../api/comments';
import { login } from '../api/auth';
import axios from 'axios';

export default function InvitationLanding() {
  const navigate = useNavigate();
  const [rsvpCount, setRsvpCount] = useState(0);
  const [featuredComments, setFeaturedComments] = useState([]);
  const [token, setToken] = useState(null);
  const [protectedData, setProtectedData] = useState(null);

  const fetchProtectedData = async (token) => {
    try {
      console.log('Making protected request with token:', token);
      const response = await axios.get('/protected', {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('Protected endpoint response:', response.data);
      setProtectedData({ name: response.data.message });
      return response.data;
    } catch (error) {
      console.error('Failed to fetch protected data:', error);
      throw error;
    }
  };

  useEffect(() => {
    console.log('InvitationLanding mounted');
    const token = localStorage.getItem('weddingToken');
    console.log('Token from localStorage:', token);
    if (!token) {
      console.log('No token found, redirecting to login');
      navigate('/login');
      return;
    }
    
    setToken(token);
    console.log('Attempting to fetch protected data with token:', token);
    fetchProtectedData(token)
      .then(data => console.log('Protected data response:', data))
      .catch(err => {
        console.error('Failed to fetch protected data:', err);
        localStorage.removeItem('weddingToken');
        navigate('/login');
      });

    const fetchData = async () => {
      try {
        const guests = await getGuestList();
        setRsvpCount(guests.length);
        
        const comments = await getAllComments();
        setFeaturedComments(comments.comments.slice(0, 3)); // Show top 3 comments
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };


    fetchData();
  }, [navigate]);
  
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #f8f9fa 100%)',
      p: 4,
      textAlign: 'center'
    }}>
      <Box sx={{
        maxWidth: 800,
        p: 6,
        borderRadius: 2,
        boxShadow: 3,
        background: 'rgba(255, 255, 255, 0.9)'
      }}>
        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            color: '#333',
            mb: 3,
            letterSpacing: 1
          }}
        >
          Wedding Invitation
        </Typography>
        
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            color: '#666',
            mb: 4,
            lineHeight: 1.6
          }}
        >
          Join us as we celebrate our love and begin our new journey together
          <br />
          {protectedData ? `Welcome, ${protectedData.name}!` : 'Loading welcome message...'}
          <br />
          {rsvpCount > 0 && `${rsvpCount} guests have RSVP'd so far!`}
        </Typography>
        
        {featuredComments.length > 0 && (
          <Box sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h6" sx={{ mb: 2, fontFamily: "'Montserrat', sans-serif" }}>
              Recent Guest Comments:
            </Typography>
            {featuredComments.map((comment, index) => (
              <Typography
                key={index}
                variant="body1"
                sx={{
                  fontStyle: 'italic',
                  mb: 1,
                  p: 2,
                  backgroundColor: 'rgba(0,0,0,0.05)',
                  borderRadius: 1
                }}
              >
                "{comment.content}"
              </Typography>
            ))}
          </Box>
        )}
        
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 2,
          justifyContent: 'center',
          mt: 4
        }}>
          <Button
            variant="contained"
            onClick={() => navigate('/rsvp')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)'
              }
            }}
          >
            RSVP Now
          </Button>
          
          <Button
          variant="contained"
          onClick={() => navigate('/venue')}
          sx={{
            px: 6,
            py: 2,
            fontSize: '1.1rem',
            background: 'linear-gradient(45deg, #4A6CF7 30%, #2541B2 90%)',
            '&:hover': {
              background: 'linear-gradient(45deg, #4A6CF7 40%, #2541B2 100%)'
            }
          }}
        >
          Venue Map
        </Button>
          
          <Button
            variant="contained"
            onClick={() => navigate('/comments')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1.1rem',
              background: 'linear-gradient(45deg, #6A11CB 30%, #2575FC 90%)',
              '&:hover': {
                background: 'linear-gradient(45deg, #6A11CB 40%, #2575FC 100%)'
              }
            }}
          >
            Guest Comments
          </Button>
        </Box>
      </Box>
    </Box>
  );
}