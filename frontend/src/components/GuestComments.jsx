import { useState } from 'react';
import { Box, Typography, TextField, Button, List, ListItem, ListItemText } from '@mui/material';

export default function GuestComments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      setComments([...comments, {
        id: Date.now(),
        text: newComment,
        author: 'Guest',
        timestamp: new Date().toLocaleString()
      }]);
      setNewComment('');
    }
  };

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
              primary={comment.text}
              secondary={`${comment.author} - ${comment.timestamp}`}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
}