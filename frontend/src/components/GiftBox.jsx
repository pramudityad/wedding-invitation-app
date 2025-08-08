import { styled } from '@mui/material/styles';
import { Box, Typography, IconButton, Tooltip, Snackbar, Alert } from '@mui/material';
import { ContentCopy, CardGiftcard } from '@mui/icons-material';
import { useState } from 'react';

const StyledGiftBoxContainer = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
}));

const StyledGiftBox = styled(Box)(({ theme }) => ({
  backgroundColor: '#fff',
  border: '2px solid #e8e3d9',
  borderRadius: '12px',
  padding: theme.spacing(3),
  textAlign: 'center',
  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
  position: 'relative',
  background: 'linear-gradient(135deg, #fff 0%, #fafafa 100%)',
}));

const StyledGiftTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Playfair Display', serif",
  fontWeight: 400,
  color: '#5a4c4d',
  marginBottom: theme.spacing(2),
  fontSize: theme.typography.pxToRem(24),
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(28),
  },
}));

const StyledAccountContainer = styled(Box)(({ theme }) => ({
  backgroundColor: '#f9f9f7',
  borderRadius: '8px',
  padding: theme.spacing(2),
  marginBottom: theme.spacing(2),
  border: '1px solid #e8e3d9',
  '&:last-child': {
    marginBottom: 0,
  },
}));

const StyledAccountName = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 500,
  color: '#333',
  fontSize: theme.typography.pxToRem(16),
  marginBottom: theme.spacing(1),
}));

const StyledAccountNumber = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  backgroundColor: '#fff',
  borderRadius: '6px',
  padding: theme.spacing(1, 2),
  border: '1px solid #ddd',
}));

const StyledAccountNumberText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 400,
  color: '#555',
  fontSize: theme.typography.pxToRem(14),
  letterSpacing: '0.5px',
  fontVariantNumeric: 'tabular-nums',
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(16),
  },
}));

const StyledGiftMessage = styled(Typography)(({ theme }) => ({
  fontFamily: "'Montserrat', sans-serif",
  fontWeight: 300,
  color: '#666',
  fontSize: theme.typography.pxToRem(14),
  fontStyle: 'italic',
  marginTop: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    fontSize: theme.typography.pxToRem(15),
  },
}));

export default function GiftBox() {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
  });

  // Get bank account details from environment variables
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
        message: `${accountName}'s account number copied to clipboard!`,
      });
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
      setSnackbar({
        open: true,
        message: 'Failed to copy to clipboard',
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
          Wedding Gift
        </StyledGiftTitle>

        <StyledGiftMessage>
          Your presence is the greatest gift, but if you wish to give something special:
        </StyledGiftMessage>

        <Box sx={{ mt: 3 }}>
          {accounts.map((account, index) => (
            <StyledAccountContainer key={index}>
              <StyledAccountName>
                {account.name}
              </StyledAccountName>
              <StyledAccountNumber>
                <StyledAccountNumberText>
                  {account.number}
                </StyledAccountNumberText>
                <Tooltip title="Copy to clipboard">
                  <IconButton
                    size="small"
                    onClick={() => handleCopyToClipboard(account.number, account.name)}
                    sx={{
                      color: '#5a4c4d',
                      '&:hover': {
                        backgroundColor: 'rgba(90, 76, 77, 0.08)',
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