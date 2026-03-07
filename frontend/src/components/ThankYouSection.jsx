import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const SectionContainer = styled(Box)({
  padding: '60px 30px 80px',
  textAlign: 'center',
  maxWidth: '520px',
  margin: '0 auto',
});

const Title = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '44px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginBottom: '20px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '36px',
  },
}));

const Message = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '13px',
  color: '#5A5A5A',
  lineHeight: 1.8,
  maxWidth: '380px',
  margin: '0 auto 24px',
});

const Tagline = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '16px',
  fontStyle: 'italic',
  color: theme.palette.wedding?.gold || '#C9A96E',
  marginBottom: '32px',
}));

const CoupleImage = styled('img')({
  width: '280px',
  height: 'auto',
  marginBottom: '16px',
  objectFit: 'cover',
});

const CoupleNames = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '38px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  [theme.breakpoints.down('sm')]: {
    fontSize: '30px',
  },
}));

export default function ThankYouSection() {
  const { t } = useTranslation();

  const groomShort = import.meta.env.VITE_GROOM_SHORT_NAME || 'Groom';
  const brideShort = import.meta.env.VITE_BRIDE_SHORT_NAME || 'Bride';

  return (
    <SectionContainer>
      <Title>{t('thankyou.title')}</Title>
      <Message>{t('thankyou.message')}</Message>
      <Tagline>{t('thankyou.tagline')}</Tagline>
      <CoupleImage src="/images/bride-groom.png" alt="Couple" />
      <CoupleNames>{groomShort} & {brideShort}</CoupleNames>
    </SectionContainer>
  );
}
