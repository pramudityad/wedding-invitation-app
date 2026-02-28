import { useState, useEffect, useRef, useCallback } from 'react';
import { Box, Typography, CircularProgress, Alert, Button, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import { getAllComments } from '../api/comments';
import BackButton from './BackButton';
import LanguageSwitcher from './LanguageSwitcher';
import WatercolorBackground from './WatercolorBackground';
import CommentForm from './CommentForm';
import CommentList from './CommentList';

const COMMENTS_PER_PAGE = 10;

const LoadingContainer = styled(Box)({
  textAlign: 'center',
  padding: '32px',
  minHeight: '100vh',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
});

const StyledCircularProgress = styled(CircularProgress)({
  color: '#2C3E6B',
});

const LoadingText = styled(Typography)({
  marginTop: '16px',
  color: '#2C3E6B',
  fontFamily: "'Poppins', sans-serif",
});

const ErrorOuterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
  maxWidth: '520px',
  margin: '0 auto',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
}));

const LanguageSwitcherContainer = styled(Box)({
  position: 'fixed',
  top: 16,
  right: 16,
  zIndex: 1000,
});

const StyledErrorAlert = styled(Alert)({
  margin: '0 auto',
  maxWidth: '520px',
  marginTop: '32px',
});

const MainContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
  maxWidth: '520px',
  margin: '0 auto',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(4),
  position: 'relative',
  zIndex: 1,
}));

const HeaderContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: theme.spacing(4),
}));

const CommentsTitle = styled(Typography)({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '40px',
  fontWeight: 400,
  color: '#2C3E6B',
  flex: 1,
  textAlign: 'center',
});

const RefreshButton = styled(IconButton)({
  marginLeft: '16px',
  color: '#2C3E6B',
});

const WarningAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export default function GuestComments() {
  const [comments, setComments] = useState([]);
  const [nextCursor, setNextCursor] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState(null);
  const lastCommentRef = useRef(null);
  const observerRef = useRef(null);
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
      setComments(response.comments || []);
      setNextCursor(response.next_cursor || null);
    } catch (err) {
      console.error('Error fetching comments:', err);
      setError(t('comments.loadError'));
    } finally {
      setInitialLoading(false);
    }
  }, []);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  const loadMoreComments = useCallback(async () => {
    if (!nextCursor || loadingMore) return;
    setLoadingMore(true);
    setError(null);
    try {
      const response = await getAllComments({ limit: COMMENTS_PER_PAGE, cursor: nextCursor });
      setComments((prev) => [...prev, ...(response.comments || [])]);
      setNextCursor(response.next_cursor || null);
    } catch (err) {
      console.error('Error loading more comments:', err);
      setError(t('comments.loadError'));
    } finally {
      setLoadingMore(false);
    }
  }, [nextCursor, loadingMore]);

  useEffect(() => {
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => { if (entries[0].isIntersecting) loadMoreComments(); },
      { threshold: 0.1, rootMargin: '50px' }
    );
    if (lastCommentRef.current) observerRef.current.observe(lastCommentRef.current);
    return () => { if (observerRef.current) observerRef.current.disconnect(); };
  }, [loadMoreComments, comments.length]);

  const handleCommentSubmitted = useCallback((newComment) => {
    setComments((prev) => [newComment, ...prev]);
  }, []);

  if (initialLoading) {
    return (
      <>
        <WatercolorBackground />
        <LoadingContainer>
          <StyledCircularProgress size={40} />
          <LoadingText>{t('comments.loading')}</LoadingText>
        </LoadingContainer>
      </>
    );
  }

  if (error && comments.length === 0) {
    return (
      <>
        <WatercolorBackground />
        <ErrorOuterContainer>
          <LanguageSwitcherContainer><LanguageSwitcher /></LanguageSwitcherContainer>
          <BackButton />
          <StyledErrorAlert severity="error" action={
            <Tooltip title={t('common.refreshComments')}>
              <IconButton color="inherit" size="small" onClick={() => fetchComments(true)} aria-label={t('common.refreshComments')}>
                <RefreshIcon />
              </IconButton>
            </Tooltip>
          }>{error}</StyledErrorAlert>
        </ErrorOuterContainer>
      </>
    );
  }

  return (
    <>
      <WatercolorBackground />
      <MainContainer>
        <BackButton />
        <HeaderContainer>
          <CommentsTitle variant="h5">
            {t('comments.title')}
          </CommentsTitle>
          <Tooltip title={t('common.refreshComments')}>
            <RefreshButton onClick={() => fetchComments(true)} disabled={initialLoading} aria-label={t('common.refreshComments')}>
              <RefreshIcon />
            </RefreshButton>
          </Tooltip>
        </HeaderContainer>

        <CommentForm onCommentSubmitted={handleCommentSubmitted} />

        {error && comments.length > 0 && (
          <WarningAlert severity="warning" action={
            <Button color="inherit" size="small" onClick={() => fetchComments(true)}>Retry</Button>
          }>{error}</WarningAlert>
        )}

        <CommentList
          comments={comments}
          loadingMore={loadingMore}
          hasMore={!!nextCursor}
          lastCommentRef={lastCommentRef}
        />
      </MainContainer>
    </>
  );
}
