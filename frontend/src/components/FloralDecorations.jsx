import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

const FloralDecorationWrapper = styled(Box)(({ theme }) => ({
  position: 'fixed',
  pointerEvents: 'none',
  zIndex: 1000,
}));

const FloralTopRight = styled(FloralDecorationWrapper)(({ theme }) => ({
  top: '-2rem',
  right: '-3rem',
  width: '14rem',
  height: '16rem',
  [theme.breakpoints.down('sm')]: {
    width: '11rem',
    height: '13rem',
  },
  animation: 'floatTopRight 8s ease-in-out infinite',
  '@keyframes floatTopRight': {
    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
    '50%': { transform: 'translateY(-8px) rotate(-2deg)' },
  },
}));

const FloralTopLeft = styled(FloralDecorationWrapper)(({ theme }) => ({
  top: '-1rem',
  left: '-3.5rem',
  width: '13rem',
  height: '15rem',
  [theme.breakpoints.down('sm')]: {
    width: '11rem',
    height: '13rem',
  },
  animation: 'floatTopLeft 8s ease-in-out infinite 1s',
  '@keyframes floatTopLeft': {
    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
    '50%': { transform: 'translateY(-10px) rotate(3deg)' },
  },
}));

const FloralBottomRight = styled(FloralDecorationWrapper)(({ theme }) => ({
  bottom: '-2rem',
  right: '-3rem',
  width: '14rem',
  height: '18rem',
  [theme.breakpoints.down('sm')]: {
    width: '11rem',
    height: '14rem',
  },
  animation: 'floatBottomRight 8s ease-in-out infinite 2s',
  '@keyframes floatBottomRight': {
    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
    '50%': { transform: 'translateY(8px) rotate(2deg)' },
  },
}));

const FloralBottomLeft = styled(FloralDecorationWrapper)(({ theme }) => ({
  bottom: '0',
  left: '-3rem',
  width: '12rem',
  height: '16rem',
  [theme.breakpoints.down('sm')]: {
    width: '11rem',
    height: '14rem',
  },
  animation: 'floatBottomLeft 8s ease-in-out infinite 1.5s',
  '@keyframes floatBottomLeft': {
    '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
    '50%': { transform: 'translateY(6px) rotate(-2deg)' },
  },
}));

