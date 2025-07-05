import { Box, Typography, Button } from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
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
  const { token } = useAuthContext();
  const [username, setUsername] = useState('');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }

    // Parse username from JWT
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch (e) {
        return null;
      }
    };
    
    const jwtData = parseJwt(token);
    setUsername(jwtData?.username || '');

    const fetchData = async () => {
      try {
        const [guests, comments] = await Promise.all([
          getGuestList(),
          getAllComments()
        ]);
        setRsvpCount(guests.length);
        setFeaturedComments(comments.comments.slice(0, 3));
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    fetchData();
  }, [token, navigate]);
  
  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: '#f9f9f7',
      p: 6,
      textAlign: 'center'
    }}>
      <Box sx={{
        maxWidth: 800,
        p: 8,
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        backgroundColor: 'white'
      }}>
        <Typography
          variant="h1"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 300,
            color: '#333',
            mb: 4,
            letterSpacing: '0.5px',
            fontSize: { xs: '2.5rem', sm: '3rem' }
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
            lineHeight: 1.6,
            fontSize: '1.25rem'
          }}
        >
          Join us as we celebrate our love and begin our new journey together
          <br />
          {username ? `Welcome, ${username}!` : 'Loading welcome message...'}
          <br />
          {rsvpCount > 0 && `${rsvpCount} guests have RSVP'd so far!`}
        </Typography>
        
        {featuredComments.length > 0 && (
          <Box sx={{ mt: 5, mb: 5 }}>
            <Typography variant="h6" sx={{
              mb: 3,
              fontFamily: "'Montserrat', sans-serif",
              fontWeight: 400,
              color: '#444'
            }}>
              Recent Guest Comments:
            </Typography>
            {featuredComments.map((comment, index) => (
              <Box
                key={index}
                sx={{
                  textAlign: 'left',
                  mb: 2,
                  p: 3,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: '6px',
                  borderLeft: '3px solid #e0e0e0'
                }}
              >
                <Typography variant="body1" sx={{ fontStyle: 'italic' }}>
                  "{comment.Content}"
                </Typography>
                <Typography variant="caption" sx={{ display: 'block', mt: 1, color: '#666' }}>
                  — {comment.GuestName}, {new Date(comment.CreatedAt).toLocaleDateString()}
                </Typography>
              </Box>
            ))}
          </Box>
        )}
        
        <Box sx={{
          display: 'flex',
          flexDirection: { xs: 'column', sm: 'row' },
          gap: 3,
          justifyContent: 'center',
          mt: 5
        }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/rsvp')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1rem',
              color: '#333',
              borderColor: '#333',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                borderColor: '#222'
              }
            }}
          >
            RSVP Now
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => navigate('/venue')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1rem',
              color: '#333',
              borderColor: '#333',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                borderColor: '#222'
              }
            }}
          >
            Venue Map
          </Button>
          
          <Button
            variant="outlined"
            onClick={() => navigate('/comments')}
            sx={{
              px: 6,
              py: 2,
              fontSize: '1rem',
              color: '#333',
              borderColor: '#333',
              borderRadius: '6px',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.04)',
                borderColor: '#222'
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
