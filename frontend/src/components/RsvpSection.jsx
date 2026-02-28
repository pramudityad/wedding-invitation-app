import React, { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
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
  fontFamily: "'Cormorant Garamond', serif",
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

// --- Dialog styled components ---

const StyledDialogPaper = styled('div')({
  borderRadius: '16px',
  padding: '8px',
  maxWidth: '400px',
  width: '100%',
  textAlign: 'center',
  border: '1px solid rgba(201, 168, 76, 0.3)',
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
});

const DialogTitleStyled = styled(DialogTitle)({
  fontFamily: "'Great Vibes', cursive",
  fontWeight: 400,
  fontSize: '40px',
  color: '#2C3E6B',
  padding: '16px 24px 8px',
});

const DialogMessageStyled = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: 'italic',
  fontSize: '18px',
  color: '#2C3E6B',
  padding: '0 8px',
});

const DialogActionsStyled = styled(DialogActions)({
  justifyContent: 'center',
  gap: '16px',
  padding: '16px 24px 20px',
  flexWrap: 'wrap',
});

const ConfirmButton = styled(Button)({
  backgroundColor: '#2C3E6B',
  color: '#FFFFFF',
  borderRadius: '8px',
  minWidth: '140px',
  fontFamily: "'Poppins', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '1px',
  '&:hover': {
    backgroundColor: '#4A5E8B',
    boxShadow: '0 2px 6px rgba(44, 62, 107, 0.3)',
  },
});

const CancelButton = styled(Button)({
  backgroundColor: 'transparent',
  color: '#2C3E6B',
  border: '2px solid #2C3E6B',
  borderRadius: '8px',
  minWidth: '140px',
  fontFamily: "'Poppins', sans-serif",
  textTransform: 'uppercase',
  letterSpacing: '1px',
  '&:hover': {
    backgroundColor: 'rgba(44, 62, 107, 0.06)',
    borderColor: '#4A5E8B',
    color: '#4A5E8B',
  },
});

export default function RsvpSection({ rsvpStatus, isLoading, handleRSVP }) {
  const { t } = useTranslation();
  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingChoice, setPendingChoice] = useState(null);

  const handleButtonClick = (attending) => {
    setPendingChoice(attending);
    setShowConfirm(true);
  };

  const handleConfirm = () => {
    setShowConfirm(false);
    handleRSVP(pendingChoice);
    setPendingChoice(null);
  };

  const handleCancel = () => {
    setShowConfirm(false);
    setPendingChoice(null);
  };

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
            onClick={() => handleButtonClick(true)}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t('rsvp.yesButton')}
          </StyledRSVPButton>

          <StyledRSVPButton
            colorKey="no"
            onClick={() => handleButtonClick(false)}
            disabled={isLoading}
          >
            {isLoading ? <CircularProgress size={24} color="inherit" /> : t('rsvp.noButton')}
          </StyledRSVPButton>
        </StyledRSVPButtonsContainer>
      )}

      <Dialog
        open={showConfirm}
        onClose={handleCancel}
        PaperComponent={StyledDialogPaper}
        PaperProps={{ elevation: 8 }}
      >
        <DialogTitleStyled>{t('rsvp.confirmTitle')}</DialogTitleStyled>
        <DialogContent>
          <DialogMessageStyled>
            {pendingChoice === true
              ? t('rsvp.confirmAttending')
              : t('rsvp.confirmNotAttending')}
          </DialogMessageStyled>
        </DialogContent>
        <DialogActionsStyled>
          <CancelButton onClick={handleCancel}>
            {t('rsvp.cancelButton')}
          </CancelButton>
          <ConfirmButton onClick={handleConfirm}>
            {t('rsvp.confirmButton')}
          </ConfirmButton>
        </DialogActionsStyled>
      </Dialog>
    </SectionContainer>
  );
}
