import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const StyledCommentsSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(5),
  marginBottom: theme.spacing(4),
  textAlign: 'left',
}));

const StyledCommentBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2.5),
  padding: theme.spacing(2.5),
  backgroundColor: 'rgba(255, 254, 245, 0.6)',
  borderRadius: '8px',
  border: '1px solid rgba(107, 93, 84, 0.15)',
  wordBreak: 'break-word',
}));

export default function GuestCommentsSection({ comments, navigate }) {
  const { t } = useTranslation();
  
  if (!comments || comments.length === 0) return null;

  return (
    <StyledCommentsSection>
      <Typography variant="h6" sx={{
        mb: 3,
        fontFamily: "'Cormorant Garamond', serif",
        fontWeight: 500,
        color: '#6B5D54',
        textAlign: 'center',
        fontSize: '1.25rem',
      }}>
        {t('guestCommentsSection.title')}
      </Typography>
      
      {comments.map((comment) => (
        <StyledCommentBox key={comment.ID}>
          <Typography variant="body1" sx={{ fontStyle: 'italic', color: '#6B5D54', mb: 1, lineHeight: 1.6, fontSize: '1rem' }}>
            "{comment.Content}"
          </Typography>
          <Typography variant="body2" sx={{ display: 'block', color: '#8B7355', fontSize: '0.875rem' }}>
            — {comment.GuestName || t('guestCommentsSection.guestLabel')}
            <Typography
              component="span"
              variant="body2"
              sx={{ color: '#C9A961', fontSize: '0.7rem', ml: 1 }}
            >
              {t('guestCommentsSection.datePrefix')} {new Intl.DateTimeFormat('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
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
            color: '#C9A961', 
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: '1rem',
            '&:hover': { 
              textDecoration: 'underline', 
              backgroundColor: 'transparent',
              color: '#b89850',
            } 
          }}
        >
          {t('guestCommentsSection.readAllButton')}
        </Button>
      </Box>
    </StyledCommentsSection>
  );
}