const TopRightFloral = () => (
  <svg viewBox="0 0 220 260" fill="none" style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' }}>
    <defs>
      <filter id="watercolor1" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="0.5"/>
      </filter>
      <filter id="watercolor2" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.03" numOctaves="4" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="0.3"/>
      </filter>
      <radialGradient id="roseGrad1" cx="30%" cy="30%">
        <stop offset="0%" stopColor="#fce4ec"/>
        <stop offset="40%" stopColor="#f8bbd9"/>
        <stop offset="70%" stopColor="#f48fb1"/>
        <stop offset="100%" stopColor="#e91e63" stopOpacity="0.6"/>
      </radialGradient>
      <radialGradient id="roseGrad2" cx="40%" cy="40%">
        <stop offset="0%" stopColor="#fff8e1"/>
        <stop offset="50%" stopColor="#ffecb3"/>
        <stop offset="100%" stopColor="#ffd54f" stopOpacity="0.7"/>
      </radialGradient>
      <linearGradient id="leafGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#a5d6a7"/>
        <stop offset="50%" stopColor="#66bb6a"/>
        <stop offset="100%" stopColor="#388e3c" stopOpacity="0.8"/>
      </linearGradient>
    </defs>
    
    <g transform="translate(135, 85)" filter="url(#watercolor1)">
      <path d="M-5,-35 Q-25,-30 -35,-10 Q-40,10 -30,25 Q-15,35 5,30 Q15,20 10,0 Q5,-20 -5,-35" fill="#f8bbd0" opacity="0.7"/>
      <path d="M10,-32 Q30,-25 40,-5 Q45,20 30,32 Q10,38 -5,28 Q-15,15 -8,-5 Q0,-25 10,-32" fill="#f48fb1" opacity="0.65"/>
      <path d="M-30,-15 Q-40,5 -35,25 Q-25,40 -5,38 Q15,35 20,20 Q22,5 10,-10 Q-5,-20 -30,-15" fill="#fce4ec" opacity="0.75"/>
      <path d="M25,-20 Q40,-5 38,18 Q32,35 12,38 Q-10,35 -18,18 Q-20,0 -5,-18 Q10,-28 25,-20" fill="#f8bbd0" opacity="0.6"/>
      <path d="M-2,-22 Q-18,-15 -22,2 Q-20,18 -5,22 Q10,20 15,5 Q12,-12 -2,-22" fill="#ec407a" opacity="0.7"/>
      <path d="M5,-20 Q20,-12 22,5 Q18,20 2,22 Q-12,18 -15,2 Q-12,-15 5,-20" fill="#f06292" opacity="0.65"/>
      <path d="M0,-12 Q-10,-8 -12,2 Q-8,12 2,12 Q10,8 10,-2 Q6,-10 0,-12" fill="#d81b60" opacity="0.8"/>
      <path d="M2,-8 Q8,-5 8,3 Q5,10 -2,8 Q-8,4 -6,-3 Q-3,-7 2,-8" fill="#c2185b" opacity="0.85"/>
      <ellipse cx="0" cy="0" rx="4" ry="3.5" fill="#880e4f" opacity="0.9"/>
    </g>
    
    <g transform="translate(75, 45)" filter="url(#watercolor2)">
      <path d="M-3,-28 Q-20,-22 -28,-5 Q-30,15 -18,25 Q-2,30 12,22 Q22,10 18,-8 Q10,-25 -3,-28" fill="#fce4ec" opacity="0.75"/>
      <path d="M8,-25 Q25,-15 28,5 Q25,22 10,28 Q-8,25 -15,10 Q-15,-8 0,-22 Q8,-25 8,-25" fill="#f8bbd0" opacity="0.7"/>
      <path d="M-18,-10 Q-25,8 -18,22 Q-5,30 12,25 Q22,15 18,-2 Q10,-18 -8,-18 Q-18,-10 -18,-10" fill="#f48fb1" opacity="0.6"/>
      <path d="M0,-15 Q-12,-10 -15,5 Q-10,18 5,18 Q15,12 15,-2 Q10,-14 0,-15" fill="#ec407a" opacity="0.75"/>
      <path d="M2,-10 Q10,-6 10,5 Q6,14 -4,12 Q-12,6 -8,-5 Q-4,-10 2,-10" fill="#d81b60" opacity="0.8"/>
      <ellipse cx="0" cy="0" rx="3" ry="2.5" fill="#880e4f" opacity="0.85"/>
    </g>
    
    <g transform="translate(160, 150)" filter="url(#watercolor1)">
      <path d="M-2,-22 Q-15,-18 -20,-2 Q-18,15 -5,20 Q10,18 15,5 Q12,-12 -2,-22" fill="#fff8e1" opacity="0.8"/>
      <path d="M5,-20 Q18,-12 20,5 Q16,18 2,22 Q-12,16 -15,2 Q-10,-15 5,-20" fill="#ffecb3" opacity="0.75"/>
      <path d="M-12,-8 Q-18,5 -12,16 Q2,22 14,15 Q20,2 12,-10 Q0,-15 -12,-8" fill="#ffe082" opacity="0.65"/>
      <path d="M0,-12 Q-8,-6 -8,5 Q-4,14 6,12 Q12,5 8,-6 Q4,-12 0,-12" fill="#ffca28" opacity="0.7"/>
      <ellipse cx="0" cy="0" rx="3.5" ry="3" fill="#ff8f00" opacity="0.6"/>
    </g>
    
    <g transform="translate(115, 190)" filter="url(#watercolor2)">
      <path d="M-2,-15 Q-10,-10 -12,0 Q-8,12 2,14 Q12,10 12,-2 Q8,-14 -2,-15" fill="#fce4ec" opacity="0.8"/>
      <path d="M0,-10 Q-6,-5 -6,4 Q-2,12 6,10 Q10,4 6,-6 Q2,-10 0,-10" fill="#f48fb1" opacity="0.75"/>
      <ellipse cx="0" cy="0" rx="3" ry="2.5" fill="#ec407a" opacity="0.8"/>
    </g>
    
    <g filter="url(#watercolor2)">
      <path d="M85,95 Q70,85 60,95 Q55,105 65,115 Q80,120 95,110 Q100,100 85,95" fill="url(#leafGrad1)" opacity="0.8"/>
      <path d="M85,95 L75,105" stroke="#2e7d32" strokeWidth="0.8" opacity="0.5"/>
      <path d="M130,125 Q115,120 105,135 Q105,150 120,155 Q140,150 145,135 Q142,122 130,125" fill="#81c784" opacity="0.75"/>
      <path d="M130,125 L120,145" stroke="#388e3c" strokeWidth="0.8" opacity="0.5"/>
      <path d="M165,100 Q180,95 185,110 Q182,125 168,128 Q155,122 155,108 Q158,98 165,100" fill="#a5d6a7" opacity="0.7"/>
      <path d="M165,100 L170,118" stroke="#388e3c" strokeWidth="0.6" opacity="0.4"/>
    </g>
    
    <g filter="url(#watercolor2)">
      <circle cx="95" cy="75" r="4" fill="#b3e5fc" opacity="0.7"/>
      <circle cx="95" cy="75" r="1.5" fill="#fff9c4" opacity="0.9"/>
      <circle cx="105" cy="82" r="3.5" fill="#b3e5fc" opacity="0.65"/>
      <circle cx="105" cy="82" r="1.2" fill="#fff9c4" opacity="0.85"/>
      <circle cx="88" cy="85" r="3" fill="#b3e5fc" opacity="0.6"/>
    </g>
  </svg>
);

