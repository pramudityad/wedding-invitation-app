import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

const ArtworkContainer = styled(Box)(({ theme }) => ({
  width: '100%',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  marginBottom: theme.spacing(4),
  animation: 'fadeIn 1.8s ease-out 0.9s both',
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'scale(0.95)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
}));

const ArtworkImage = styled('img')(({ theme }) => ({
  width: '85%',
  maxWidth: '320px',
  height: 'auto',
  borderRadius: '50% 50% 0 0',
  boxShadow: '0 8px 32px rgba(107, 93, 84, 0.15)',
  [theme.breakpoints.up('md')]: {
    maxWidth: '380px',
  },
  [theme.breakpoints.down('sm')]: {
    width: '90%',
    maxWidth: '280px',
  },
}));

function CoupleArtwork() {
  const { t } = useTranslation();
  
  return (
    <ArtworkContainer>
      <ArtworkImage 
        src="/images/couple-art.png" 
        alt={t('invitation.coupleArtAlt', 'Wedding couple illustration')}
        loading="eager"
      />
    </ArtworkContainer>
  );
}

export default CoupleArtwork;
