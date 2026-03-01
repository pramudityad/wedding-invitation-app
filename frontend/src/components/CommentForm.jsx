import { useState, useRef } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Alert,
  Snackbar,
  Chip,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import { useTranslation } from 'react-i18next';
import { submitComment } from '../api/comments';

const COMMENT_MAX_LENGTH = 500;

const StyledTextField = styled(TextField, {
  shouldForwardProp: (prop) => prop !== 'isOverLimit',
})(({ isOverLimit, theme }) => ({
  marginBottom: '8px',
  '& .MuiOutlinedInput-root': {
    borderRadius: '8px',
    backgroundColor: 'rgba(255,255,255,0.6)',
    fontFamily: "'Poppins', sans-serif",
    fontSize: '13px',
    '& fieldset': {
      borderColor: isOverLimit ? theme.palette.error.main : (theme.palette.wedding?.goldLight || '#E8D5A8'),
    },
    '&:hover fieldset': {
      borderColor: isOverLimit ? theme.palette.error.main : (theme.palette.wedding?.gold || '#C9A96E'),
    },
    '&.Mui-focused fieldset': {
      borderColor: isOverLimit ? theme.palette.error.main : (theme.palette.wedding?.navy || '#2C3E6B'),
    },
  },
}));

const CounterContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

const CharacterCountText = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
});

const StyledErrorAlert = styled(Alert)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SubmitButton = styled(Button)(({ theme }) => ({
  paddingLeft: '32px',
  paddingRight: '32px',
  paddingTop: '8px',
  paddingBottom: '8px',
  fontSize: '11px',
  fontFamily: "'Poppins', sans-serif",
  letterSpacing: '2px',
  textTransform: 'uppercase',
  borderRadius: 0,
  display: 'block',
  margin: '0 auto',
  minWidth: '180px',
  background: theme.palette.wedding?.navy || '#2C3E6B',
  color: theme.palette.common.white || '#FFFFFF',
  '&:hover': {
    background: theme.palette.wedding?.navyLight || '#4A5E8B',
  },
  '&:disabled': {
    background: theme.palette.grey[400] || '#ccc',
  },
}));

export default function CommentForm({ onCommentSubmitted }) {
  const [newComment, setNewComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { t } = useTranslation();
  const textareaRef = useRef(null);

  const charCount = newComment.length;
  const isOverLimit = charCount > COMMENT_MAX_LENGTH;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newComment.trim() || isOverLimit) return;

    setSubmitting(true);
    setError(null);

    try {
      const comment = await submitComment(newComment.trim());
      setNewComment('');
      setShowSuccess(true);
      if (onCommentSubmitted) {
        onCommentSubmitted(comment);
      }
    } catch (err) {
      const apiError = err.response?.data?.details || err.response?.data?.error || err.message || t('comments.submitError');
      setError(apiError);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCloseSuccess = () => {
    setShowSuccess(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit}>
      {error && (
        <StyledErrorAlert severity="error" onClose={() => setError(null)}>
          {error}
        </StyledErrorAlert>
      )}

      <StyledTextField
        fullWidth
        multiline
        rows={4}
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder={t('comments.placeholder')}
        disabled={submitting}
        isOverLimit={isOverLimit}
        inputRef={textareaRef}
      />

      <CounterContainer>
        <CharacterCountText variant="caption">
          {isOverLimit && (
            <Chip
              label={t('comments.overLimit')}
              color="error"
              size="small"
              sx={{ mr: 1 }}
            />
          )}
        </CharacterCountText>
        <CharacterCountText
          variant="caption"
          color={isOverLimit ? 'error' : 'text.secondary'}
        >
          {charCount}/{COMMENT_MAX_LENGTH}
        </CharacterCountText>
      </CounterContainer>

      <SubmitButton
        type="submit"
        variant="contained"
        disabled={!newComment.trim() || isOverLimit || submitting}
        endIcon={submitting ? <CircularProgress size={16} color="inherit" /> : <SendOutlinedIcon />}
      >
        {submitting ? t('comments.submitting') : t('comments.submit')}
      </SubmitButton>

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={handleCloseSuccess}
        message={t('comments.submitSuccess')}
      />
    </Box>
  );
}
