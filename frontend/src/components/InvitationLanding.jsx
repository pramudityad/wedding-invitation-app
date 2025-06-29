import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function InvitationLanding() {
  const navigate = useNavigate();
  
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
        </Typography>
        
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