const TopLeftFloral = () => (
  <svg viewBox="0 0 220 260" fill="none" style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' }}>
    <defs>
      <filter id="watercolor3" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="0.4"/>
      </filter>
      <radialGradient id="creamGrad" cx="35%" cy="35%">
        <stop offset="0%" stopColor="#fffde7"/>
        <stop offset="50%" stopColor="#fff9c4"/>
        <stop offset="100%" stopColor="#f9a825" stopOpacity="0.5"/>
      </radialGradient>
    </defs>
    
    <g transform="translate(85, 75)" filter="url(#watercolor3)">
      <path d="M-4,-30 Q-22,-24 -30,-5 Q-32,18 -18,30 Q2,35 18,25 Q28,10 22,-10 Q12,-28 -4,-30" fill="#fffde7" opacity="0.85"/>
      <path d="M10,-28 Q28,-18 32,5 Q28,25 12,32 Q-8,30 -18,15 Q-20,-5 -5,-22 Q10,-28 10,-28" fill="#fff9c4" opacity="0.8"/>
      <path d="M-22,-12 Q-32,8 -25,25 Q-10,38 10,32 Q25,22 25,2 Q20,-15 2,-22 Q-15,-18 -22,-12" fill="#fff8e1" opacity="0.7"/>
      <path d="M0,-18 Q-14,-12 -16,5 Q-12,20 5,22 Q18,16 18,-2 Q12,-16 0,-18" fill="#ffecb3" opacity="0.75"/>
      <path d="M2,-12 Q12,-8 12,5 Q8,15 -4,14 Q-14,8 -10,-5 Q-5,-12 2,-12" fill="#ffe082" opacity="0.8"/>
      <ellipse cx="0" cy="0" rx="4" ry="3.5" fill="#f9a825" opacity="0.6"/>
    </g>
    
    <g transform="translate(55, 155)" filter="url(#watercolor3)">
      <path d="M0,-8 Q-6,-4 -8,2 Q-5,10 2,10 Q9,6 8,-2 Q5,-8 0,-8" fill="#90caf9" opacity="0.85"/>
      <ellipse cx="0" cy="0" rx="2.5" ry="2" fill="#fff9c4" opacity="0.9"/>
      <path d="M15,-4 Q10,0 10,7 Q13,14 20,12 Q26,7 24,0 Q20,-5 15,-4" fill="#64b5f6" opacity="0.8"/>
      <ellipse cx="17" cy="4" rx="2" ry="1.8" fill="#fff9c4" opacity="0.85"/>
      <path d="M8,14 Q3,18 5,26 Q10,32 18,28 Q24,22 20,15 Q14,12 8,14" fill="#90caf9" opacity="0.75"/>
      <ellipse cx="13" cy="21" rx="2" ry="1.8" fill="#fff9c4" opacity="0.85"/>
      <path d="M-14,8 Q-20,12 -18,22 Q-12,28 -4,24 Q4,18 0,10 Q-6,6 -14,8" fill="#bbdefb" opacity="0.7"/>
      <ellipse cx="-8" cy="16" rx="1.8" ry="1.6" fill="#fff9c4" opacity="0.8"/>
      <path d="M-8,-12 Q-14,-8 -14,0 Q-10,8 -2,6 Q6,2 4,-6 Q0,-12 -8,-12" fill="#64b5f6" opacity="0.75"/>
      <ellipse cx="-4" cy="-3" rx="1.8" ry="1.6" fill="#fff9c4" opacity="0.85"/>
    </g>
    
    <g transform="translate(105, 135)" filter="url(#watercolor3)">
      <path d="M-2,-16 Q-12,-10 -14,2 Q-10,14 2,16 Q14,12 14,-2 Q10,-14 -2,-16" fill="#f8bbd0" opacity="0.8"/>
      <path d="M0,-10 Q-7,-5 -7,4 Q-3,12 6,10 Q12,4 8,-5 Q3,-10 0,-10" fill="#f48fb1" opacity="0.75"/>
      <ellipse cx="0" cy="0" rx="3" ry="2.5" fill="#e91e63" opacity="0.7"/>
    </g>
    
    <g filter="url(#watercolor3)">
      <path d="M70,105 Q55,98 48,110 Q50,125 65,130 Q82,125 85,112 Q80,100 70,105" fill="#81c784" opacity="0.8"/>
      <path d="M70,105 L62,120" stroke="#388e3c" strokeWidth="0.7" opacity="0.5"/>
      <path d="M90,175 Q75,172 70,185 Q75,200 92,202 Q108,195 105,180 Q98,172 90,175" fill="#a5d6a7" opacity="0.7"/>
      <path d="M90,175 L85,192" stroke="#2e7d32" strokeWidth="0.6" opacity="0.45"/>
      <path d="M45,125 Q35,135 42,148 Q55,155 65,145 Q70,132 58,122 Q48,120 45,125" fill="#66bb6a" opacity="0.75"/>
    </g>
  </svg>
);

