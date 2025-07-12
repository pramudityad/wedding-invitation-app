import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../contexts/AuthContext';

// Define styles as constants
const styles = {
  outerContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    p: 4,
    backgroundColor: '#f9f9f7'
  },
  innerCard: {
    maxWidth: 400,
    width: '100%',
    p: { xs: 3, md: 4 },
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    backgroundColor: '#ffffff',
    border: '1px solid #e0e0e0'
  },
  title: {
    fontFamily: "'Playfair Display', serif",
    fontWeight: 400,
    color: '#333',
    mb: 4,
    textAlign: 'center'
  },
  textField: {
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: '#fdfdfd',
      '& fieldset': {
        borderColor: '#e0e0e0'
      },
      '&:hover fieldset': {
        borderColor: '#b0b0b0'
      },
      '&.Mui-focused fieldset': {
        borderColor: '#999'
      }
    }
  },
  buttonStatic: {
    py: 1.5,
    fontSize: '1rem',
    borderRadius: '8px',
    backgroundColor: '#a7a7a3',
    color: '#ffffff',
    '&:hover': {
      backgroundColor: '#999990',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)'
    },
    '&:disabled': {
      backgroundColor: '#cccccc',
      color: '#666666'
    }
  }
};

export default function LoginPage() {
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const { login } = useAuthContext();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!name.trim()) {
      setError('Please enter your name.');
      setIsLoading(false);
      return;
    }

    try {
      await login(name);
      navigate('/', { replace: true });
    } catch (err) {
      console.error("Login failed:", err);
      setError('Could not verify your name. Please try again.');
      setIsLoading(false);
    }
  };

  return (
    <Box sx={styles.outerContainer}>
      <Box sx={styles.innerCard}>
        <Typography variant="h5" component="h1" gutterBottom sx={styles.title}>
          Welcome, Please Log In
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Your Name"
            variant="outlined"
            fullWidth
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            disabled={isLoading}
            sx={styles.textField}
          />

          {error && (
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ ...styles.buttonStatic, mt: error ? 0 : 3 }}
            disabled={isLoading || name.trim() === ''}
          >
            {isLoading ? (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> Logging in...
              </Box>
            ) : (
              'Continue'
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
}
