import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

const ErrorContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  padding: theme.spacing(3),
  textAlign: 'center',
}));

const StyledErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: 64,
  color: theme.palette.error.main,
  marginBottom: theme.spacing(2),
}));

const ErrorTitle = styled(Typography)(({ theme }) => ({
  fontFamily: '"Cormorant Garamond", serif',
  marginBottom: theme.spacing(2),
}));

const ErrorDescription = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(3),
}));

const DebugContainer = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  padding: theme.spacing(2),
  backgroundColor: theme.palette.grey[100],
  borderRadius: theme.shape.borderRadius,
  maxWidth: 600,
  overflow: 'auto',
}));

const DebugText = styled(Typography)({
  fontFamily: 'monospace',
  margin: 0,
});

const ResetButton = styled(Button)(({ theme }) => ({
  marginTop: theme.spacing(2),
  paddingLeft: theme.spacing(4),
  paddingRight: theme.spacing(4),
  paddingTop: theme.spacing(1),
  paddingBottom: theme.spacing(1),
  borderColor: theme.palette.wedding?.navy || '#2C3E6B',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  '&:hover': {
    backgroundColor: theme.palette.wedding?.navy || '#2C3E6B',
    color: 'white',
    borderColor: theme.palette.wedding?.navy || '#2C3E6B',
  },
}));

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('ErrorBoundary caught an error:', error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const isDevelopment = process.env.NODE_ENV === 'development';

      return (
        <ErrorContainer>
          <StyledErrorIcon />
          <ErrorTitle variant="h4" gutterBottom>
            Oops! Something went wrong
          </ErrorTitle>
          <ErrorDescription variant="body1" color="text.secondary">
            We're sorry, but something unexpected happened. Please try again.
          </ErrorDescription>
          
          {isDevelopment && (
            <DebugContainer>
              <Typography variant="subtitle2" color="error" gutterBottom>
                Development Error Details:
              </Typography>
              <DebugText variant="body2" component="pre">
                {this.state.error && this.state.error.toString()}
                {'\n\n'}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </DebugText>
            </DebugContainer>
          )}

          <ResetButton 
            variant="outlined" 
            onClick={this.resetErrorBoundary}
          >
            Try Again
          </ResetButton>
        </ErrorContainer>
      );
    }

    return this.props.children;
  }
}


export default ErrorBoundary;