const BottomRightFloral = () => (
  <svg viewBox="0 0 220 280" fill="none" style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' }}>
    <defs>
      <filter id="watercolor4" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.038" numOctaves="3" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="4" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="0.45"/>
      </filter>
    </defs>
    
    <g transform="translate(140, 180)" filter="url(#watercolor4)">
      <path d="M-8,-42 Q-32,-35 -42,-10 Q-45,20 -30,38 Q-8,48 15,40 Q35,25 30,-5 Q20,-38 -8,-42" fill="#fce4ec" opacity="0.75"/>
      <path d="M15,-40 Q40,-28 48,-2 Q48,30 28,45 Q5,52 -18,42 Q-35,25 -30,-5 Q-20,-35 15,-40" fill="#f8bbd0" opacity="0.7"/>
      <path d="M-35,-18 Q-48,8 -40,35 Q-22,52 10,48 Q38,38 42,10 Q38,-18 15,-32 Q-15,-28 -35,-18" fill="#f48fb1" opacity="0.6"/>
      <path d="M30,-25 Q48,-5 45,22 Q35,42 10,48 Q-18,42 -28,22 Q-30,-5 -12,-25 Q10,-35 30,-25" fill="#fce4ec" opacity="0.65"/>
      <path d="M-5,-28 Q-22,-20 -28,2 Q-24,24 -5,30 Q18,26 24,5 Q20,-18 -5,-28" fill="#ec407a" opacity="0.7"/>
      <path d="M8,-26 Q26,-15 28,8 Q22,28 4,32 Q-16,26 -22,8 Q-18,-16 8,-26" fill="#f06292" opacity="0.65"/>
      <path d="M0,-16 Q-14,-10 -16,5 Q-12,18 4,18 Q16,12 15,-4 Q10,-15 0,-16" fill="#d81b60" opacity="0.8"/>
      <path d="M3,-10 Q12,-6 12,6 Q8,14 -3,12 Q-12,6 -8,-5 Q-4,-10 3,-10" fill="#c2185b" opacity="0.85"/>
      <ellipse cx="0" cy="0" rx="5" ry="4.5" fill="#880e4f" opacity="0.9"/>
    </g>
    
    <g transform="translate(85, 125)" filter="url(#watercolor4)">
      <path d="M-4,-32 Q-24,-25 -32,-5 Q-32,20 -18,32 Q4,38 22,28 Q34,12 28,-10 Q18,-30 -4,-32" fill="#f8bbd0" opacity="0.75"/>
      <path d="M12,-28 Q30,-18 35,5 Q30,28 12,35 Q-10,32 -22,15 Q-25,-8 -8,-25 Q12,-28 12,-28" fill="#fce4ec" opacity="0.7"/>
      <path d="M-20,-12 Q-32,8 -25,28 Q-8,40 15,32 Q32,18 28,-5 Q18,-22 -5,-22 Q-20,-12 -20,-12" fill="#f48fb1" opacity="0.6"/>
      <path d="M0,-20 Q-15,-12 -18,5 Q-14,22 5,24 Q22,18 22,-2 Q15,-18 0,-20" fill="#ec407a" opacity="0.75"/>
      <path d="M2,-12 Q12,-8 14,5 Q10,16 -4,15 Q-14,8 -10,-5 Q-5,-12 2,-12" fill="#d81b60" opacity="0.8"/>
      <ellipse cx="0" cy="0" rx="4" ry="3.5" fill="#880e4f" opacity="0.85"/>
    </g>
    
    <g transform="translate(155, 85)" filter="url(#watercolor4)">
      <path d="M-3,-25 Q-18,-20 -24,-2 Q-22,18 -8,25 Q12,24 20,8 Q18,-12 -3,-25" fill="#fff8e1" opacity="0.8"/>
      <path d="M8,-22 Q22,-14 25,5 Q20,22 5,26 Q-12,22 -18,5 Q-14,-16 8,-22" fill="#ffecb3" opacity="0.75"/>
      <path d="M-14,-8 Q-22,8 -16,22 Q2,30 18,20 Q26,4 18,-12 Q4,-18 -14,-8" fill="#ffe082" opacity="0.65"/>
      <path d="M0,-14 Q-10,-8 -10,5 Q-6,16 6,15 Q14,8 12,-5 Q6,-14 0,-14" fill="#ffca28" opacity="0.7"/>
      <ellipse cx="0" cy="0" rx="4" ry="3.5" fill="#ff8f00" opacity="0.65"/>
    </g>
    
    <g filter="url(#watercolor4)">
      <path d="M110,160 Q92,155 85,170 Q88,188 108,192 Q128,185 130,168 Q122,155 110,160" fill="#81c784" opacity="0.8"/>
      <path d="M110,160 L100,180" stroke="#388e3c" strokeWidth="0.8" opacity="0.5"/>
      <path d="M165,135 Q180,130 188,145 Q185,165 168,170 Q150,162 150,145 Q155,132 165,135" fill="#a5d6a7" opacity="0.75"/>
      <path d="M165,135 L172,158" stroke="#2e7d32" strokeWidth="0.7" opacity="0.45"/>
      <path d="M120,100 Q105,108 108,125 Q120,138 138,130 Q148,115 138,100 Q128,95 120,100" fill="#66bb6a" opacity="0.7"/>
    </g>
    
    <g filter="url(#watercolor4)">
      <circle cx="130" cy="70" r="4.5" fill="#b3e5fc" opacity="0.75"/>
      <circle cx="130" cy="70" r="1.8" fill="#fff9c4" opacity="0.9"/>
      <circle cx="145" cy="62" r="4" fill="#bbdefb" opacity="0.7"/>
      <circle cx="145" cy="62" r="1.5" fill="#fff9c4" opacity="0.85"/>
    </g>
  </svg>
);

