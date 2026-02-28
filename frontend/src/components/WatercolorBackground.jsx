import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { memo } from 'react';

const WatercolorBg = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -2,
  background: `
    radial-gradient(ellipse at 20% 10%, rgba(184, 205, 232, 0.4) 0%, transparent 50%),
    radial-gradient(ellipse at 80% 20%, rgba(201, 169, 110, 0.15) 0%, transparent 40%),
    radial-gradient(ellipse at 50% 40%, rgba(212, 227, 245, 0.3) 0%, transparent 50%),
    radial-gradient(ellipse at 10% 60%, rgba(232, 213, 168, 0.2) 0%, transparent 40%),
    radial-gradient(ellipse at 90% 70%, rgba(184, 205, 232, 0.35) 0%, transparent 45%),
    radial-gradient(ellipse at 40% 90%, rgba(240, 224, 208, 0.3) 0%, transparent 50%),
    linear-gradient(180deg, #FBF7F0 0%, #F0E8DC 100%)
  `,
});

const WatercolorOverlay = styled(Box)({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100%',
  height: '100%',
  zIndex: -1,
  background: `
    radial-gradient(circle at 30% 30%, rgba(184, 205, 232, 0.2) 0%, transparent 30%),
    radial-gradient(circle at 70% 50%, rgba(201, 169, 110, 0.1) 0%, transparent 25%),
    radial-gradient(circle at 20% 80%, rgba(212, 227, 245, 0.25) 0%, transparent 35%)
  `,
  animation: 'floatBg 20s ease-in-out infinite alternate',
  '@keyframes floatBg': {
    '0%': { transform: 'translate(0, 0) scale(1)' },
    '100%': { transform: 'translate(-20px, -10px) scale(1.05)' },
  },
});

const WatercolorBackground = memo(function WatercolorBackground() {
  return (
    <>
      <WatercolorBg />
      <WatercolorOverlay />
    </>
  );
});

export default WatercolorBackground;
