import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { getAllComments, submitComment } from '../api/comments';

export default function GuestComments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getAllComments();
        setComments(response.comments);
        setError(null);
      } catch (error) {
        console.error('Error fetching comments:', error);
        setError('Failed to load comments');
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    
    try {
      const response = await submitComment(newComment);
      setComments([response, ...comments]);
      setNewComment('');
      setError(null);
    } catch (error) {
      if (error.response?.data?.error?.includes('Maximum of 2 comments')) {
        setError('You can only post 2 comments maximum');
      } else {
        setError('Failed to post comment. Please try again.');
      }
      console.error('Failed to post comment:', error);
    }
  };

  if (loading) {
    return <Typography>Loading comments...</Typography>;
  }

  if (error) {
    return (
      <Typography color="error" sx={{ textAlign: 'center', mt: 4 }}>
        {error}
      </Typography>
    );
  }

  return (
    <Box sx={{
      p: 4,
      backgroundColor: '#f9f9f7',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      maxWidth: '800px',
      mx: 'auto'
    }}>
      <Typography
        variant="h5"
        sx={{
          mb: 4,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 300,
          color: '#333'
        }}
      >
        <IconButton 
          onClick={() => navigate('/')}
          sx={{
            position: 'absolute',
            top: 16,
            right: 16,
            color: 'inherit'
          }}
        >
          <ArrowBackIcon />
        </IconButton>
        Guest Comments
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="Leave a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{
            mb: 3,
            '& .MuiOutlinedInput-root': {
              borderRadius: '6px',
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: '#999',
              },
            }
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          sx={{
            px: 4,
            py: 1.5,
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
          Post Comment
        </Button>
      </form>
      <List sx={{ mt: 4 }}>
        {comments.map(comment => (
          <ListItem
            key={comment.ID}
            sx={{
              p: 3,
              mb: 2,
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <ListItemText
              primary={comment.Content}
              primaryTypographyProps={{
                fontStyle: 'italic',
                color: '#333',
                mb: 1
              }}
              secondary={`${comment.GuestName || 'Guest'} - ${new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              }).format(new Date(comment.CreatedAt))}`}
              secondaryTypographyProps={{
                color: '#666',
                fontSize: '0.85rem'
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}