const BottomLeftFloral = () => (
  <svg viewBox="0 0 200 260" fill="none" style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.15))' }}>
    <defs>
      <filter id="watercolor5" x="-20%" y="-20%" width="140%" height="140%">
        <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise"/>
        <feDisplacementMap in="SourceGraphic" in2="noise" scale="3.5" xChannelSelector="R" yChannelSelector="G"/>
        <feGaussianBlur stdDeviation="0.4"/>
      </filter>
    </defs>
    
    <g transform="translate(65, 145)" filter="url(#watercolor5)">
      <path d="M0,-10 Q-8,-5 -10,4 Q-6,14 4,14 Q14,9 12,-2 Q7,-10 0,-10" fill="#90caf9" opacity="0.85"/>
      <ellipse cx="1" cy="2" rx="3" ry="2.5" fill="#fff9c4" opacity="0.9"/>
      <path d="M18,-6 Q12,0 12,10 Q16,20 26,17 Q34,10 30,0 Q24,-8 18,-6" fill="#64b5f6" opacity="0.8"/>
      <ellipse cx="22" cy="6" rx="2.5" ry="2" fill="#fff9c4" opacity="0.85"/>
      <path d="M10,16 Q4,22 8,32 Q16,40 26,34 Q34,26 28,16 Q20,12 10,16" fill="#90caf9" opacity="0.78"/>
      <ellipse cx="18" cy="25" rx="2.5" ry="2" fill="#fff9c4" opacity="0.85"/>
      <path d="M-16,10 Q-24,16 -20,28 Q-12,36 0,30 Q10,22 4,12 Q-6,6 -16,10" fill="#bbdefb" opacity="0.72"/>
      <ellipse cx="-8" cy="20" rx="2.2" ry="1.8" fill="#fff9c4" opacity="0.82"/>
      <path d="M-10,-16 Q-18,-10 -18,2 Q-12,12 0,8 Q10,2 6,-10 Q0,-18 -10,-16" fill="#64b5f6" opacity="0.78"/>
      <ellipse cx="-4" cy="-4" rx="2.2" ry="1.6" fill="#fff9c4" opacity="0.85"/>
      <path d="M-22,-4 Q-30,4 -26,16 Q-16,24 -4,18 Q6,10 0,0 Q-8,-8 -22,-4" fill="#90caf9" opacity="0.7"/>
      <ellipse cx="-12" cy="8" rx="2" ry="1.6" fill="#fff9c4" opacity="0.8"/>
    </g>
    
    <g transform="translate(90, 85)" filter="url(#watercolor5)">
      <path d="M-3,-22 Q-16,-16 -20,-2 Q-16,14 -2,20 Q14,18 18,4 Q16,-14 -3,-22" fill="#fce4ec" opacity="0.8"/>
      <path d="M6,-20 Q20,-12 22,5 Q16,20 2,24 Q-14,18 -18,4 Q-14,-16 6,-20" fill="#f8bbd0" opacity="0.75"/>
      <path d="M-12,-8 Q-20,6 -14,18 Q2,26 16,18 Q24,4 16,-10 Q4,-16 -12,-8" fill="#f48fb1" opacity="0.65"/>
      <path d="M0,-12 Q-10,-6 -10,5 Q-6,14 6,14 Q14,8 12,-4 Q6,-12 0,-12" fill="#ec407a" opacity="0.78"/>
      <path d="M2,-8 Q8,-4 8,5 Q4,12 -3,10 Q-10,5 -6,-4 Q-2,-8 2,-8" fill="#d81b60" opacity="0.82"/>
      <ellipse cx="0" cy="0" rx="3" ry="2.5" fill="#880e4f" opacity="0.85"/>
    </g>
    
    <g transform="translate(55, 200)" filter="url(#watercolor5)">
      <path d="M-2,-16 Q-12,-10 -14,2 Q-10,14 2,16 Q14,10 14,-2 Q8,-14 -2,-16" fill="#fff9c4" opacity="0.85"/>
      <path d="M0,-10 Q-7,-4 -7,5 Q-3,12 6,10 Q12,4 8,-5 Q3,-10 0,-10" fill="#ffecb3" opacity="0.8"/>
      <ellipse cx="0" cy="0" rx="4" ry="3.5" fill="#ffca28" opacity="0.75"/>
    </g>
    
    <g filter="url(#watercolor5)">
      <path d="M72,115 Q58,110 52,125 Q58,142 78,145 Q96,138 95,122 Q88,110 72,115" fill="#81c784" opacity="0.78"/>
      <path d="M72,115 L68,135" stroke="#388e3c" strokeWidth="0.7" opacity="0.5"/>
      <path d="M50,175 Q38,182 42,198 Q55,210 72,202 Q82,188 72,175 Q60,170 50,175" fill="#a5d6a7" opacity="0.72"/>
      <path d="M50,175 L58,195" stroke="#2e7d32" strokeWidth="0.6" opacity="0.45"/>
      <path d="M82,195 Q95,190 100,205 Q96,222 80,225 Q65,218 68,202 Q74,192 82,195" fill="#66bb6a" opacity="0.7"/>
    </g>
  </svg>
);

const FloralDecorations = () => {
  return (
    <>
      <FloralTopRight>
        <TopRightFloral />
      </FloralTopRight>
      <FloralTopLeft>
        <TopLeftFloral />
      </FloralTopLeft>
      <FloralBottomRight>
        <BottomRightFloral />
      </FloralBottomRight>
      <FloralBottomLeft>
        <BottomLeftFloral />
      </FloralBottomLeft>
    </>
  );
};

export default FloralDecorations;
