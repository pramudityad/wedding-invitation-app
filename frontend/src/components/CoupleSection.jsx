import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "'Great Vibes', cursive",
  fontSize: '40px',
  color: theme.palette.wedding?.navy || '#2C3E6B',
  marginBottom: '40px',
  [theme.breakpoints.down('sm')]: {
    fontSize: '32px',
  },
}));

const PhotoImage = styled('img')(({ theme }) => ({
  width: '130px',
  height: '130px',
  borderRadius: '50%',
  border: `2px solid ${theme.palette.wedding?.gold || '#C9A96E'}`,
  objectFit: 'cover',
  margin: '0 auto 16px',
  display: 'block',
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

const ParentLabel = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '10px',
  color: theme.palette.text?.secondary || '#5A5A5A',
  marginBottom: '4px',
}));

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

const SpacedBox = styled(Box)(({ theme }) => ({
  marginBottom: theme.spacing(2),
}));

const SpacedBoxTop = styled(Box)(({ theme }) => ({
  marginTop: theme.spacing(2),
}));

const CoupleSectionContainer = styled(Box)({
  position: 'relative',
  padding: '60px 30px',
  textAlign: 'center',
  maxWidth: '520px',
  margin: '0 auto',
});

const LeafLeft = styled('img')(({ theme }) => ({
  position: 'absolute',
  left: 0,
  top: '20%',
  width: '80px',
  height: 'auto',
  opacity: 0.7,
  transform: 'rotate(-15deg)',
  pointerEvents: 'none',
  animation: 'fadeIn 0.8s ease-out',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 0.7 },
  },
  [theme.breakpoints.down('sm')]: {
    width: '60px',
  },
}));

const LeafRight = styled('img')(({ theme }) => ({
  position: 'absolute',
  right: 0,
  bottom: '20%',
  width: '80px',
  height: 'auto',
  opacity: 0.7,
  transform: 'rotate(165deg)',
  pointerEvents: 'none',
  animation: 'fadeIn 0.8s ease-out',
  '@keyframes fadeIn': {
    from: { opacity: 0 },
    to: { opacity: 0.7 },
  },
  [theme.breakpoints.down('sm')]: {
    width: '60px',
  },
}));

export default function CoupleSection() {
  const { t } = useTranslation();

  const brideName = import.meta.env.VITE_BRIDE_NAME || 'Bride Name';
  const groomName = import.meta.env.VITE_GROOM_NAME || 'Groom Name';
  const brideFather = import.meta.env.VITE_BRIDE_FATHER || 'Father';
  const brideMother = import.meta.env.VITE_BRIDE_MOTHER || 'Mother';
  const groomFather = import.meta.env.VITE_GROOM_FATHER || 'Father';
  const groomMother = import.meta.env.VITE_GROOM_MOTHER || 'Mother';

  const disableGallery = import.meta.env.VITE_DISABLE_GALLERY === 'true';
  const bridePhoto = disableGallery ? '/images/bride-placeholder.svg' : '/images/bride_real.webp';
  const groomPhoto = disableGallery ? '/images/groom-placeholder.svg' : '/images/groom_real.webp';

  return (
    <CoupleSectionContainer>
      <LeafLeft src="/images/asset/leaf-2.webp" alt="" />
      <LeafRight src="/images/asset/leaf-3.webp" alt="" />
      <SectionTitle>{t('couple.sectionTitle')}</SectionTitle>

      <SpacedBox>
        <PhotoImage src={bridePhoto} alt="Bride" />
        <PersonName>{brideName.toUpperCase()}</PersonName>
        <ParentLabel>{t('couple.brideLabel')}</ParentLabel>
        <ParentName>{brideFather}</ParentName>
        <ParentName>&</ParentName>
        <ParentName>{brideMother}</ParentName>
      </SpacedBox>

      <Ampersand>&</Ampersand>

      <SpacedBoxTop>
        <PhotoImage src={groomPhoto} alt="Groom" />
        <PersonName>{groomName.toUpperCase()}</PersonName>
        <ParentLabel>{t('couple.groomLabel')}</ParentLabel>
        <ParentName>{groomFather}</ParentName>
        <ParentName>&</ParentName>
        <ParentName>{groomMother}</ParentName>
      </SpacedBoxTop>
    </CoupleSectionContainer>
  );
}
