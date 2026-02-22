import { Box, Typography, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const SectionContainer = styled(Box)({
  padding: '60px 30px',
  textAlign: 'center',
  maxWidth: '520px',
  margin: '0 auto',
});

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '40px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginBottom: '40px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
  },
}));

const PhotoCircle = styled(Box)(({ theme }) => ({
  width: '130px',
  height: '130px',
  borderRadius: '50%',
  border: `2px solid ${theme.palette.wedding?.gold || '#C9A96E'}`,
  background: `linear-gradient(135deg, ${theme.palette.wedding?.sky || '#B8CDE8'}, ${theme.palette.wedding?.blush || '#F0E0D0'})`,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '50px',
  margin: '0 auto 16px',
}));

const PersonName = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '13px',
  fontWeight: 600,
  color: theme.palette.wedding?.navy || '#2C3E6B',
  textTransform: 'uppercase',
  letterSpacing: '2px',
  marginBottom: '8px',
}));

const ParentLabel = styled(Typography)({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '10px',
  color: '#5A5A5A',
  marginBottom: '4px',
});

const ParentName = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '14px',
  color: theme.palette.text?.primary || '#3A3A3A',
  lineHeight: 1.4,
}));

const Ampersand = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '48px',
  color: theme.palette.wedding?.gold || '#C9A96E',
  margin: '16px 0',
}));

export default function CoupleSection() {
  const { t } = useTranslation();

  const brideName = import.meta.env.VITE_BRIDE_NAME || 'Bride Name';
  const groomName = import.meta.env.VITE_GROOM_NAME || 'Groom Name';
  const brideFather = import.meta.env.VITE_BRIDE_FATHER || 'Father';
  const brideMother = import.meta.env.VITE_BRIDE_MOTHER || 'Mother';
  const groomFather = import.meta.env.VITE_GROOM_FATHER || 'Father';
  const groomMother = import.meta.env.VITE_GROOM_MOTHER || 'Mother';

  return (
    <SectionContainer>
      <SectionTitle>{t('couple.sectionTitle')}</SectionTitle>

      <Box sx={{ mb: 2 }}>
        <PhotoCircle>👩</PhotoCircle>
        <PersonName>{brideName.toUpperCase()}</PersonName>
        <ParentLabel>{t('couple.brideLabel')}</ParentLabel>
        <ParentName>{brideFather}</ParentName>
        <ParentName>&</ParentName>
        <ParentName>{brideMother}</ParentName>
      </Box>

      <Ampersand>&</Ampersand>

      <Box sx={{ mt: 2 }}>
        <PhotoCircle>👨</PhotoCircle>
        <PersonName>{groomName.toUpperCase()}</PersonName>
        <ParentLabel>{t('couple.groomLabel')}</ParentLabel>
        <ParentName>{groomFather}</ParentName>
        <ParentName>&</ParentName>
        <ParentName>{groomMother}</ParentName>
      </Box>
    </SectionContainer>
  );
}
