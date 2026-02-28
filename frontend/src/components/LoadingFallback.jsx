import React from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';

const FallbackContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  gap: theme.spacing(2),
  backgroundColor: theme.palette.background.default,
}));

const StyledCircularProgress = styled(CircularProgress)(({ theme }) => ({
  color: theme.palette.wedding?.gold || '#C9A96E',
}));

const LoadingText = styled(Typography)(({ theme }) => ({
  color: theme.palette.wedding?.navy || '#2C3E6B',
  fontFamily: "'Poppins', sans-serif",
}));

const LoadingFallback = () => {
  return (
    <FallbackContainer>
      <StyledCircularProgress size={60} />
      <LoadingText variant="body1">
        Loading...
      </LoadingText>
    </FallbackContainer>
  );
};

export default LoadingFallback;
