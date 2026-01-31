import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const StyledRSVPSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(4),
}));

const StyledRSVPButtonsContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  gap: theme.spacing(2),
  justifyContent: 'center',
  marginBottom: theme.spacing(2),
  flexWrap: 'wrap',
}));

const StyledRSVPButton = styled(Button)(({ theme, colorKey }) => ({
  px: theme.spacing(4),
  py: theme.spacing(1.5),
  borderRadius: '8px',
  minWidth: '150px',
  fontSize: '1rem',
  backgroundColor: colorKey === 'yes' ? '#C9A961' : '#6B5D54',
  color: 'white',
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 500,
  textTransform: 'none',
  '&:hover': {
    backgroundColor: colorKey === 'yes' ? '#b89850' : '#5a4e47',
    boxShadow: '0 2px 8px rgba(107, 93, 84, 0.2)',
  },
  '&:disabled': {
    backgroundColor: '#8B7355',
    color: '#a09085',
  },
}));

export default function RsvpSection({ rsvpStatus, isLoading, handleRSVP }) {
  const { t } = useTranslation();
  
  return (
    <StyledRSVPSection>
      <Typography variant="h6" sx={{ 
        mb: 3, 
        fontFamily: "'Cormorant Garamond', serif", 
        fontWeight: 400, 
        color: '#6B5D54',
        fontSize: '1.25rem',
        fontStyle: 'italic',
      }}>
        {isLoading && rsvpStatus === null ? (
          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            {t('rsvp.loading')}
          </Box>
        ) : rsvpStatus === null ? (
          t('rsvp.question')
        ) : rsvpStatus === true ? (
          t('rsvp.yesConfirmation')
        ) : (
          t('rsvp.noConfirmation')
        )}
      </Typography>

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
    </StyledRSVPSection>
  );
}
