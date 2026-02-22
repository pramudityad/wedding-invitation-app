import { useState, useEffect, useRef, useCallback, memo } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  List,
  ListItem,
  ListItemText,
  CircularProgress,
  Alert,
  Snackbar,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { getAllComments, submitComment } from '../api/comments';
import BackButton from './BackButton';
import LanguageSwitcher from './LanguageSwitcher';
import WatercolorBackground from './WatercolorBackground';

const COMMENT_MAX_LENGTH = 500;
const COMMENTS_PER_PAGE = 10;

const CommentItem = memo(({ comment, isLast, lastCommentRef }) => (
  <ListItem
    ref={isLast ? lastCommentRef : null}
    disableGutters
    sx={{
      p: 3,
      mb: 2,
      backgroundColor: 'rgba(255,255,255,0.5)',
      borderRadius: '8px',
      border: '1px solid #E8D5A8',
      '&:last-child': {
        mb: 0,
      },
    }}
  >
    <ListItemText
      primary={comment.Content}
      primaryTypographyProps={{
        fontFamily: "'Cormorant Garamond', serif",
        fontSize: '15px',
        fontStyle: 'italic',
        color: '#5A5A5A',
        mb: 1,
        lineHeight: 1.6,
      }}
      secondary={
        <>
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: '#2C3E6B',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            {comment.GuestName || 'Anonymous'}
          </Typography>
          <Typography
            component="span"
            variant="body2"
            sx={{
              color: '#999',
              fontFamily: "'Poppins', sans-serif",
              fontSize: '10px',
              ml: 1,
            }}
          >
            —{' '}
            {new Intl.DateTimeFormat('en-US', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
            }).format(new Date(comment.CreatedAt))}
          </Typography>
        </>
      }
      secondaryTypographyProps={{
        component: 'div',
        sx: { mt: 1 },
      }}
    />
  </ListItem>
));

CommentItem.displayName = 'CommentItem';

