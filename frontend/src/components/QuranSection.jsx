import { Box, Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const SectionContainer = styled(Box)({
  padding: '60px 30px',
  textAlign: 'center',
  maxWidth: '520px',
  margin: '0 auto',
});

const LeafIcon = styled(Box)({
  fontSize: '36px',
  marginBottom: '20px',
  filter: 'hue-rotate(60deg)',
});

const VerseText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Cormorant Garamond', serif",
  fontSize: '15px',
  fontStyle: 'italic',
  lineHeight: 1.8,
  color: theme.palette.text?.secondary || '#5A5A5A',
  maxWidth: '400px',
  margin: '0 auto 20px',
}));

const GoldDivider = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  margin: '20px auto',
  '& .line': {
    width: '60px',
    height: '0.5px',
    background: `linear-gradient(to right, transparent, ${theme.palette.wedding?.gold || '#C9A96E'}, transparent)`,
  },
  '& .dot': {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: theme.palette.wedding?.gold || '#C9A96E',
    margin: '0 10px',
  },
}));

const ReferenceText = styled(Typography)(({ theme }) => ({
  fontFamily: "'Poppins', sans-serif",
  fontSize: '12px',
  fontWeight: 500,
  color: theme.palette.wedding?.gold || '#C9A96E',
}));

export default function QuranSection() {
  const { t } = useTranslation();

  return (
    <SectionContainer>
      <LeafIcon>🍃</LeafIcon>
      <VerseText>{t('quran.verse')}</VerseText>
      <GoldDivider>
        <Box className="line" />
        <Box className="dot" />
        <Box className="line" />
      </GoldDivider>
      <ReferenceText>{t('quran.reference')}</ReferenceText>
    </SectionContainer>
  );
}
