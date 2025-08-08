import React from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledRSVPSection = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(4),
}));

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
  backgroundColor: colorKey === 'yes' ? '#669966' : '#a7a7a3',
  color: 'white',
  '&:hover': {
    backgroundColor: colorKey === 'yes' ? '#558855' : '#999990',
    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
  },
  '&:disabled': {
    backgroundColor: '#cccccc',
    color: '#666666',
  },
}));

export default function RsvpSection({ rsvpStatus, isLoading, handleRSVP }) {
  return (
    <StyledRSVPSection>
      <Typography variant="h6" sx={{ 
        mb: 3, 
        fontFamily: "'Playfair Display', serif", 
        fontWeight: 400, 
        color: '#333' 
      }}>
        {isLoading && rsvpStatus === null ? (
          <Box sx={{ display: 'inline-flex', alignItems: 'center' }}>
            <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
            Loading...
          </Box>
        ) : rsvpStatus === null ? (
          'Will you be attending?'
        ) : rsvpStatus === true ? (
          'Thank you for your RSVP! We look forward to celebrating with you.'
        ) : (
          'We\'ve received your RSVP. We understand if you cannot make it.'
        )}
      </Typography>

      {!isLoading && rsvpStatus === null && (
        <StyledRSVPButtonsContainer>
          <StyledRSVPButton 
            colorKey="yes" 
            onClick={() => handleRSVP(true)} 
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Yes, I will be there'}
          </StyledRSVPButton>
          
          <StyledRSVPButton 
            colorKey="no" 
            onClick={() => handleRSVP(false)} 
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : 'No, I cannot make it'}
          </StyledRSVPButton>
        </StyledRSVPButtonsContainer>
      )}
    </StyledRSVPSection>
  );
}