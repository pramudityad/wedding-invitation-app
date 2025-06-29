import { useState, useEffect } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';
import { getAllComments } from '../api/comments';

export default function GuestComments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await getAllComments();
        setComments(response.comments);
      } catch (error) {
        console.error('Error fetching comments:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchComments();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      // TODO: Implement actual API call to post comment
      setComments([...comments, {
        id: Date.now(),
        content: newComment,
        guest_name: 'You',
        created_at: new Date().toISOString()
      }]);
      setNewComment('');
    }
  };

  if (loading) {
    return <Typography>Loading comments...</Typography>;
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
            key={comment.id}
            sx={{
              p: 3,
              mb: 2,
              backgroundColor: 'white',
              borderRadius: '6px',
              boxShadow: '0 1px 2px rgba(0,0,0,0.05)'
            }}
          >
            <ListItemText
              primary={comment.content}
              primaryTypographyProps={{
                fontStyle: 'italic',
                color: '#333',
                mb: 1
              }}
              secondary={`${comment.guest_name} - ${new Date(comment.created_at).toLocaleString()}`}
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