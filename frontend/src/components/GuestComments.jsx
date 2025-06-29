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
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Guest Comments
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          variant="outlined"
          label="Leave a comment"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button type="submit" variant="contained">
          Post Comment
        </Button>
      </form>
      <List sx={{ mt: 3 }}>
        {comments.map(comment => (
          <ListItem key={comment.id}>
            <ListItemText
              primary={comment.content}
              secondary={`${comment.guest_name} - ${new Date(comment.created_at).toLocaleString()}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}