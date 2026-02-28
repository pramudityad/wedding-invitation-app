import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import SectionContainer from './shared/SectionContainer';


const StyledRSVPButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(3),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
  flexWrap: 'wrap',
}));

const StyledRSVPButton = styled(Button)(({ theme, colorKey }) => ({
  px: theme.spacing(5),
  py: theme.spacing(1.5),
  borderRadius: '8px',
  minWidth: '140px',
  fontFamily: "'Poppins', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '1px',
  ...(colorKey === 'yes'
    ? {
        backgroundColor: '#2C3E6B',
        color: '#FFFFFF',
        '&:hover': {
          backgroundColor: '#4A5E8B',
          boxShadow: '0 2px 6px rgba(44, 62, 107, 0.3)',
        },
      }
    : {
        backgroundColor: 'transparent',
        color: '#2C3E6B',
        border: '2px solid #2C3E6B',
        '&:hover': {
          backgroundColor: 'rgba(44, 62, 107, 0.06)',
          borderColor: '#4A5E8B',
          color: '#4A5E8B',
        },
      }),
  '&:disabled': {
    backgroundColor: '#cccccc',
    color: '#666666',
  },
}));

const RSVPTitle = styled(Typography)({
  marginBottom: '24px',
  fontFamily: "'Great Vibes', cursive",
  fontWeight: 400,
  fontSize: '56px',
  color: '#2C3E6B',
});

const LoadingIndicator = styled(Box)({
  display: 'inline-flex',
  alignItems: 'center',
});

const StyledLoadingProgress = styled(CircularProgress)({
  color: '#2C3E6B',
  marginRight: '8px',
});

const ConfirmationText = styled('span')({
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: 'italic',
  fontSize: '24px',
  color: '#2C3E6B',
});

export default function RsvpSection({ rsvpStatus, isLoading, handleRSVP }) {
  const { t } = useTranslation();
  
  return (
    <SectionContainer>
      <RSVPTitle variant="h2">
        {isLoading && rsvpStatus === null ? (
          <LoadingIndicator>
            <StyledLoadingProgress size={20} />
            {t('rsvp.loading')}
          </LoadingIndicator>
        ) : rsvpStatus === null ? (
          t('rsvp.question')
        ) : (
          <ConfirmationText>
            {rsvpStatus === true
              ? t('rsvp.yesConfirmation')
              : t('rsvp.noConfirmation')}
          </ConfirmationText>
        )}
      </RSVPTitle>

      {!isLoading && rsvpStatus === null && (
        <StyledRSVPButtonsContainer>
          <StyledRSVPButton 
            colorKey="yes" 
            onClick={() => handleRSVP(true)} 
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t('rsvp.yesButton')}
          </StyledRSVPButton>
          
          <StyledRSVPButton 
            colorKey="no" 
            onClick={() => handleRSVP(false)} 
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t('rsvp.noButton')}
          </StyledRSVPButton>
        </StyledRSVPButtonsContainer>
      )}
    </SectionContainer>
  );
}