export default function GuestComments() {
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [nextCursor, setNextCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [showSnackbar, setShowSnackbar] = useState(false);
  const lastCommentRef = useRef(null);
  const observerRef = useRef(null);
  const textFieldRef = useRef(null);
  const { t } = useTranslation();

  const fetchComments = useCallback(async (isRefresh = false) => {
    if (isRefresh) {
      setError(null);
      setComments([]);
      setNextCursor(null);
    } else {
      setInitialLoading(true);
      setError(null);
    }

    try {
      const response = await getAllComments({ limit: COMMENTS_PER_PAGE });
      const commentsArray = response.comments || [];
      setComments(commentsArray);
      setNextCursor(response.next_cursor || null);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setError(t('comments.loadError'));
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);

    const trimmedComment = newComment.trim();
    if (!trimmedComment) {
      setSubmitError(t('comments.emptyError'));
      return;
    }

    if (trimmedComment.length > COMMENT_MAX_LENGTH) {
      setSubmitError(t('comments.lengthError', { max: COMMENT_MAX_LENGTH }));
      return;
    }

    setSubmitting(true);
    try {
      const response = await submitComment(trimmedComment);
      setComments([response, ...comments]);
      setNewComment('');
      setSubmitError(null);
      setSuccessMessage(t('comments.successMessage'));
      setShowSnackbar(true);

      if (textFieldRef.current) {
        textFieldRef.current.blur();
      }
    } catch (error) {
      console.error('Failed to post comment:', error);
      if (error.response?.data?.error?.includes('Maximum of 2 comments')) {
        setSubmitError(t('comments.limitReached', { max: 2 }));
      } else if (error.response?.data?.error) {
        setSubmitError(`Error: ${error.response.data.details}`);
      } else if (error.response?.status) {
        setSubmitError(
          `Failed to post comment (HTTP ${error.response.status}): ${error.message || 'Unknown error'}`
        );
      } else if (error.message) {
        setSubmitError(`Failed to post comment: ${error.message}`);
      } else {
        setSubmitError(t('comments.submitError'));
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !submitting) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const characterCount = newComment.length;
  const isOverLimit = characterCount > COMMENT_MAX_LENGTH;

  const loadMoreComments = useCallback(async () => {
    if (!nextCursor || loadingMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const response = await getAllComments({ limit: COMMENTS_PER_PAGE, cursor: nextCursor });
      const newComments = response.comments || [];
      setComments((prev) => [...prev, ...newComments]);
      setNextCursor(response.next_cursor || null);
    } catch (error) {
      console.error('Error loading more comments:', error);
      setError(t('comments.loadError'));
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore]);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreComments();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (lastCommentRef.current) {
      observerRef.current.observe(lastCommentRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [loadMoreComments, comments.length]);

  if (initialLoading) {
    return (
      <>
        <WatercolorBackground />
        <Box sx={{ textAlign: 'center', p: 4, minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <CircularProgress size={40} sx={{ color: '#2C3E6B' }} />
          <Typography sx={{ mt: 2, color: '#2C3E6B', fontFamily: "'Poppins', sans-serif" }}>
            {t('comments.loading')}
          </Typography>
        </Box>
      </>
    );
  }

  if (error && comments.length === 0) {
    return (
      <>
        <WatercolorBackground />
        <Box
          sx={{
            p: { xs: 2, md: 4 },
            maxWidth: '520px',
            mx: 'auto',
            mt: 4,
            mb: 4,
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 1000 }}>
            <LanguageSwitcher />
          </Box>
          <BackButton />
          <Alert
            severity="error"
            sx={{ mx: 'auto', maxWidth: '520px', mt: 4 }}
            action={
              <Tooltip title={t('common.refreshComments')}>
                <IconButton
                  color="inherit"
                  size="small"
                  onClick={() => fetchComments(true)}
                  aria-label={t('common.refreshComments')}
                >
                  <RefreshIcon />
                </IconButton>
              </Tooltip>
            }
          >
            {error}
          </Alert>
        </Box>
      </>
    );
  }

  return (
    <>
      <WatercolorBackground />
      <Box
        sx={{
          p: { xs: 2, md: 4 },
          maxWidth: '520px',
          mx: 'auto',
          mt: 2,
          mb: 4,
          position: 'relative',
          zIndex: 1,
        }}
      >
        <BackButton />
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 4 }}>
          <Typography
            variant="h5"
            sx={{
              fontFamily: "'Great Vibes', cursive",
              fontSize: '40px',
              fontWeight: 400,
              color: '#2C3E6B',
              flex: 1,
              textAlign: 'center',
            }}
          >
            {t('comments.title')}
          </Typography>
          <Tooltip title={t('common.refreshComments')}>
            <IconButton
              onClick={() => fetchComments(true)}
              disabled={initialLoading}
              aria-label={t('common.refreshComments')}
              sx={{ ml: 2, color: '#2C3E6B' }}
            >
              <RefreshIcon />
            </IconButton>
          </Tooltip>
        </Box>

        <form onSubmit={handleSubmit}>
          <TextField
            ref={textFieldRef}
            fullWidth
            variant="outlined"
            label={t('comments.placeholder')}
            placeholder={t('comments.placeholderHint')}
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={submitting}
            multiline
            rows={3}
            error={isOverLimit}
            inputProps={{
              maxLength: COMMENT_MAX_LENGTH + 50,
              'aria-describedby': 'character-count-helper',
            }}
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                borderRadius: '8px',
                backgroundColor: 'rgba(255,255,255,0.6)',
                fontFamily: "'Poppins', sans-serif",
                fontSize: '13px',
                '& fieldset': {
                  borderColor: isOverLimit ? '#f44336' : '#E8D5A8',
                },
                '&:hover fieldset': {
                  borderColor: isOverLimit ? '#f44336' : '#C9A96E',
                },
                '&.Mui-focused fieldset': {
                  borderColor: isOverLimit ? '#f44336' : '#2C3E6B',
                },
              },
            }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography
              id="character-count-helper"
              variant="caption"
              color={isOverLimit ? 'error' : 'textSecondary'}
              aria-live="polite"
              sx={{ fontFamily: "'Poppins', sans-serif" }}
            >
              {t('comments.characterCount', { count: characterCount, max: COMMENT_MAX_LENGTH })}
            </Typography>
            {characterCount > 0 && (
              <Chip
                size="small"
                label={t('comments.charactersLeft', {
                  remaining: Math.max(0, COMMENT_MAX_LENGTH - characterCount),
                })}
                color={
                  isOverLimit ? 'error' : characterCount > COMMENT_MAX_LENGTH * 0.8 ? 'warning' : 'default'
                }
                variant="outlined"
              />
            )}
          </Box>
          {submitError && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {submitError}
            </Alert>
          )}
          <Button
            type="submit"
            variant="contained"
            disabled={submitting || isOverLimit || !newComment.trim()}
            sx={{
              px: 4,
              py: 1,
              fontSize: '11px',
              fontFamily: "'Poppins', sans-serif",
              letterSpacing: '2px',
              textTransform: 'uppercase',
              borderRadius: 0,
              display: 'block',
              mx: 'auto',
              minWidth: '180px',
              background: '#2C3E6B',
              color: '#FFFFFF',
              '&:hover': {
                background: '#4A5E8B',
              },
              '&:disabled': {
                background: '#ccc',
              },
            }}
            startIcon={submitting ? null : <SendOutlinedIcon />}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : t('comments.submitButton')}
          </Button>
        </form>

        <Snackbar
          open={showSnackbar}
          autoHideDuration={4000}
          onClose={() => setShowSnackbar(false)}
          message={successMessage}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        />

        {error && comments.length > 0 && (
          <Alert
            severity="warning"
            sx={{ mt: 2, mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={() => fetchComments(true)}>
                Retry
              </Button>
            }
          >
            {error}
          </Alert>
        )}

        <List sx={{ mt: 4, p: 0 }} role="list" aria-label={t('common.guestComments')}>
          {comments.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 6 }}>
              <Typography
                sx={{
                  color: '#5A5A5A',
                  fontStyle: 'italic',
                  fontFamily: "'Cormorant Garamond', serif",
                  fontSize: '16px',
                }}
              >
                {t('comments.noComments')}
              </Typography>
            </Box>
          ) : (
            comments.map((comment, index) => (
              <CommentItem
                key={comment.ID}
                comment={comment}
                isLast={index === comments.length - 1}
                lastCommentRef={lastCommentRef}
              />
            ))
          )}
        </List>
        {loadingMore && (
          <Box sx={{ textAlign: 'center', p: 4 }} role="status" aria-live="polite">
            <CircularProgress size={40} sx={{ color: '#2C3E6B' }} />
            <Typography sx={{ mt: 2, color: '#2C3E6B', fontFamily: "'Poppins', sans-serif" }}>
              {t('comments.loadingMore')}
            </Typography>
          </Box>
        )}

        {!nextCursor && comments.length > 0 && (
          <Box sx={{ textAlign: 'center', pt: 4, pb: 2 }}>
            <Typography
              variant="caption"
              sx={{ color: '#C9A96E', fontFamily: "'Poppins', sans-serif" }}
            >
              {t('comments.endOfComments')}
            </Typography>
          </Box>
        )}
      </Box>
    </>
  );
}
