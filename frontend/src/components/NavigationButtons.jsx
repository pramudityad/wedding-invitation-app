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
  color: '#666',
  borderColor: '#666',
  '&:hover': {
    borderColor: '#333',
    color: '#333',
    backgroundColor: 'rgba(0,0,0,0.04)',
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