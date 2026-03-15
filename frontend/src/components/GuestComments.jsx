import { Box, Typography, CircularProgress, Alert, Button, IconButton, Tooltip } from '@mui/material';
import { styled } from '@mui/material/styles';
import RefreshIcon from '@mui/icons-material/Refresh';
import { useTranslation } from 'react-i18next';
import BackButton from './BackButton';
import LanguageSwitcher from './LanguageSwitcher';
import WatercolorBackground from './WatercolorBackground';
import CommentForm from './CommentForm';
import CommentList from './CommentList';
import { useInfiniteComments } from '../hooks/useInfiniteComments';
import { COLORS } from '../constants';

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
  color: COLORS.navy,
});

const LoadingText = styled(Typography)({
  marginTop: '16px',
  color: COLORS.navy,
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
  color: COLORS.navy,
  flex: 1,
  textAlign: 'center',
});

const RefreshButton = styled(IconButton)({
  marginLeft: '16px',
  color: COLORS.navy,
});

const WarningAlert = styled(Alert)(({ theme }) => ({
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export default function GuestComments() {
  const { t } = useTranslation();

  const {
    comments,
    error,
    initialLoading,
    loadingMore,
    hasMore,
    lastCommentRef,
    fetchComments,
    handleCommentSubmitted,
  } = useInfiniteComments({ t });

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
          <StyledErrorAlert 
            severity="error" 
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
          </StyledErrorAlert>
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
            <RefreshButton 
              onClick={() => fetchComments(true)} 
              disabled={initialLoading} 
              aria-label={t('common.refreshComments')}
            >
              <RefreshIcon />
            </RefreshButton>
          </Tooltip>
        </HeaderContainer>

        <CommentForm onCommentSubmitted={handleCommentSubmitted} />

        {error && comments.length > 0 && (
          <WarningAlert 
            severity="warning" 
            action={
              <Button color="inherit" size="small" onClick={() => fetchComments(true)}>
                Retry
              </Button>
            }
          >
            {error}
          </WarningAlert>
        )}

        <CommentList
          comments={comments}
          loadingMore={loadingMore}
          hasMore={hasMore}
          lastCommentRef={lastCommentRef}
        />
      </MainContainer>
    </>
  );
}
