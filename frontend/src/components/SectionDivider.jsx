import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { memo } from 'react';


const DividerContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '10px 0',
});

const Line = styled(Box)(({ theme }) => ({
  width: '80px',
  height: '0.5px',
  background: `linear-gradient(to right, transparent, ${theme.palette.wedding?.gold || '#C9A96E'}, transparent)`,
}));

const Ornament = styled(Box)(({ theme }) => ({
  margin: '0 12px',
  color: theme.palette.wedding?.gold || '#C9A96E',
  fontSize: '14px',
}));

const SectionDivider = memo(function SectionDivider() {
  return (
    <DividerContainer>
      <Line />
      <Ornament>&#10022;</Ornament>
      <Line />
    </DividerContainer>
  );
});

export default SectionDivider;
