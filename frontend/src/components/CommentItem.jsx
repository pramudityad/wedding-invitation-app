import { forwardRef, memo } from 'react';
import { Box, Typography } from '@mui/material';

const styles = {
  container: {
    p: 3,
    mb: 3,
    backgroundColor: 'white',
    borderRadius: '8px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    border: '1px solid #eee',
    '&:last-child': { mb: 0 }
  },
  content: { 
    fontStyle: 'italic', 
    color: '#333', 
    mb: 1, 
    lineHeight: 1.5 
  },
  guestName: { 
    color: '#666', 
    fontSize: '0.85rem' 
  },
  timestamp: { 
    color: '#999', 
    fontSize: '0.75rem', 
    ml: 1 
  }
};

const formatDate = (dateString) => {
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString));
};

const CommentItem = memo(forwardRef(({ comment, isLast }, ref) => (
  <Box
    ref={isLast ? ref : null}
    component="li"
    sx={styles.container}
  >
    <Typography sx={styles.content}>
      {comment.Content}
    </Typography>
    
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <Typography sx={styles.guestName}>
        {comment.GuestName || 'Anonymous'}
      </Typography>
      <Typography sx={styles.timestamp}>
        — {formatDate(comment.CreatedAt)}
      </Typography>
    </Box>
  </Box>
)));

CommentItem.displayName = 'CommentItem';

export default CommentItem;