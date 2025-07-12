import { Box, TextField, Button, Typography, CircularProgress, Alert } from '@mui/material'; // Added CircularProgress, Alert
import { useState } from 'react'; // Keep useState
import { useNavigate } from 'react-router-dom'; // Keep useNavigate
import { useAuthContext } from '../contexts/AuthContext'; // Keep useAuthContext

export default function LoginPage() {
  // State for the input field, error message, and loading indicator
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Hook for navigation and context
  const navigate = useNavigate();
  const { login } = useAuthContext(); // Assuming useAuthContext provides a login function

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form refresh
    setIsLoading(true); // Start loading
    setError(''); // Clear previous errors

    // Basic validation
    if (!name.trim()) {
      setError('Please enter your name.');
      setIsLoading(false);
      return;
    }

    try {
      // Call the login function from context
      await login(name);
      // Navigate to the home page on success, replace history entry
      navigate('/', { replace: true });
    } catch (err) {
      // Handle login errors
      console.error("Login failed:", err); // Log error for debugging
      setError('Could not verify your name. Please try again.'); // User-friendly error message
      setIsLoading(false); // Stop loading
    }
  };

  return (
    // Outer container for centering and background
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh', // Full viewport height
        p: 4, // Padding
        backgroundColor: '#f9f9f7', // Soft background color consistent with other components
        // Optionally add a subtle pattern or texture if desired
        // background: 'url(/path/to/subtle-pattern.png)',
        // backgroundRepeat: 'repeat',
      }}
    >
      {/* Inner box for the login form, styled as an elegant card */}
      <Box
        sx={{
          maxWidth: 400, // Max width for the form box
          width: '100%', // Take full width on smaller screens
          p: { xs: 3, md: 4 }, // Responsive padding
          borderRadius: '12px', // Rounded corners
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Softer, more prominent shadow
          backgroundColor: '#ffffff', // White background
          border: '1px solid #e0e0e0', // Subtle border
        }}
      >
        {/* Title */}
        <Typography
          variant="h5" // Slightly smaller than h4, feels less imposing
          component="h1" // Still semantically h1
          gutterBottom // Add bottom margin
          align="center" // Center text
          sx={{
            fontFamily: "'Playfair Display', serif", // Elegant font
            fontWeight: 400, // Standard or slightly bolder for headers
            color: '#333', // Dark grey text
            mb: 4, // Increased margin below title
          }}
        >
          Welcome, Please Log In
        </Typography>

        {/* Login Form */}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Your Name" // Descriptive label
            variant="outlined" // Outlined style is clean
            fullWidth // Takes full width
            margin="normal" // Standard margin spacing
            value={name} // Controlled component value
            onChange={(e) => setName(e.target.value)} // Update state on change
            required // HTML required attribute
            disabled={isLoading} // Disable input while loading
            sx={{
              // Custom styling for the TextField appearance
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px', // Match box border radius
                backgroundColor: '#fdfdfd', // Very slight off-white background
                '& fieldset': {
                  borderColor: '#e0e0e0', // Light border
                },
                '&:hover fieldset': {
                  borderColor: '#b0b0b0', // Slightly darker on hover
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#999', // Subtle focus color
                },
              },
            }}
          />

          {/* Error Message */}
          {error && (
             // Use Alert for better styling of error messages
            <Alert severity="error" sx={{ mt: 2, mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Submit Button */}
          <Button
            type="submit" // Submit the form
            variant="contained" // Contained variant stands out as primary action
            fullWidth // Takes full width
            sx={{
              mt: error ? 0 : 3, // Adjust margin top based on whether an error is shown above
              py: 1.5, // Vertical padding for button size
              fontSize: '1rem', // Font size
              borderRadius: '8px', // Match surrounding elements
              // Custom elegant button colors (adjust these to fit your wedding theme)
              backgroundColor: '#a7a7a3', // Example: A subtle taupe/grey
              color: '#ffffff', // White text for contrast
              '&:hover': {
                backgroundColor: '#999990', // Slightly darker on hover
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)', // Subtle hover shadow
              },
              '&:disabled': {
                 // Style for disabled state
                 backgroundColor: '#cccccc', // Lighter background
                 color: '#666666', // Darker text
              }
            }}
            disabled={isLoading || name.trim() === ''} // Disable when loading or input is empty
          >
            {isLoading ? (
              // Show spinner and text when loading
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} /> Logging in...
              </Box>
            ) : (
              // Show regular text when not loading
              'Continue' // More welcoming button text
            )}
          </Button>
        </form>
      </Box>
    </Box>
  );
}