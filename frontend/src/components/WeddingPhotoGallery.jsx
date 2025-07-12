import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  CircularProgress,
  Alert
} from '@mui/material';

// Mock photos data
const mockPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    title: 'Happy Couple',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45',
    title: 'The Rings',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62',
    title: 'Ceremony',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f',
    title: 'Wedding Cake',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25',
    title: 'First Dance',
  },
   {
    id: 6,
    url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d',
    title: 'Bouquet',
  },
   {
    id: 7,
    url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8',
    title: 'Table Setting',
  },
   {
    id: 8,
    url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e',
    title: 'Dress Detail',
  },
];

// Define styles as constants
const styles = {
  outerContainer: {
    p: { xs: 2, md: 4 },
    backgroundColor: '#f9f9f7',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
    maxWidth: '1000px',
    mx: 'auto',
    mt: 4,
    mb: 4,
    textAlign: 'center',
    minHeight: (loading, error) => loading || error ? '300px' : 'auto',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: (loading, error) => loading || error ? 'center' : 'flex-start',
  },
  title: {
    mb: 2,
    fontFamily: "'Playfair Display', serif",
    fontWeight: 400,
    color: '#333',
  },
  introText: {
    mb: 4,
    color: '#555',
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1rem',
  },
  imageList: {
    width: '100%',
    borderRadius: '8px',
  },
  imageItem: {
    borderRadius: '4px',
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  loadingContainer: {
    textAlign: 'center'
  },
  loadingText: {
    mt: 2,
    color: '#666',
    fontFamily: "'Montserrat', sans-serif"
  },
  noPhotosText: {
    mt: 4,
    color: '#666',
    fontStyle: 'italic'
  }
};

export default function WeddingPhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      try {
        setPhotos(mockPhotos);
        setError(null);
      } catch (err) {
        console.error("Failed to load mock photos:", err);
        setError('Failed to load photos. Please try again.');
      } finally {
        setLoading(false);
      }
    }, 800);
  }, []);

  return (
    <Box sx={styles.outerContainer(loading, error)}>
      {loading ? (
        <Box sx={styles.loadingContainer}>
          <CircularProgress size={60} sx={{ color: '#a7a7a3' }} />
          <Typography sx={styles.loadingText}>
            Loading beautiful moments...
          </Typography>
        </Box>
      ) : error ? (
        <Alert severity="error" sx={{ width: '100%', maxWidth: '400px' }}>
          {error}
        </Alert>
      ) : (
        <>
          <Typography variant="h5" sx={styles.title}>
            Our Special Moments
          </Typography>

          <Typography variant="body1" sx={styles.introText}>
            Browse through some highlights from our journey and the wedding day!
          </Typography>

          {photos.length === 0 ? (
            <Typography sx={styles.noPhotosText}>
              No photos available yet.
            </Typography>
          ) : (
            <ImageList
              sx={styles.imageList}
              cols={3}
              rowHeight={180}
              gap={16}
            >
              {photos.map((photo) => (
                <ImageListItem key={photo.id}>
                  <img
                    srcSet={`${photo.url}?w=180&h=180&fit=crop&auto=format&dpr=2 2x`}
                    src={`${photo.url}?w=180&h=180&fit=crop&auto=format`}
                    alt={photo.title || `Wedding Photo ${photo.id}`}
                    loading="lazy"
                    style={styles.imageItem}
                  />
                </ImageListItem>
              ))}
            </ImageList>
          )}
        </>
      )}
    </Box>
  );
}
