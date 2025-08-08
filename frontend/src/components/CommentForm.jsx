import { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { submitComment } from '../api/comments';

export default function CommentForm({ onSubmit }) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const trimmedComment = newComment.trim();
    if (!trimmedComment) {
      setError('Comment cannot be empty.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitComment(trimmedComment);
      onSubmit(response);
      setNewComment('');
    } catch (err) {
      console.error('Failed to post comment:', err);
      if (err.response?.data?.error?.includes('Maximum of 2 comments')) {
        setError('You have reached the maximum limit of 2 comments.');
      } else {
        setError('Failed to post comment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        variant="outlined"
        label="Leave a comment or well wish..."
        placeholder="Share your thoughts..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        disabled={submitting}
        multil极
        rows={3}
        sx={{
          mb: error ? 1 : 3,
          '& .MuiOutlinedInput-root': {
            borderRadius: '8px',
            backgroundColor: 'white',
            '& fieldset': { borderColor: '#e0e0e0' },
            '&:hover fieldset': { borderColor: '#b0b0b0' },
            '&.Mui-focused fieldset': { borderColor: '#999' },
          }
        }}
      />
      
      {error && (
        <Typography color="error" variant="body2" sx={{ mb: 2, textAlign: 'center' }}>
          {error}
        </Typography>
      )}
      
      <Button
        type="submit"
        variant="contained"
        color="primary"
        disabled={submitting}
        sx={{
          px: 4,
          py: 1,
          fontSize: '1rem',
          borderRadius: '8px',
          display: 'block',
          mx: 'auto',
          mt: error ? 1 : 0,
          minWidth: '180px',
        }}
        startIcon={submitting ? null : <SendOutlinedIcon />}
      >
        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Post Comment'}
      </Button>
    </Box>
  );
}