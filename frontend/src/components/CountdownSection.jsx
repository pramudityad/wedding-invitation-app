import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';

const SectionContainer = styled(Box)({
  padding: '60px 30px',
  textAlign: 'center',
  maxWidth: '520px',
  margin: '0 auto',
});

const Title = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '40px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  lineHeight: 1.1,
  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
  },
}));

const Subtitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '32px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginBottom: '16px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '26px',
  },
}));

const RibbonIcon = styled(Box)({
  fontSize: '50px',
  marginBottom: '24px',
});

const TimerContainer = styled(Box)({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '8px',
});

const TimeUnit = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  minWidth: '50px',
});

const TimeNumber = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '36px',
  fontWeight: 600,
  color: theme.palette.wedding?.navy || '#2C3E6B',
  lineHeight: 1,
}));

const TimeLabel = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '10px',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  color: '#5A5A5A',
  marginTop: '4px',
});

const Separator = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '28px',
  color: theme.palette.wedding?.gold || '#C9A96E',
  lineHeight: 1,
  alignSelf: 'flex-start',
  marginTop: '4px',
}));

export default function CountdownSection() {
  const { t } = useTranslation();
  const weddingDate = import.meta.env.VITE_APP_WEDDING_DATE;

  const calculateTimeLeft = () => {
    if (!weddingDate) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    const diff = new Date(weddingDate).getTime() - Date.now();
    if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    return {
      days: Math.floor(diff / (1000 * 60 * 60 * 24)),
      hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((diff / (1000 * 60)) % 60),
      seconds: Math.floor((diff / 1000) % 60),
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pad = (n) => String(n).padStart(2, '0');

  return (
    <SectionContainer>
      <Title>{t('countdown.title')}</Title>
      <Subtitle>{t('countdown.subtitle')}</Subtitle>
      <RibbonIcon>🎀</RibbonIcon>
      <TimerContainer>
        <TimeUnit>
          <TimeNumber>{pad(timeLeft.days)}</TimeNumber>
          <TimeLabel>{t('countdown.days')}</TimeLabel>
        </TimeUnit>
        <Separator>:</Separator>
        <TimeUnit>
          <TimeNumber>{pad(timeLeft.hours)}</TimeNumber>
          <TimeLabel>{t('countdown.hours')}</TimeLabel>
        </TimeUnit>
        <Separator>:</Separator>
        <TimeUnit>
          <TimeNumber>{pad(timeLeft.minutes)}</TimeNumber>
          <TimeLabel>{t('countdown.minutes')}</TimeLabel>
        </TimeUnit>
        <Separator>:</Separator>
        <TimeUnit>
          <TimeNumber>{pad(timeLeft.seconds)}</TimeNumber>
          <TimeLabel>{t('countdown.seconds')}</TimeLabel>
        </TimeUnit>
      </TimerContainer>
    </SectionContainer>
  );
}
