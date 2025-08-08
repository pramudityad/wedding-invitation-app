import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledCommentsSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(5),
  textAlign: 'left',
}));

const StyledCommentBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(3),
  backgroundColor: '#fefefe',
  borderRadius: '8px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
  border: '1px solid #eee',
  wordBreak: 'break-word',
}));

export default function GuestCommentsSection({ comments, navigate }) {
  if (!comments || comments.length === 0) return null;

  return (
    <StyledCommentsSection>
      <Typography variant="h6" sx={{
        mb: 3,
        fontFamily: "'Playfair Display', serif",
        fontWeight: 400,
        color: '#333',
        textAlign: 'center'
      }}>
        Messages of Love
      </Typography>
      
      {comments.map((comment) => (
        <StyledCommentBox key={comment.ID}>
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#333', mb: 1, lineHeight: 1.5 }}>
            "{comment.Content}"
          </Typography>
          <Typography variant="body2" sx={{ display: 'block', color: '#666', fontSize: '0.85rem' }}>
            — {comment.GuestName || 'Guest'}
            <Typography
              component="span"
              variant="body2"
              sx={{ color: '#999', fontSize: '0.75rem', ml: 1 }}
            >
              on {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              }).format(new Date(comment.CreatedAt))}
            </Typography>
          </Typography>
        </StyledCommentBox>
      ))}
      
      <Box sx={{ textAlign: 'center', mt: 3 }}>
        <Button 
          variant="text" 
          onClick={() => navigate('/comments')}
          sx={{ 
            color: '#666', 
            '&:hover': { 
              textDecoration: 'underline', 
              backgroundColor: 'transparent' 
            } 
          }}
        >
          Read All Messages
        </Button>
      </Box>
    </StyledCommentsSection>
  );
}