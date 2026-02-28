import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  CircularProgress,
  Alert,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CloseIcon from '@mui/icons-material/Close';
import { useTranslation } from 'react-i18next';
import { useTheme } from '@mui/material/styles';
import BackButton from './BackButton';
import LanguageSwitcher from './LanguageSwitcher';
import WatercolorBackground from './WatercolorBackground';

const mockPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    title: 'Walking into Forever',
    caption: 'This moment captured the feeling of stepping into a new chapter together. The sun was setting, painting the sky in our favorite colors, and it felt like the world was just for us. A perfect start to our forever.',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'Symbols of Commitment',
    caption: 'Our rings, simple yet profound symbols of our vows. Placed next to the bouquet filled with blooms that held special meaning, this photo reminds us of the promises we made and the beauty of starting a life bound by love.',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'The Sacred Spot',
    caption: 'Where we officially became one. Surrounded by nature and our loved ones, this setup felt magical. Every detail, from the flowers to the view, made our ceremony feel deeply personal and incredibly special.',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Sweet Beginnings',
    caption: 'Our wedding cake, a delicious masterpiece! More than just dessert, cutting the cake felt like our first collaborative task as a married couple, a sweet tradition marking the start of our shared journey.',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'Our First Dance',
    caption: 'Lost in the music, lost in each other\'s eyes. The first dance was a whirlwind of emotions, a moment where nothing else mattered but holding each other close and celebrating the love that brought us here.',
  },
  {
    id: 6,
    url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Bridal Blooms',
    caption: 'The colors, the scents, the artistry - the bridal bouquet was stunning. It felt like carrying a piece of the garden with me, a fragrant reminder of the natural beauty surrounding our special day.',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Feast & Fellowship',
    caption: 'Detail from one of our reception tables. We wanted our guests to feel welcomed and cherished. The elegant setting, candles flickering, promised an evening of great food, laughter, and shared happiness.',
  },
  {
    id: 8,
    url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'The Dress Details',
    caption: 'A glimpse of the intricate lace and fabric of the wedding dress. Each stitch felt like part of the story, a garment chosen with love for a day filled with love. It truly felt like a dream to wear.',
  },
];

const OuterContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
  backgroundColor: 'transparent',
  borderRadius: '12px',
  maxWidth: '1000px',
  margin: '0 auto',
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  textAlign: 'center',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
}));

const GalleryTitle = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  fontFamily: "'Great Vibes', cursive",
  fontWeight: 400,
  color: theme.palette.wedding?.navy || '#2C3E6B',
  fontSize: '2.2rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '3rem',
  },
  letterSpacing: '0.03em',
}));

const IntroText = styled(Typography)(({ theme }) => ({
  marginBottom: theme.spacing(4),
  color: theme.palette.text?.secondary || '#5A5A5A',
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 300,
  fontSize: '0.95rem',
  [theme.breakpoints.up('md')]: {
    fontSize: '1.1rem',
  },
  maxWidth: '700px',
  lineHeight: 1.6,
  letterSpacing: '0.015em',
}));

const StyledImageList = styled(ImageList)({
  width: '100%',
  borderRadius: '8px',
  backgroundColor: 'transparent',
});

const StyledImageListItem = styled(ImageListItem)({
  cursor: 'pointer',
  overflow: 'hidden',
  borderRadius: '8px',
  transition: 'transform 0.3s ease-in-out, border-color 0.3s ease-in-out',
  border: '1px solid #E8D5A8',
  '&:hover': {
    transform: 'scale(1.03)',
    borderColor: '#C9A96E',
  },
  '& img': {
    transition: 'transform 0.3s ease-in-out',
  },
});

const GalleryImage = styled('img')({
  display: 'block',
  width: '100%',
  height: '100%',
  objectFit: 'cover',
});

const LoadingContainer = styled(Box)(({ theme }) => ({
  textAlign: 'center',
  paddingTop: theme.spacing(6),
  paddingBottom: theme.spacing(6),
}));

const StyledCircularProgress = styled(CircularProgress)({
  color: '#2C3E6B',
});

const LoadingText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(2),
  color: theme.palette.wedding?.navy || '#2C3E6B',
  fontFamily: "'Poppins', sans-serif",
  fontSize: '1rem',
}));

const NoPhotosText = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(4),
  color: '#757575',
  fontStyle: 'italic',
  fontSize: '1.1rem',
}));

const DialogImage = styled('img')({
  maxWidth: '100%',
  height: 'auto',
  maxHeight: '65vh',
  borderRadius: '8px',
  objectFit: 'contain',
  margin: '0 auto',
  display: 'block',
});

