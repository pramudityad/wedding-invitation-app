import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, CircularProgress, Alert } from '@mui/material'; // Added CircularProgress, Alert
import SendOutlinedIcon from '@mui/icons-material/SendOutlined'; // Added icon for the button
import { getAllComments, submitComment } from '../api/comments'; // Assuming these are correctly imported
import BackButton from './BackButton';


export default function GuestComments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [nextCursor, setNextCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const lastCommentRef = useRef(null);

  // Removed: const navigate = useNavigate(); // No back button here

  useEffect(() => {
    const fetchFirstPage = async () => {
      setInitialLoading(true);
      setError(null);
      try {
        const response = await getAllComments({ limit: 10 }); // Get first page
        const commentsArray = response.comments || [];
        setComments(commentsArray);
        setNextCursor(response.next_cursor || null);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments. Please try refreshing.');
      } finally {
        setInitialLoading(false);
      }
    };
    
    fetchFirstPage();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const trimmedComment = newComment.trim();
    if (!trimmedComment) {
      setSubmitError('Comment cannot be empty.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitComment(trimmedComment);
      // Prepend new comment to existing comments
      setComments([response, ...comments]);
      setNewComment('');
      setSubmitError(null);
    } catch (error) {
      console.error('Failed to post comment:', error);
      if (error.response?.data?.error?.includes('Maximum of 2 comments')) {
        setSubmitError('You have reached the maximum limit of 2 comments.');
      } else if (error.response?.data?.error) {
        setSubmitError(`Error: ${error.response.data.details}`);
      } else if (error.response?.status) {
        setSubmitError(`Failed to post comment (HTTP ${error.response.status}): ${error.message || 'Unknown error'}`);
      } else if (error.message) {
        setSubmitError(`Failed to post comment: ${error.message}`);
      } else {
        setSubmitError('Failed to post comment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Function to load more comments when scrolling
  const loadMoreComments = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    
    setLoadingMore(true);
    setError(null);
    
    try {
      const response = await getAllComments({ limit: 10, cursor: nextCursor });
      const newComments = response.comments || [];
      setComments(prev => [...prev, ...newComments]);
      setNextCursor(response.next_cursor || null);
    } catch (error) {
      console.error('Error loading more comments:', error);
      setError('Failed to load more comments. Please try again.');
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore]);

  useEffect(() => {
    // Setup IntersectionObserver to detect when last comment is visible
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
        }
      },
      { threshold: 0.1 }
    );

    if (lastCommentRef.current) {
      observer.observe(lastCommentRef.current);
    }

    return () => {
      if (lastCommentRef.current) {
        observer.unobserve(lastCommentRef.current);
      }
    };
  }, [loadMoreComments]);

  // Display loading or initial fetch error state prominently
  if (initialLoading) {
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
      <BackButton />
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
            comments.map((comment, index) => (
              <ListItem
                ref={index === comments.length - 1 ? lastCommentRef : null}
                key={comment.ID}
                disableGutters
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
      {loadingMore && (
        <Box sx={{ textAlign: 'center', p: 4 }}>
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2, color: '#666' }}>Loading more comments...</Typography>
        </Box>
      )}
    </Box>
  );
}