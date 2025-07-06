import { Box, Typography, Button, Snackbar, Alert, CircularProgress } from '@mui/material';
import { useAuthContext } from '../contexts/AuthContext';
// Assuming these API functions are correctly imported
import { submitRSVP, getGuestByName } from '../api/guest';
import { getAllComments } from '../api/comments';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

export default function InvitationLanding() {
  // Hook for navigation
  const navigate = useNavigate();
  // Access token from authentication context
  const { token } = useAuthContext();

  // State for guest data and UI status
  const [username, setUsername] = useState('');
  const [rsvpStatus, setRsvpStatus] = useState(null); // null: hasn't responded, true: attending, false: not attending
  const [featuredComments, setFeaturedComments] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Loading state for initial data fetch
  // State for Snackbar notifications
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success', // or 'error'
  });

  // Effect to check authentication and fetch initial data
  useEffect(() => {
    // Redirect to login if no token is found
    if (!token) {
      navigate('/login');
      return;
    }

    // Helper function to parse JWT token
    const parseJwt = (token) => {
      try {
        return JSON.parse(atob(token.split('.')[1]));
      } catch {
        return null;
      }
    };

    // Get username from token
    const jwtData = parseJwt(token);
    const currentUsername = jwtData?.username; // Use a different variable name to avoid confusion with state setter
    setUsername(currentUsername || '');

    // Fetch guest data and comments
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        // Fetch guest data by username and comments concurrently
        const [guestData, commentsData] = await Promise.all([
          currentUsername ? getGuestByName(currentUsername) : Promise.resolve(null),
          getAllComments(),
        ]);

        // Update RSVP status if guest data is found
        if (guestData && guestData.Attending !== undefined) { // Check if Attending property exists
           // Convert potential string "true"/"false" from API to boolean if necessary
           setRsvpStatus(guestData.Attending === true || guestData.Attending === 'true');
        } else {
           setRsvpStatus(null); // Guest data not found or Attending status missing, assume not responded
        }


        // Update featured comments (take first 3, sort by date)
        if (commentsData?.comments) {
           // Sort comments by creation date descending (newest first)
           const sortedComments = commentsData.comments.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
           setFeaturedComments(sortedComments.slice(0, 3)); // Take top 3 after sorting
        } else {
          setFeaturedComments([]); // No comments found
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Optionally set an error state to display to the user, though Snackbar covers it
      } finally {
        setIsLoading(false); // Stop loading
      }
    };

    // Fetch data only if username is available from token
    if (currentUsername) {
       fetchData(); // Execute the fetch
    } else {
        // If username couldn't be determined from token, redirect to login
        navigate('/login');
    }


    // Dependencies: token and navigate are needed for the effect.
    // currentUsername is used inside, but won't change after mount if token is stable.
    // Adding it to dependencies might cause re-fetch if token payload changes, which is usually not desired for a stable login.
    // Keeping only token and navigate is standard for auth effects.
  }, [token, navigate]);

  // Handler for submitting RSVP
  const handleRSVP = async (attending) => {
    // Prevent submission if username is missing, already responded, or currently loading
    if (!username || rsvpStatus !== null || isLoading) return;

    setIsLoading(true); // Show loading state during RSVP submission
    try {
      // Submit the RSVP status
      await submitRSVP({ attending, name: username });
      // Update local state immediately on success
      setRsvpStatus(attending);
      setSnackbar({ // Show success message
        open: true,
        message: `Thank you for your RSVP! We've noted you'll ${attending ? '' : 'not '}be attending.`,
        severity: 'success',
      });
    } catch (error) {
      console.error('Failed to submit RSVP:', error);
      setSnackbar({ // Show error message
        open: true,
        message: 'Failed to submit RSVP. Please try again.',
        severity: 'error',
      });
       // Optionally, if submission fails, you might want to revert UI state
       // setRsvpStatus(null); // Depends on desired UX on failure
    } finally {
       setIsLoading(false); // Stop loading
    }
  };

  // Handle closing the Snackbar
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Display loading state if data is being fetched initially (before username is known or data loads)
  if (isLoading && !username) {
     // Only show full screen loader on initial load before username is known or data arrives
    return (
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#f9f9f7' }}>
        <CircularProgress size={60} />
        <Typography sx={{ mt: 2, color: '#666', fontFamily: "'Montserrat', sans-serif" }}>Loading your invitation...</Typography>
      </Box>
    );
  }


  return (
    // Outer container for centering and background
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#f9f9f7', // Soft background color
        p: { xs: 2, md: 4 }, // Responsive padding
        textAlign: 'center',
      }}
    >
      {/* Inner box for the invitation content, styled as an elegant card */}
      <Box
        sx={{
          maxWidth: 800, // Max width for the content box
          width: '100%', // Take full width on smaller screens
          p: { xs: 4, md: 6 }, // Responsive padding inside the card
          borderRadius: '12px', // Consistent rounded corners
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Softer, elegant shadow
          backgroundColor: '#ffffff', // White background
          border: '1px solid #e0e0e0', // Subtle border
        }}
      >
        {/* Wedding Title */}
        <Typography
          variant="h3" // Adjusted size for better hierarchy
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400, // Slightly bolder than 300
            color: '#333', // Dark grey text
            mb: 2, // Margin below title
            fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }, // Responsive font size
          }}
        >
          You're Invited
        </Typography>

         {/* Couple's Names Placeholder (Add your names here) */}
         <Typography
          variant="h4"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 600, // More prominent
            color: '#5a4c4d', // Example: A soft, warm color for names
            mb: 4, // Margin below names
             fontSize: { xs: '1.8rem', sm: '2rem', md: '2.5rem' },
          }}
        >
          [Couple's Names]
        </Typography>

        {/* Welcome Message and Subtitle */}
        <Typography
          variant="h6" // Adjusted size
          sx={{
            fontFamily: "'Montserrat', sans-serif",
            fontWeight: 300,
            color: '#555',
            mb: 5, // Margin below message
            fontSize: { xs: '1rem', sm: '1.1rem', md: '1.25rem' }, // Responsive font size
            lineHeight: 1.6, // Improved readability
          }}
        >
          We invite you to share in our joy as we unite in marriage.<br />
          {username ? `A special welcome to ${username}!` : 'Loading welcome message...'} {/* Show username if available */}
        </Typography>

        {/* Featured Comments Section */}
        {featuredComments.length > 0 && (
          <Box sx={{ mt: 5, mb: 5, textAlign: 'left' }}>
            {/* Comments Title */}
            <Typography variant="h6" sx={{ mb: 3, fontFamily: "'Playfair Display', serif", fontWeight: 400, color: '#333' }}>
              Messages of Love
            </Typography>
            {/* List of Featured Comments */}
            {featuredComments.map((comment) => (
              <Box
                key={comment.ID} // Use unique ID
                sx={{
                  mb: 3, // Space between comments
                  p: 3, // Padding inside comment box
                  backgroundColor: '#fefefe', // Slightly off-white background
                  borderRadius: '8px', // Consistent border radius
                  boxShadow: '0 1px 3px rgba(0,0,0,0.05)', // Subtle shadow
                  border: '1px solid #eee', // Very light border
                  wordBreak: 'break-word', // Prevent overflow on long words
                }}
              >
                {/* Comment Content */}
                <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#333', mb: 1, lineHeight: 1.5 }}>
                  "{comment.Content}"
                </Typography>
                {/* Comment Attribution (Guest Name and Date) */}
                <Typography
                  variant="body2"
                  sx={{ display: 'block', color: '#666', fontSize: '0.85rem' }}
                >
                  — {comment.GuestName || 'Guest'}
                   <Typography
                     component="span" // Use span to keep it inline
                     variant="body2"
                     sx={{ color: '#999', fontSize: '0.75rem', ml: 1 }} // Smaller, lighter, margin left
                  >
                      on {new Intl.DateTimeFormat('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      }).format(new Date(comment.CreatedAt))}
                  </Typography>
                </Typography>
              </Box>
            ))}
             {/* Link to all comments */}
             <Box sx={{ textAlign: 'center', mt: 3 }}>
                 <Button variant="text" onClick={() => navigate('/comments')}
                    sx={{ color: '#666', '&:hover': { textDecoration: 'underline', backgroundColor: 'transparent' } }}
                 >
                     Read All Messages
                 </Button>
             </Box>
          </Box>
        )}

        {/* RSVP Section */}
        <Box sx={{ mt: 6, mb: 4 }}>
          {/* RSVP Status or Question */}
          <Typography variant="h6" sx={{ mb: 3, fontFamily: "'Playfair Display', serif", fontWeight: 400, color: '#333' }}>
            {/* Show different text based on RSVP status */}
            {isLoading ? ( // Show loading indicator and text while RSVP is being submitted or initially loaded
               <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
                  <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                  {rsvpStatus === null ? 'Checking your RSVP...' : 'Updating your RSVP...'}
               </Box>
            ) : rsvpStatus === null ? ( // If not loading and status is null, ask the question
              'Will you be attending?'
            ) : rsvpStatus === true ? ( // If not loading and status is true, show attending message
              'Thank you for your RSVP! We look forward to celebrating with you.'
            ) : ( // If not loading and status is false, show not attending message
              'We\'ve received your RSVP. We understand if you cannot make it.'
            )}
          </Typography>

          {/* RSVP Buttons (only shown if status is null AND not currently loading) */}
          {!isLoading && rsvpStatus === null && (
            <Box sx={{
              display: 'flex',
              gap: 3, // Increased gap between buttons
              justifyContent: 'center',
              mb: 3,
              flexWrap: 'wrap', // Wrap buttons on small screens
            }}>
               {/* Yes Button */}
              <Button
                variant="contained"
                 // Custom elegant color for Yes (e.g., a soft green or gold)
                sx={{
                  px: 5, // Horizontal padding
                  py: 1.5, // Vertical padding
                  borderRadius: '8px', // Consistent border radius
                  minWidth: '140px', // Minimum width
                  backgroundColor: '#669966', // Example: Soft Green - REPLACE WITH YOUR COLOR
                  color: 'white',
                  '&:hover': {
                    backgroundColor: '#558855', // Darker green on hover
                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)', // Subtle shadow on hover
                  },
                  '&:disabled': {
                     backgroundColor: '#cccccc',
                     color: '#666666',
                  }
                }}
                onClick={() => handleRSVP(true)}
                disabled={isLoading} // Disable while submitting RSVP
              >
                 {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Yes, I will be there'} {/* Show loader if submitting */}
              </Button>
               {/* No Button */}
              <Button
                variant="contained"
                // Custom elegant color for No (e.g., a soft grey or taupe)
                sx={{
                  px: 5,
                  py: 1.5,
                  borderRadius: '8px', // Consistent border radius
                  minWidth: '140px',
                  backgroundColor: '#a7a7a3', // Example: Soft Taupe - REPLACE WITH YOUR COLOR
                  color: 'white', // Or '#333' if preferred for contrast
                   '&:hover': {
                    backgroundColor: '#999990', // Darker taupe on hover
                     boxShadow: '0 2px 6px rgba(0,0,0,0.1)', // Subtle shadow on hover
                  },
                   '&:disabled': {
                     backgroundColor: '#cccccc',
                     color: '#666666',
                  }
                }}
                onClick={() => handleRSVP(false)}
                disabled={isLoading} // Disable while submitting RSVP
              >
                 {isLoading ? <CircularProgress size={24} color="inherit" /> : 'No, I cannot make it'} {/* Show loader if submitting */}
              </Button>
            </Box>
          )}
           {/* Removed "Change RSVP" button */}
        </Box>

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap', mt: 4 }}>
          {/* Venue Map Button */}
          <Button
            variant="outlined"
            onClick={() => navigate('/venue')}
            sx={{
              px: 3, py: 1,
              borderRadius: '8px', // Consistent border radius
              color: '#666', // Grey text
              borderColor: '#666', // Grey border
              '&:hover': {
                borderColor: '#333',
                color: '#333',
                backgroundColor: 'rgba(0,0,0,0.04)', // Light hover effect
              },
            }}
          >
            Venue Map
          </Button>
          {/* Guest Comments Button */}
          <Button
            variant="outlined"
            onClick={() => navigate('/comments')}
             sx={{
              px: 3, py: 1,
              borderRadius: '8px', // Consistent border radius
              color: '#666', // Grey text
              borderColor: '#666', // Grey border
               '&:hover': {
                borderColor: '#333',
                color: '#333',
                backgroundColor: 'rgba(0,0,0,0.04)', // Light hover effect
              },
            }}
          >
            Guest Comments
          </Button>
          {/* Gallery Button */}
          <Button
            variant="outlined"
            onClick={() => navigate('/gallery')}
            sx={{
              px: 3, py: 1,
              borderRadius: '8px', // Consistent border radius
              color: '#666', // Grey text
              borderColor: '#666', // Grey border
              '&:hover': {
                borderColor: '#333',
                color: '#333',
                backgroundColor: 'rgba(0,0,0,0.04)', // Light hover effect
              },
            }}
          >
            Photo Gallery
          </Button>
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
