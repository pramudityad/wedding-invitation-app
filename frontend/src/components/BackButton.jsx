import React from 'react';
import { Button, Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';

const StyledBackButtonContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

const StyledBackButton = styled(Button)(({ theme }) => ({
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

export default function BackButton() {
  const navigate = useNavigate();

  return (
    <StyledBackButtonContainer>
      <StyledBackButton 
        variant="outlined" 
        onClick={() => navigate('/')}
        startIcon={<ArrowBackIcon />}
      >
        Back to Invitation
      </StyledBackButton>
    </StyledBackButtonContainer>
  );
}