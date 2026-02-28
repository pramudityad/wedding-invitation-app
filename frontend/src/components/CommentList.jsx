import { Box, List, Typography, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import CommentItem from './CommentItem';

const StyledList = styled(List)(({ theme }) => ({
  marginTop: theme.spacing(4),
  padding: 0,
}));

const EmptyContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const EmptyText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text?.secondary || '#5A5A5A',
  fontStyle: 'italic',
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '16px',
}));

const LoadingMoreContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  padding: theme.spacing(4),
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.wedding?.navy || '#2C3E6B',
}));

const LoadingMoreText = styled(Typography)(({ theme }) => ({
  marginTop: '16px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  fontFamily: "'Poppins', sans-serif",
}));

const EndContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(4),
  paddingBottom: theme.spacing(2),
}));

const EndText = styled(Typography)(({ theme }) => ({
  color: theme.palette.wedding?.gold || '#C9A96E',
  fontFamily: "'Poppins', sans-serif",
}));

export default function CommentList({ comments, loadingMore, hasMore, lastCommentRef }) {
  const { t } = useTranslation();

  return (
    <>
      <StyledList role="list" aria-label={t('common.guestComments')}>
        {comments.length === 0 ? (
          <EmptyContainer>
            <EmptyText>
              {t('comments.noComments')}
            </EmptyText>
          </EmptyContainer>
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
      </StyledList>
      {loadingMore && (
        <LoadingMoreContainer role="status" aria-live="polite">
          <StyledCircularProgress size={40} />
          <LoadingMoreText>
            {t('comments.loadingMore')}
          </LoadingMoreText>
        </LoadingMoreContainer>
      )}

      {!hasMore && comments.length > 0 && (
        <EndContainer>
          <EndText variant="caption">
            {t('comments.endOfComments')}
          </EndText>
        </EndContainer>
      )}
    </>
  );
}
