import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { ContentCopy, CardGiftcard } from '@mui/icons-material';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

const StyledGiftBoxContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledGiftBox = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  border: '1px solid #E8D5A8',
  borderRadius: '8px',
  padding: theme.spacing(3),
  textAlign: 'center',
  position: 'relative',
}));

const StyledGiftTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontWeight: 400,
  color: '#2C3E6B',
  marginBottom: theme.spacing(2),
  fontSize: '40px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const StyledAccountContainer = styled(Box)(({ theme }) => ({
  backgroundColor: 'rgba(255, 255, 255, 0.6)',
  borderRadius: '8px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid #E8D5A8',
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StyledBankName = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  color: '#2C3E6B',
  fontSize: '14px',
  marginBottom: '4px',
});

const StyledAccountName = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 400,
  color: '#888',
  fontSize: '12px',
  marginBottom: '8px',
});

const StyledAccountNumber = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const StyledAccountNumberText = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 400,
  color: '#333',
  fontSize: '18px',
  letterSpacing: '2px',
  fontVariantNumeric: 'tabular-nums',
});

const StyledCopyButton = styled(IconButton)({
  fontSize: '10px',
  textTransform: 'uppercase',
  border: '1px solid #C9A96E',
  color: '#C9A96E',
  borderRadius: '4px',
  padding: '4px 8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: '#C9A96E',
    color: '#FFFFFF',
  },
});

const StyledGiftMessage = styled(Typography)({
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 300,
  color: '#5A5A5A',
  fontSize: '15px',
  fontStyle: 'italic',
  marginTop: '16px',
  lineHeight: 1.6,
});

export default function GiftBox() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { t } = useTranslation();

  // Get bank account details from environment variables
  const accounts = [
    {
      bankName: import.meta.env.VITE_PARTNER1_BANK_NAME,
      name: import.meta.env.VITE_PARTNER1_ACCOUNT_NAME,
      number: import.meta.env.VITE_PARTNER1_ACCOUNT_NUMBER,
    },
    {
      bankName: import.meta.env.VITE_PARTNER2_BANK_NAME,
      name: import.meta.env.VITE_PARTNER2_ACCOUNT_NAME,
      number: import.meta.env.VITE_PARTNER2_ACCOUNT_NUMBER,
    },
  ].filter(account => account.name && account.number);

  const handleCopyToClipboard = async (accountNumber, accountName, index) => {
    try {
      await navigator.clipboard.writeText(accountNumber);
      setCopiedIndex(index);
      setSnackbar({
        open: true,
        message: t('gift.copySuccess', { name: accountName }),
      });
      setTimeout(() => setCopiedIndex(null), 2000);
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

  // Don't render the component if no accounts are configured
  if (accounts.length === 0) {
    return null;
  }

  return (
    <StyledGiftBoxContainer>
      <StyledGiftBox>
        <StyledGiftTitle>
          <CardGiftcard sx={{ fontSize: 'inherit' }} />
          {t('gift.title')}
        </StyledGiftTitle>

        <StyledGiftMessage>
          {t('gift.message')}
        </StyledGiftMessage>

        <Box sx={{ mt: 3 }}>
          {accounts.map((account, index) => (
            <StyledAccountContainer key={index}>
              {account.bankName && (
                <StyledBankName>
                  {account.bankName}
                </StyledBankName>
              )}
              <StyledAccountName>
                {account.name}
              </StyledAccountName>
              <StyledAccountNumber>
                <StyledAccountNumberText>
                  {account.number}
                </StyledAccountNumberText>
                <Tooltip title={t('common.copy')}>
                  <StyledCopyButton
                    size="small"
                    onClick={() => handleCopyToClipboard(account.number, account.name, index)}
                    sx={copiedIndex === index ? {
                      backgroundColor: '#2C3E6B',
                      color: '#FFFFFF',
                      borderColor: '#2C3E6B',
                      '&:hover': {
                        backgroundColor: '#2C3E6B',
                        color: '#FFFFFF',
                      },
                    } : {}}
                  >
                    <ContentCopy fontSize="small" />
                  </StyledCopyButton>
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
