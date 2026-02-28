import { Box, Typography, Button, TextField, Snackbar, Alert } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useState } from 'react';
import { submitComment } from '../api/comments';

const SectionContainer = styled(Box)({
  padding: '60px 30px',
  textAlign: 'center',
  maxWidth: '520px',
  margin: '0 auto',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '40px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginBottom: '30px',
}));

const FormContainer = styled(Box)(({ theme }) => ({
  marginBottom: '30px',
  padding: '20px',
  background: 'rgba(255,255,255,0.6)',
  border: `1px solid ${theme.palette.wedding?.goldLight || '#E8D5A8'}`,
  borderRadius: '8px',
}));

const WishCard = styled(Box)(({ theme }) => ({
  background: 'rgba(255,255,255,0.5)',
  border: `1px solid ${theme.palette.wedding?.goldLight || '#E8D5A8'}`,
  borderRadius: '8px',
  padding: '16px',
  marginBottom: '12px',
  textAlign: 'left',
}));

const WishName = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginBottom: '4px',
}));

const WishText = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '15px',
  fontStyle: 'italic',
  color: '#5A5A5A',
  lineHeight: 1.6,
});

const ScrollContainer = styled(Box)({
  maxHeight: '300px',
  overflowY: 'auto',
  marginBottom: '20px',
  '&::-webkit-scrollbar': {
    width: '3px',
  },
  '&::-webkit-scrollbar-thumb': {
    background: '#E8D5A8',
    borderRadius: '3px',
  },
});

const ReadAllButton = styled(Button)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  padding: '10px 28px',
  border: `1.5px solid ${theme.palette.wedding?.navy || '#2C3E6B'}`,
  color: theme.palette.wedding?.navy || '#2C3E6B',
  borderRadius: 0,
  '&:hover': {
    background: theme.palette.wedding?.navy || '#2C3E6B',
    color: '#FFFFFF',
  },
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  padding: '10px 28px',
  background: theme.palette.wedding?.navy || '#2C3E6B',
  color: '#FFFFFF',
  borderRadius: 0,
  marginTop: '12px',
  '&:hover': {
    background: theme.palette.wedding?.navyLight || '#4A5E8B',
  },
  '&:disabled': {
    background: '#ccc',
    color: '#888',
  },
}));

export default function WishesPreview({ comments = [], navigate, username }) {
  const { t } = useTranslation();
  const [localComments, setLocalComments] = useState(comments);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  const handleSubmit = async () => {
    if (!message.trim()) {
      setSnackbar({ open: true, message: t('wishes.emptyError'), severity: 'warning' });
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await submitComment({ content: message.trim() });
      const newComment = {
        guest_name: username || 'Guest',
        content: message.trim(),
        created_at: new Date().toISOString(),
        ...(response?.data || {}),
      };
      setLocalComments((prev) => [newComment, ...prev]);
      setMessage('');
      setSnackbar({ open: true, message: t('wishes.submitSuccess'), severity: 'success' });
    } catch (err) {
      const errorMsg = err?.response?.status === 400
        ? t('wishes.limitReached')
        : t('wishes.submitError');
      setSnackbar({ open: true, message: errorMsg, severity: 'error' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SectionContainer>
      <SectionTitle>{t('wishes.sectionTitle')}</SectionTitle>

      <FormContainer>
        <TextField
          multiline
          rows={3}
          fullWidth
          placeholder={t('wishes.messagePlaceholder')}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 0 }}
        />
        <SubmitButton
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '...' : t('wishes.sendButton')}
        </SubmitButton>
      </FormContainer>

      <ScrollContainer>
        {localComments.map((comment, index) => (
          <WishCard key={comment.id || index}>
            <WishName>{comment.GuestName || 'Guest'}</WishName>
            <WishText>"{comment.Content}"</WishText>
          </WishCard>
        ))}
      </ScrollContainer>

      <ReadAllButton onClick={() => navigate('/comments')}>
        {t('wishes.readAllButton')}
      </ReadAllButton>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SectionContainer>
  );
}