const DialogCaption = styled(Typography)(({ theme }) => ({
  marginTop: theme.spacing(3),
  color: theme.palette.wedding?.navy || '#2C3E6B',
  fontFamily: "'Poppins', sans-serif",
  fontWeight: 300,
  fontSize: '1rem',
  lineHeight: 1.7,
  textAlign: 'justify',
  paddingLeft: theme.spacing(1),
  paddingRight: theme.spacing(1),
  [theme.breakpoints.up('md')]: {
    paddingLeft: theme.spacing(3),
    paddingRight: theme.spacing(3),
  },
}));

const DialogTitleStyled = styled(DialogTitle)(({ theme }) => ({
  margin: 0,
  padding: theme.spacing(2),
  textAlign: 'center',
  fontFamily: "'Great Vibes', cursive",
  color: theme.palette.wedding?.navy || '#2C3E6B',
  fontWeight: 400,
  fontSize: '28px',
}));

const StyledErrorAlert = styled(Alert)({
  width: '100%',
  maxWidth: '400px',
});

const LanguageSwitcherPositioner = styled(Box)({
  position: 'absolute',
  top: 16,
  right: 16,
  zIndex: 1000,
});

const StyledDialogPaper = styled(Box)({
  borderRadius: '12px',
  overflowY: 'visible',
  border: '1px solid #E8D5A8',
  boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
});

const CloseIconButton = styled(IconButton)(({ theme }) => ({
  position: 'absolute',
  right: 8,
  top: 8,
  color: theme.palette.grey[500],
}));

const DialogContentStyled = styled(DialogContent)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('md')]: {
    padding: theme.spacing(4),
  },
}));

const DialogContentInner = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
});

export default function WeddingPhotoGallery() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { t } = useTranslation();

  useEffect(() => {
    setTimeout(() => {
      try {
        setPhotos(mockPhotos);
        setError(null);
      } catch (err) {
        console.error("Failed to load mock photos:", err);
        setError(t('gallery.loadError') || 'Failed to load photos. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  return (
    <>
      <WatercolorBackground />
      <OuterContainer
        style={{
          minHeight: loading || error ? '300px' : 'auto',
          justifyContent: loading || error ? 'center' : 'flex-start'
        }}
      >
        {loading && (
          <LoadingContainer>
            <StyledCircularProgress size={60} />
            <LoadingText>
              {t('gallery.loading')}
            </LoadingText>
          </LoadingContainer>
        )}

        {error && !loading && (
          <StyledErrorAlert severity="error">
            {error}
          </StyledErrorAlert>
        )}

        {!loading && !error && (
          <>
            <LanguageSwitcherPositioner>
              <LanguageSwitcher />
            </LanguageSwitcherPositioner>
            <BackButton />
            <GalleryTitle variant="h4" component="h2">
              {t('gallery.title')}
            </GalleryTitle>

            <IntroText variant="body1">
              {t('gallery.subtitle')}
            </IntroText>

            {photos.length === 0 ? (
              <NoPhotosText>
                {t('gallery.noPhotos')}
              </NoPhotosText>
            ) : (
              <StyledImageList
                cols={isMobile ? 1 : isTablet ? 2 : 3}
                rowHeight={isMobile ? 250 : 200}
                gap={20}
              >
                {photos.map((photo) => (
                  <StyledImageListItem
                    key={photo.id}
                    onClick={() => handlePhotoClick(photo)}
                  >
                    <GalleryImage
                      src={`${photo.url}?w=300&h=300&fit=crop&auto=format`}
                      srcSet={`${photo.url}?w=300&h=300&fit=crop&auto=format&dpr=2 2x`}
                      alt={photo.title || `Wedding Photo ${photo.id}`}
                      loading="lazy"
                    />
                  </StyledImageListItem>
                ))}
              </StyledImageList>
            )}
          </>
        )}

        <Dialog
          open={isModalOpen}
          onClose={handleCloseModal}
          maxWidth="md"
          fullWidth
          TransitionProps={{
            timeout: 300
          }}
          PaperProps={{
            component: StyledDialogPaper,
          }}
        >
          {selectedPhoto && (
            <>
              <DialogTitleStyled>
                {selectedPhoto.title}
                <CloseIconButton
                  aria-label="close"
                  onClick={handleCloseModal}
                >
                  <CloseIcon />
                </CloseIconButton>
              </DialogTitleStyled>
              <DialogContentStyled dividers>
                <DialogContentInner>
                  <DialogImage
                    src={selectedPhoto.url}
                    alt={selectedPhoto.title || `Wedding Photo ${selectedPhoto.id}`}
                  />
                  <DialogCaption variant="body1" component="p">
                    {selectedPhoto.caption}
                  </DialogCaption>
                </DialogContentInner>
              </DialogContentStyled>
            </>
          )}
        </Dialog>
      </OuterContainer>
    </>
  );
}
