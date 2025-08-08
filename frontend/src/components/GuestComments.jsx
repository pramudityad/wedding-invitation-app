import { useState, useEffect, useRef, useCallback, memo } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  List, 
  ListItem, 
  ListItemText, 
  CircularProgress, 
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Chip
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getAllComments, submitComment } from '../api/comments';
import BackButton from './BackButton';


const COMMENT_MAX_LENGTH = 500;
const COMMENTS_PER_PAGE = 10;

const CommentItem = memo(({ comment, isLast, lastCommentRef }) => (
  <ListItem
    ref={isLast ? lastCommentRef : null}
    disableGutters
    sx={{
      p: 3,
      mb: 3,
      backgroundColor: 'white',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      border: '1px solid #eee',
      '&:last-child': {
        mb: 0,
      }
    }}
  >
    <ListItemText
      primary={comment.Content}
      primaryTypographyProps={{
        fontStyle: 'italic',
        color: '#333',
        mb: 1,
        lineHeight: 1.5,
      }}
      secondary={
        <>
          <Typography
            component="span"
            variant="body2"
            sx={{ color: '#666', fontSize: '0.85rem' }}
          >
            {comment.GuestName || 'Anonymous'}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{ color: '#999', fontSize: '0.75rem', ml: 1 }}
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
        component: 'div',
        sx: { mt: 1 }
      }}
    />
  </ListItem>
));

CommentItem.displayName = 'CommentItem';

export default function GuestComments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [nextCursor, setNextCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const lastCommentRef = useRef(null);
  const observerRef = useRef(null);
  const textFieldRef = useRef(null);

  const fetchComments = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setError(null);
      setComments([]);
      setNextCursor(null);
    } else {
      setInitialLoading(true);
      setError(null);
    }

    try {
      const response = await getAllComments({ limit: COMMENTS_PER_PAGE });
      const commentsArray = response.comments || [];
      setComments(commentsArray);
      setNextCursor(response.next_cursor || null);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError('Failed to load comments. Please try refreshing.');
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const trimmedComment = newComment.trim();
    if (!trimmedComment) {
      setSubmitError('Comment cannot be empty.');
      return;
    }

    if (trimmedComment.length > COMMENT_MAX_LENGTH) {
      setSubmitError(`Comment is too long. Maximum ${COMMENT_MAX_LENGTH} characters allowed.`);
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitComment(trimmedComment);
      setComments([response, ...comments]);
      setNewComment('');
      setSubmitError(null);
      setSuccessMessage('Your comment has been posted successfully!');
      setShowSnackbar(true);
      
      if (textFieldRef.current) {
        textFieldRef.current.blur();
      }
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

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !submitting) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const characterCount = newComment.length;
  const isOverLimit = characterCount > COMMENT_MAX_LENGTH;

  const loadMoreComments = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    
    setLoadingMore(true);
    setError(null);
    
    try {
      const response = await getAllComments({ limit: COMMENTS_PER_PAGE, cursor: nextCursor });
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
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (lastCommentRef.current) {
      observerRef.current.observe(lastCommentRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreComments, comments.length]);

  if (initialLoading) {
    return (
      <Box sx={{ textAlign: 'center', p: 4 }}>
        <CircularProgress size={40} />
        <Typography sx={{ mt: 2, color: '#666' }}>Loading comments...</Typography>
      </Box>
    );
  }

  if (error && comments.length === 0) {
    return (
      <Box sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: '#f9f9f7',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        maxWidth: '800px',
        mx: 'auto',
        mt: 4,
        mb: 4,
      }}>
        <BackButton />
        <Alert 
          severity="error" 
          sx={{ mx: 'auto', maxWidth: '800px', mt: 4 }}
          action={
            <Tooltip title="Refresh comments">
              <IconButton
                color="inherit"
                size="small"
                onClick={() => fetchComments(true)}
                aria-label="Refresh comments"
              >
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          }
        >
          {error}
        </Alert>
      </Box>
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
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 400,
            color: '#333',
            flex: 1,
            textAlign: 'center',
          }}
        >
          Guest Comments
        </Typography>
        <Tooltip title="Refresh comments">
          <IconButton
            onClick={() => fetchComments(true)}
            disabled={initialLoading}
            aria-label="Refresh comments"
            sx={{ ml: 2 }}
          >
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      <form onSubmit={handleSubmit}>
        <TextField
          ref={textFieldRef}
          fullWidth
          variant="outlined"
          label="Leave a comment or well wish..."
          placeholder="Share your thoughts... (Ctrl+Enter to submit)"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={submitting}
          multiline
          rows={3}
          error={isOverLimit}
          inputProps={{
            maxLength: COMMENT_MAX_LENGTH + 50,
            'aria-describedby': 'character-count-helper'
          }}
          sx={{
            mb: 1,
            '& .MuiOutlinedInput-root': {
              borderRadius: '8px',
              backgroundColor: 'white',
              '& fieldset': {
                borderColor: isOverLimit ? '#f44336' : '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: isOverLimit ? '#f44336' : '#b0b0b0',
              },
              '&.Mui-focused fieldset': {
                borderColor: isOverLimit ? '#f44336' : '#999',
              },
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography
            id="character-count-helper"
            variant="caption"
            color={isOverLimit ? 'error' : 'textSecondary'}
            aria-live="polite"
          >
            {characterCount}/{COMMENT_MAX_LENGTH} characters
          </Typography>
          {characterCount > 0 && (
            <Chip
              size="small"
              label={`${Math.max(0, COMMENT_MAX_LENGTH - characterCount)} left`}
              color={isOverLimit ? 'error' : characterCount > COMMENT_MAX_LENGTH * 0.8 ? 'warning' : 'default'}
              variant="outlined"
            />
          )}
        </Box>
        {submitError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {submitError}
          </Alert>
        )}
        <Button
          type="submit"
          variant="contained"
          color="primary"
          disabled={submitting || isOverLimit || !newComment.trim()}
          sx={{
            px: 4,
            py: 1,
            fontSize: '1rem',
            borderRadius: '8px',
            display: 'block',
            mx: 'auto',
            minWidth: '180px',
          }}
          startIcon={submitting ? null : <SendOutlinedIcon />}
        >
          {submitting ? <CircularProgress size={24} color="inherit" /> : 'Post Comment'}
        </Button>
      </form>

      <Snackbar
        open={showSnackbar}
        autoHideDuration={4000}
        onClose={() => setShowSnackbar(false)}
        message={successMessage}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />

      {error && comments.length > 0 && (
        <Alert 
          severity="warning" 
          sx={{ mt: 2, mb: 2 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => fetchComments(true)}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <List sx={{ mt: 4, p: 0 }} role="list" aria-label="Guest comments">
        {comments.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography sx={{ color: '#666', fontStyle: 'italic', fontSize: '1.1rem' }}>
              No comments yet. Be the first to leave a message!
            </Typography>
          </Box>
        ) : (
          comments.map((comment, index) => (
            <CommentItem
              key={comment.ID}
              comment={comment}
              isLast={index === comments.length - 1}
              lastCommentRef={lastCommentRef}
            />
          ))
        )}
      </List>
      {loadingMore && (
        <Box sx={{ textAlign: 'center', p: 4 }} role="status" aria-live="polite">
          <CircularProgress size={40} />
          <Typography sx={{ mt: 2, color: '#666' }}>Loading more comments...</Typography>
        </Box>
      )}
      
      {!nextCursor && comments.length > 0 && (
        <Box sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
          <Typography variant="caption" color="textSecondary">
            — End of comments —
          </Typography>
        </Box>
      )}
    </Box>
  );
}