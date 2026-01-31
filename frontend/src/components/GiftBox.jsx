import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { ContentCopy, CardGiftcard } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const StyledGiftBoxContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(6),
  marginBottom: theme.spacing(4),
}));

const StyledGiftBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(201, 169, 97, 0.05)',
  border: '1px solid rgba(201, 169, 97, 0.3)',
  borderRadius: '12px',
  padding: theme.spacing(4),
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(107, 93, 84, 0.08)',
  position: 'relative',
}));

const StyledGiftTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 500,
  color: '#6B5D54',
  marginBottom: theme.spacing(2),
  fontSize: '1.25rem',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const StyledAccountContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#FFFEF5',
  borderRadius: '8px',
  padding: theme.spacing(2.5),
  marginBottom: theme.spacing(2.5),
  border: '1px solid rgba(107, 93, 84, 0.15)',
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StyledAccountName = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
  color: '#6B5D54',
  fontSize: '1rem',
  marginBottom: theme.spacing(1),
}));

const StyledAccountNumber = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  backgroundColor: '#FFFEF5',
  borderRadius: '6px',
  padding: theme.spacing(1.5, 2.5),
  border: '1px solid rgba(139, 115, 85, 0.2)',
}));

const StyledAccountNumberText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 400,
  color: '#8B7355',
  fontSize: '1rem',
  letterSpacing: '0.5px',
  fontVariantNumeric: 'tabular-nums',
}));

const StyledGiftMessage = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 300,
  color: '#8B7355',
  fontSize: '1rem',
  fontStyle: 'italic',
  marginTop: theme.spacing(2),
  marginBottom: theme.spacing(2),
}));

export default function GiftBox() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });
  const { t } = useTranslation();

  const accounts = [
    {
      name: import.meta.env.VITE_PARTNER1_ACCOUNT_NAME,
      number: import.meta.env.VITE_PARTNER1_ACCOUNT_NUMBER,
    },
    {
      name: import.meta.env.VITE_PARTNER2_ACCOUNT_NAME,
      number: import.meta.env.VITE_PARTNER2_ACCOUNT_NUMBER,
    },
  ].filter(account => account.name && account.number);

  const handleCopyToClipboard = async (accountNumber, accountName) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setSnackbar({
        open: true,
        message: t('gift.copySuccess', { name: accountName }),
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setSnackbar({
        open: true,
        message: t('gift.copyError'),
      });
    }
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (accounts.length === 0) {
    return null;
  }

  return (
    <StyledGiftBoxContainer>
      <StyledGiftBox>
        <StyledGiftTitle>
          <CardGiftcard sx={{ fontSize: 'inherit', color: '#C9A961' }} />
          {t('gift.title')}
        </StyledGiftTitle>

        <StyledGiftMessage>
          {t('gift.message')}
        </StyledGiftMessage>

        <Box>
          {accounts.map((account, index) => (
            <StyledAccountContainer key={index}>
              <StyledAccountName>
                {account.name}
              </StyledAccountName>
              <StyledAccountNumber>
                <StyledAccountNumberText>
                  {account.number}
                </StyledAccountNumberText>
                <Tooltip title={t('common.copy')}>
                  <IconButton
                    size="small"
                    onClick={() => handleCopyToClipboard(account.number, account.name)}
                    sx={{
                      color: '#6B5D54',
                      '&:hover': {
                        backgroundColor: 'rgba(107, 93, 84, 0.08)',
                      },
                    }}
                  >
                    <ContentCopy fontSize="small" />
                  </IconButton>
                </Tooltip>
              </StyledAccountNumber>
            </StyledAccountContainer>
          ))}
        </Box>
      </StyledGiftBox>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledGiftBoxContainer>
  );
}
