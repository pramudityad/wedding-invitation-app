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
  border: `1px solid ${theme.palette.wedding?.goldLight || '#E8D5A8'}`,
  borderRadius: '8px',
  padding: theme.spacing(3),
  textAlign: 'center',
  position: 'relative',
}));

const StyledGiftTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontWeight: 400,
  color: theme.palette.wedding?.navy || '#2C3E6B',
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
  border: `1px solid ${theme.palette.wedding?.goldLight || '#E8D5A8'}`,
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StyledBankName = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 600,
  color: theme.palette.wedding?.navy || '#2C3E6B',
  fontSize: '14px',
  marginBottom: '4px',
}));

const StyledAccountName = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 400,
  color: theme.palette.grey[500] || '#888',
  fontSize: '12px',
  marginBottom: '8px',
}));

const StyledAccountNumber = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
}));

const StyledAccountNumberText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 400,
  color: theme.palette.text?.primary || '#333',
  fontSize: '18px',
  letterSpacing: '2px',
  fontVariantNumeric: 'tabular-nums',
}));

const StyledCopyButton = styled(IconButton)(({ theme }) => ({
  fontSize: '10px',
  textTransform: 'uppercase',
  border: `1px solid ${theme.palette.wedding?.gold || '#C9A96E'}`,
  color: theme.palette.wedding?.gold || '#C9A96E',
  borderRadius: '4px',
  padding: '4px 8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.wedding?.gold || '#C9A96E',
    color: theme.palette.common.white || '#FFFFFF',
  },
}));

const StyledCopyButtonCopied = styled(IconButton)(({ theme }) => ({
  fontSize: '10px',
  textTransform: 'uppercase',
  border: `1px solid ${theme.palette.wedding?.navy || '#2C3E6B'}`,
  color: theme.palette.common.white || '#FFFFFF',
  backgroundColor: theme.palette.wedding?.navy || '#2C3E6B',
  borderRadius: '4px',
  padding: '4px 8px',
  transition: 'all 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.wedding?.navy || '#2C3E6B',
    color: theme.palette.common.white || '#FFFFFF',
  },
}));

const StyledGiftMessage = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontWeight: 300,
  color: theme.palette.text?.secondary || '#5A5A5A',
  fontSize: '15px',
  fontStyle: 'italic',
  marginTop: '16px',
  lineHeight: 1.6,
}));

const StyledCardGiftcard = styled(CardGiftcard)({
  fontSize: 'inherit',
});

const AccountsWrapper = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(3),
}));

const StyledSnackbarAlert = styled(Alert)({
  width: '100%',
});

export default function GiftBox() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });
  const [copiedIndex, setCopiedIndex] = useState(null);
  const { t } = useTranslation();

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

  if (accounts.length === 0) {
    return null;
  }

  return (
    <StyledGiftBoxContainer>
      <StyledGiftBox>
        <StyledGiftTitle>
          <StyledCardGiftcard />
          {t('gift.title')}
        </StyledGiftTitle>

        <StyledGiftMessage>
          {t('gift.message')}
        </StyledGiftMessage>

        <AccountsWrapper>
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
                  {copiedIndex === index ? (
                    <StyledCopyButtonCopied
                      size="small"
                      onClick={() => handleCopyToClipboard(account.number, account.name, index)}
                    >
                      <ContentCopy fontSize="small" />
                    </StyledCopyButtonCopied>
                  ) : (
                    <StyledCopyButton
                      size="small"
                      onClick={() => handleCopyToClipboard(account.number, account.name, index)}
                    >
                      <ContentCopy fontSize="small" />
                    </StyledCopyButton>
                  )}
                </Tooltip>
              </StyledAccountNumber>
            </StyledAccountContainer>
          ))}
        </AccountsWrapper>
      </StyledGiftBox>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <StyledSnackbarAlert onClose={handleCloseSnackbar} severity="success">
          {snackbar.message}
        </StyledSnackbarAlert>
      </Snackbar>
    </StyledGiftBoxContainer>
  );
}
