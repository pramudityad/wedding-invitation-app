/**
 * Shared styled components
 * Reduces duplication and ensures consistent styling across the app
 */
import { Box, CircularProgress, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { COLORS } from '../../constants';

/**
 * Consistent loading spinner styled with theme navy color
 */
export const StyledCircularProgress = styled(CircularProgress)({
  color: COLORS.navy,
});

/**
 * Loading container with centered layout
 */
export const LoadingContainer = styled(Box)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  minHeight: '100vh',
  background: COLORS.background,
}));

/**
 * Loading text with consistent typography
 */
export const LoadingText = styled(Typography)({
  marginTop: '16px',
  color: COLORS.navy,
  fontFamily: "'Poppins', sans-serif",
});

/**
 * Language switcher positioning container
 */
export const LanguageSwitcherContainer = styled(Box)({
  position: 'fixed',
  top: 16,
  right: 16,
  zIndex: 1100,
});

/**
 * Section divider line
 */
export const SectionDividerLine = styled(Box)(({ theme }) => ({
  width: '60px',
  height: '1px',
  background: theme.palette.wedding?.gold || COLORS.gold,
  margin: `${theme.spacing(4)} auto`,
}));
