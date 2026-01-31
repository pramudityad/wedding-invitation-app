import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const StyledNavigationButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  flexWrap: 'wrap',
  marginTop: theme.spacing(4),
}));

const StyledNavButton = styled(Button)(({ theme }) => ({
  px: theme.spacing(3),
  py: theme.spacing(1),
  borderRadius: '8px',
  color: '#6B5D54',
  borderColor: 'rgba(107, 93, 84, 0.3)',
  backgroundColor: 'rgba(255, 254, 245, 0.5)',
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 400,
  fontSize: '1rem',
  textTransform: 'none',
  '&:hover': {
    borderColor: '#C9A961',
    color: '#C9A961',
    backgroundColor: 'rgba(201, 169, 97, 0.08)',
  },
}));

export default function NavigationButtons({ navigate }) {
  const { t } = useTranslation();
  
  return (
    <StyledNavigationButtonsContainer>
      <StyledNavButton variant="outlined" onClick={() => navigate('/venue')}>
        {t('navigation.venueMap')}
      </StyledNavButton>
      
      <StyledNavButton variant="outlined" onClick={() => navigate('/comments')}>
        {t('navigation.guestComments')}
      </StyledNavButton>
      
      <StyledNavButton variant="outlined" onClick={() => navigate('/gallery')}>
        {t('navigation.photoGallery')}
      </StyledNavButton>
    </StyledNavigationButtonsContainer>
  );
}
