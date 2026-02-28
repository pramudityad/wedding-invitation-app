import { memo } from 'react';
import { ListItem, ListItemText, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const StyledListItem = styled(ListItem)(({ theme }) => ({
  padding: theme.spacing(3),
  marginBottom: theme.spacing(2),
  backgroundColor: 'rgba(255,255,255,0.5)',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.wedding?.goldLight || '#E8D5A8'}`,
  '&:last-child': {
    marginBottom: 0,
  },
}));

const PrimaryText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '15px',
  fontStyle: 'italic',
  color: theme.palette.text?.secondary || '#5A5A5A',
  marginBottom: theme.spacing(1),
  lineHeight: 1.6,
}));

const GuestNameText = styled(Typography)(({ theme }) => ({
  color: theme.palette.wedding?.navy || '#2C3E6B',
  fontFamily: "'Poppins', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
}));

const DateText = styled(Typography)(({ theme }) => ({
  color: '#999',
  fontFamily: "'Poppins', sans-serif",
  fontSize: '10px',
  marginLeft: theme.spacing(1),
}));

const CommentItem = memo(({ comment, isLast, lastCommentRef }) => {
  const { t, i18n } = useTranslation();
  const locale = i18n.language === 'id' ? 'id-ID' : 'en-US';

  return (
    <StyledListItem
      ref={isLast ? lastCommentRef : null}
      disableGutters
    >
      <ListItemText
        primary={comment.Content}
        primaryTypographyProps={{
          component: PrimaryText,
        }}
        secondary={
          <>
            <GuestNameText component="span" variant="body2">
              {comment.GuestName || t('common.anonymous')}
            </GuestNameText>
            <DateText component="span" variant="body2">
              —{' '}
              {new Intl.DateTimeFormat(locale, {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              }).format(new Date(comment.CreatedAt))}
            </DateText>
          </>
        }
        secondaryTypographyProps={{
          component: 'div',
          sx: { mt: 1 },
        }}
      />
    </StyledListItem>
  );
});

CommentItem.displayName = 'CommentItem';

export default CommentItem;
