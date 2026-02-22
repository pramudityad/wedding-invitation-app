import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const SectionContainer = styled(Box)({
  padding: '60px 30px',
  textAlign: 'center',
  maxWidth: '520px',
  margin: '0 auto',
});

const BismillahText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontStyle: 'italic',
  fontSize: '16px',
  color: theme.palette.text?.secondary || '#5A5A5A',
  marginBottom: '16px',
}));

const IntroText = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '13px',
  color: '#5A5A5A',
  marginBottom: '24px',
  lineHeight: 1.6,
});

const RingIcon = styled(Box)({
  fontSize: '40px',
  marginBottom: '16px',
});

const DateText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '36px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginBottom: '24px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '28px',
  },
}));

const TimeBlock = styled(Box)(({ theme }) => ({
  marginBottom: '12px',
  '& .label': {
    fontFamily: "'Poppins', sans-serif",
    fontSize: '11px',
    letterSpacing: '3px',
    textTransform: 'uppercase',
    color: theme.palette.wedding?.gold || '#C9A96E',
    fontWeight: 500,
    marginBottom: '4px',
  },
  '& .time': {
    fontFamily: "'Cormorant Garamond', serif",
    fontSize: '18px',
    color: theme.palette.text?.primary || '#3A3A3A',
  },
}));

const VenueText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '14px',
  fontWeight: 600,
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginTop: '20px',
  marginBottom: '20px',
}));

const MapButton = styled(Button)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '11px',
  letterSpacing: '2px',
  textTransform: 'uppercase',
  padding: '10px 28px',
  border: `1.5px solid ${theme.palette.wedding?.navy || '#2C3E6B'}`,
  color: theme.palette.wedding?.navy || '#2C3E6B',
  borderRadius: 0,
  transition: 'all 0.3s ease',
  '&:hover': {
    background: theme.palette.wedding?.navy || '#2C3E6B',
    color: '#FFFFFF',
  },
}));

export default function EventSection() {
  const { t } = useTranslation();

  const weddingDate = import.meta.env.VITE_APP_WEDDING_DATE;
  const akadTime = import.meta.env.VITE_WEDDING_AKAD_TIME || '08.00 - 10.00 WIB';
  const resepsiTime = import.meta.env.VITE_WEDDING_RESEPSI_TIME || '11.00 - 13.00 WIB';
  const venue = import.meta.env.VITE_WEDDING_VENUE || 'Wedding Venue';
  const mapsUrl = import.meta.env.VITE_VENUE_MAPS_URL || '#';

  const formattedDate = weddingDate
    ? new Date(weddingDate).toLocaleDateString('id-ID', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : 'Wedding Date';

  return (
    <SectionContainer>
      <BismillahText>{t('event.bismillah')}</BismillahText>
      <IntroText>{t('event.intro')}</IntroText>
      <RingIcon>💍</RingIcon>
      <DateText>{formattedDate}</DateText>

      <TimeBlock>
        <Typography className="label">{t('event.akadLabel')}</Typography>
        <Typography className="time">{akadTime}</Typography>
      </TimeBlock>

      <TimeBlock>
        <Typography className="label">{t('event.resepsiLabel')}</Typography>
        <Typography className="time">{resepsiTime}</Typography>
      </TimeBlock>

      <VenueText>{venue}</VenueText>

      <MapButton
        component="a"
        href={mapsUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {t('event.openMap')}
      </MapButton>
    </SectionContainer>
  );
}
