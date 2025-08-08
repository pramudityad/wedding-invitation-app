import React, { forwardRef } from 'react';
import { Box, Typography } from '@mui/material';

const CommentItem = forwardRef(({ comment, isLast }, ref) => {
  return (
    <Box
      ref={isLast ? ref : null}
      component="li"
      sx={{
        p: 3,
        mb: 3,
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 1极 3px rgba(0,0,0,0.08)',
        border: '1px solid #eee',
        '&:last-child': { mb: 0 }
      }}
    >
      <Typography sx={{ 
        fontStyle: 'italic', 
        color: '#333', 
        mb: 1, 
        lineHeight: 1.5 
      }}>
        {comment.Content}
      </Typography>
      
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography sx={{ color: '#666', fontSize: '0.85rem' }}>
          {comment.GuestName || 'Anonymous'}
        </Typography>
        <Typography sx={{ color: '#999', fontSize: '0.75rem', ml: 1 }}>
          — {new Intl.DateTimeFormat('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }).format(new Date(comment.CreatedAt))}
        </Typography>
      </Box>
    </Box>
  );
});

export default CommentItem;