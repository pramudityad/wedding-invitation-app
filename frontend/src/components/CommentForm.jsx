import { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';

const styles = {
  textField: {
    mb: 1,
    '& .MuiOutlinedInput-root': {
      borderRadius: '8px',
      backgroundColor: 'white',
      '& fieldset': { borderColor: '#e0e0e0' },
      '&:hover fieldset': { borderColor: '#b0b0b0' },
      '&.Mui-focused fieldset': { borderColor: '#999' },
    }
  },
  button: {
    px: 4,
    py: 1,
    fontSize: '1rem',
    borderRadius: '8px',
    display: 'block',
    mx: 'auto',
    minWidth: '180px',
  }
};

export default function CommentForm({ onSubmit, submitting, error }) {
  const [content, setContent] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await onSubmit(content);
    if (success) setContent('');
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      <TextField
        fullWidth
        variant="outlined"
        label="Leave a comment or well wish..."
        placeholder="Share your thoughts..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        disabled={submitting}
        multiline
        rows={3}
        sx={styles.textField}
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
        sx={styles.button}
        startIcon={submitting ? null : <SendOutlinedIcon />}
      >
        {submitting ? <CircularProgress size={24} color="inherit" /> : 'Post Comment'}
      </Button>
    </Box>
  );
}