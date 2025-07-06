import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  CircularProgress,
  Alert
} from '@mui/material';

export default function WeddingPhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // TODO: Replace with actual API call when backend is ready
  useEffect(() => {
    // Mock photos data - using 'url' field instead of 'img' to match component
    const mockPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&h=300&q=80',
    title: 'Couple Walking',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1587909339189-58d6e6820116?auto=format&fit=crop&w=400&h=300&q=80',
    title: 'Wedding Rings',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1598877369878-4660c0839551?auto=format&fit=crop&w=400&h=300&q=80',
    title: 'Ceremony Setup',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1605297335903-c731f23920d8?auto=format&fit=crop&w=400&h=300&q=80',
    title: 'Wedding Cake',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1592913680861-4350b5e3e570?auto=format&fit=crop&w=400&h=300&q=80',
    title: 'First Dance',
  },
   {
    id: 6,
    url: 'https://images.unsplash.com/photo-1518833387770-d7f64318f02e?auto=format&fit=crop&w=400&h=300&q=80',
    title: 'Bouquet',
  },
  {
    id: 7,
    url: 'https://images.unsplash.com/photo-1546019085-e6456f336a74?auto=format&fit=crop&w=400&h=300&q=80',
    title: 'Table Setting',
  },
   {
    id: 8,
    url: 'https://images.unsplash.com/photo-1562779010-e2de5211e24c?auto=format&fit=crop&w=400&h=300&q=80',
    title: 'Wedding Dress Details',
  },
   {
    id: 9,
    url: 'https://images.unsplash.com/photo-1596854100863-ed9958cf48b6?auto=format&fit=crop&w=400&h=300&q=80',
    title: 'Couple Kissing',
  },
];
    
    setTimeout(() => {
      setPhotos(mockPhotos);
      setLoading(false);
    }, 500); // Simulate network delay
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={2}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        p: { xs: 2, md: 4 },
        backgroundColor: '#f9f9f7',
        borderRadius: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
        maxWidth: '1000px',
        mx: 'auto',
        mt: 4,
        mb: 4,
        textAlign: 'center',
      }}
    >
      <Typography
        variant="h5"
        sx={{
          mb: 2,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400,
          color: '#333',
        }}
      >
        Our Special Moments
      </Typography>

      <Typography
        variant="body1"
        sx={{
          mb: 4,
          color: '#555',
          fontFamily: "'Montserrat', sans-serif",
          fontSize: '1rem',
        }}
      >
        Browse through some highlights from our journey and the wedding day!
      </Typography>

      <ImageList
        sx={{
          width: '100%',
          borderRadius: '8px',
        }}
        cols={3}
        rowHeight={180}
        gap={8}
      >
        {photos.map((photo) => (
          <ImageListItem key={photo.id}>
            <img
              srcSet={`${photo.url}?w=180&h=180&fit=crop&auto=format&dpr=2 2x`}
              src={`${photo.url}?w=180&h=180&fit=crop&auto=format`}
              alt={photo.title}
              loading="lazy"
              style={{ borderRadius: '4px' }}
            />
          </ImageListItem>
        ))}
      </ImageList>
    </Box>
  );
}
