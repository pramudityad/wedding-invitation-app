import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const StyledBackButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledBackButton = styled(Button)(({ theme }) => ({
  px: theme.spacing(3),
  py: theme.spacing(1),
  borderRadius: '8px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  borderColor: theme.palette.wedding?.navy || '#2C3E6B',
  fontFamily: "'Poppins', sans-serif",
  '&:hover': {
    borderColor: theme.palette.wedding?.navyLight || '#4A5E8B',
    color: theme.palette.wedding?.navyLight || '#4A5E8B',
    backgroundColor: 'rgba(44, 62, 107, 0.06)',
  },
}));

export default function BackButton() {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <StyledBackButtonContainer>
      <StyledBackButton 
        variant="outlined" 
        onClick={() => navigate('/')}
        startIcon={<ArrowBackIcon />}
      >
        {t('navigation.backToInvitation')}
      </StyledBackButton>
    </StyledBackButtonContainer>
  );
}
