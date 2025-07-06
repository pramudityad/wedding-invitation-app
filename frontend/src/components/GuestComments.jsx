import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material'; // Added CircularProgress, Alert
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'; // Added icon for the button
import { getAllComments, submitComment } from '../api/comments'; // Assuming these are correctly imported


export default function GuestComments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false); // New state for submit button loading
  const [error, setError] = useState(null);
  const [submitError, setSubmitError] = useState(null); // New state for submit-specific errors

  // Removed: const navigate = useNavigate(); // No back button here

  useEffect(() => {
    const fetchComments = async () => {
      setLoading(true);
      setError(null); // Clear previous errors
      try {
        // Assuming getAllComments is imported correctly
        const response = await getAllComments();
        // Sort comments by creation date, newest first (assuming response items have a CreatedAt or similar field)
        // If your API returns them in a specific order, you might not need this sort.
        const sortedComments = response.comments.sort((a, b) => new Date(b.CreatedAt) - new Date(a.CreatedAt));
        setComments(sortedComments);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments. Please try refreshing.');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null); // Clear previous submit errors

    const trimmedComment = newComment.trim();
    if (!trimmedComment) {
      setSubmitError('Comment cannot be empty.');
      return;
    }

    setSubmitting(true); // Disable button and show loading
    try {
      // Assuming submitComment is imported correctly
      const response = await submitComment(trimmedComment);
      // Add the new comment to the top of the list
      setComments([response, ...comments]);
      setNewComment(''); // Clear the input field
      setSubmitError(null); // Ensure submit error is cleared on success
    } catch (error) {
      console.error('Failed to post comment:', error);
      if (error.response?.data?.error?.includes('Maximum of 2 comments')) {
        setSubmitError('You have reached the maximum limit of 2 comments.');
      } else {
        setSubmitError('Failed to post comment. Please try again.');
      }
    } finally {
      setSubmitting(false); // Re-enable button
    }
  };

  // Display loading or initial fetch error state prominently
  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2, color: '#666' }}>Loading comments...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ mx: 'auto', maxWidth: '800px', mt: 4 }}>
        {error}
      </Alert>
    );
  }

  // Main content after loading
  return (
    <Box sx={{
      p: { xs: 2, md: 4 }, // Responsive padding
      backgroundColor: '#f9f9f7',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      maxWidth: '800px', // Max width for better look on large screens
      mx: 'auto', // Center the box horizontally
      mt: 4, // Margin top for spacing if not used at top of page
      mb: 4, // Margin bottom
    }}>
      {/* Title: Centered, refined font */}
      <Typography
        variant="h5"
        sx={{
          mb: 4, // Increased margin below title
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400, // Slightly bolder
          color: '#333',
          textAlign: 'center', // Center the text
        }}
      >
        Guest Comments
      </Typography>

      {/* Comment Submission Form */}
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined" // Outlined look is clean
          label="Leave a comment or well wish..." // More inviting label
          placeholder="Share your thoughts..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          disabled={submitting} // Disable input while submitting
          multiline // Allow multiple lines
          rows={3} // Start with 3 rows
          sx={{
            mb: submitError ? 1 : 3, // Adjust margin based on error message
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px', // Slightly more rounded corners
              backgroundColor: 'white', // White background for the input
              '& fieldset': {
                borderColor: '#e0e0e0', // Light border
              },
              '&:hover fieldset': {
                borderColor: '#b0b0b0', // Slightly darker on hover
              },
              '&.Mui-focused fieldset': {
                 borderColor: '#999', // Keep it subtle on focus
              },
            }
          }}
        />
        {/* Submission specific error message */}
        {submitError && (
          <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
            {submitError}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained" // Contained button stands out for action
          color="primary" // Use theme primary color
          disabled={submitting} // Disable while submitting
          sx={{
            px: 4,
            py: 1, // Slightly less padding
            fontSize: '1rem',
            // color: '#333', // Removed for contained variant
            // borderColor: '#333', // Removed for contained variant
            borderRadius: '8px', // Match textfield border radius
            display: 'block', // Make block to use mx: auto
            mx: 'auto', // Center the button
            mt: submitError ? 1 : 0, // Add margin top if no submit error above it
            minWidth: '180px', // Give it a minimum width
          }}
          startIcon={submitting ? null : <SendOutlinedIcon />} // Add Send icon when not submitting
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Post Comment'}
        </Button>
      </form>

      {/* Comments List */}
      <List sx={{ mt: 4, p: 0 }}> {/* Remove padding on list itself */}
        {comments.length === 0 ? (
            <Typography sx={{ textAlign: 'center', color: '#666', fontStyle: 'italic' }}>
                No comments yet. Be the first to leave a message!
            </Typography>
        ) : (
            comments.map(comment => (
              <ListItem
                key={comment.ID} // Use unique ID from comment object
                disableGutters // Remove default list item padding
                sx={{
                  p: 3, // Padding inside the comment box
                  mb: 3, // More space between comments
                  backgroundColor: 'white',
                  borderRadius: '8px', // Consistent border radius
                  boxShadow: '0 1px 3px rgba(0,0,0,0.08)', // Subtle shadow
                  border: '1px solid #eee', // Very light border
                  '&:last-child': {
                      mb: 0, // No bottom margin on the last item
                  }
                }}
              >
                <ListItemText
                  primary={comment.Content}
                  primaryTypographyProps={{
                    fontStyle: 'italic',
                    color: '#333',
                    mb: 1, // Space below comment text
                    lineHeight: 1.5, // Better readability for comment text
                  }}
                  // Display Guest Name (if available) and Date
                  secondary={
                    <>
                      <Typography
                        component="span" // Use span to keep it inline
                        variant="body2"
                        sx={{ color: '#666', fontSize: '0.85rem' }}
                      >
                        {comment.GuestName || 'Anonymous'} {/* Default to Anonymous */}
                      </Typography>
                      <Typography
                         component="span" // Use span
                         variant="body2"
                         sx={{ color: '#999', fontSize: '0.75rem', ml: 1 }} // Smaller, lighter, margin left
                      >
                         — {new Intl.DateTimeFormat('en-US', {
                           year: 'numeric',
                           month: 'short',
                           day: 'numeric',
                           hour: '2-digit',
                           minute: '2-digit'
                         }).format(new Date(comment.CreatedAt))}
                      </Typography>
                    </>
                  }
                  secondaryTypographyProps={{
                    component: 'div', // Wrap secondary parts in a div
                    sx: { mt: 1 } // Margin top for spacing from primary text
                  }}
                />
              </ListItem>
            ))
        )}
      </List>
    </Box>
  );
}
