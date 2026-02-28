import { useState, useEffect } from 'react';
import { Box, Button, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { getAllComments } from '../api/comments';
import SectionContainer from './shared/SectionContainer';

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '40px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginBottom: '20px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '12px',
  color: theme.palette.text?.secondary || '#5A5A5A',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  marginBottom: '30px',
}));

const WishesContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  gap: '16px',
  marginBottom: '30px',
});

const WishItem = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255,255,255,0.6)',
  padding: '16px',
  borderRadius: '8px',
  border: `1px solid ${theme.palette.wedding?.goldLight || '#E8D5A8'}`,
  textAlign: 'left',
}));

const WishText = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '14px',
  fontStyle: 'italic',
  color: '#5A5A5A',
  lineHeight: 1.5,
  marginBottom: '8px',
});

const WishAuthor = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '11px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  fontWeight: 600,
}));

const ViewAllButton = styled(Button)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  padding: '10px 24px',
  borderColor: theme.palette.wedding?.gold || '#C9A96E',
  color: theme.palette.wedding?.gold || '#C9A96E',
  width: '100%',
  '&:hover': {
    backgroundColor: theme.palette.wedding?.gold || '#C9A96E',
    color: '#fff',
    borderColor: theme.palette.wedding?.gold || '#C9A96E',
  },
}));

const WishesPreview = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [wishes, setWishes] = useState([]);

  useEffect(() => {
    const fetchWishes = async () => {
      try {
        const response = await getAllComments({ limit: 3 });
        if (response.comments) {
          setWishes(response.comments.slice(0, 3));
        }
      } catch (error) {
        console.error('Failed to fetch wishes:', error);
      }
    };

    fetchWishes();
  }, []);

  return (
    <SectionContainer>
      <SectionTitle sx={{ marginBottom: 0 }}>
        {t('wishesPreview.title')}
      </SectionTitle>
      <Subtitle>{wishes.length} {t('wishesPreview.subtitle')}</Subtitle>
      
      <WishesContainer>
        {wishes.map((wish) => (
          <WishItem key={wish.ID}>
            <WishText>"{wish.Content}"</WishText>
            <WishAuthor>— {wish.GuestName || t('common.anonymous')}</WishAuthor>
          </WishItem>
        ))}
      </WishesContainer>

      <ViewAllButton
        variant="outlined"
        onClick={() => navigate('/comments')}
      >
        {t('wishesPreview.viewAll')}
      </ViewAllButton>
    </SectionContainer>
  );
};

export default WishesPreview;
