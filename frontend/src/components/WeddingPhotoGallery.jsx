import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  CircularProgress,
  Alert
} from '@mui/material';

// --- Mock Photos Data ---
// Using base Unsplash URLs that support sizing/cropping parameters.
// In a real application, this data would come from your backend API.
const mockPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', // Couple walking
    title: 'Happy Couple',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45', // Rings and bouquet
    title: 'The Rings',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62', // Ceremony setup
    title: 'Ceremony',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f', // Wedding cake with flowers
    title: 'Wedding Cake',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25', // First dance
    title: 'First Dance',
  },
   {
    id: 6,
    url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d', // Bouquet close-up
    title: 'Bouquet',
  },
   {
    id: 7,
    url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8', // Table setting (from original mock)
    title: 'Table Setting',
  },
   {
    id: 8,
    url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', // Dress details (from original mock)
    title: 'Dress Detail',
  },
];

export default function WeddingPhotoGallery() {
  // State to hold the fetched photos
  const [photos, setPhotos] = useState([]);
  // State to manage loading status
  const [loading, setLoading] = useState(true);
  // State to manage error messages
  const [error, setError] = useState(null);

  // Effect to simulate fetching photos on component mount
  useEffect(() => {
    // In a real app, replace this setTimeout with your actual API call
    // Example: const fetchPhotos = async () => { try { const response = await getPhotos(); setPhotos(response.data); ... } }; fetchPhotos();
    setTimeout(() => {
      try {
         // Simulate potential error for testing: uncomment the next line
        // throw new Error("Failed to load photos");
        setPhotos(mockPhotos); // Set the mock data to the state
        setError(null); // Clear any previous errors
      } catch (err) {
         console.error("Failed to load mock photos:", err);
         setError('Failed to load photos. Please try again.'); // Set error message
      } finally {
         setLoading(false); // Set loading to false whether successful or not
      }
    }, 800); // Simulate network delay of 800ms
  }, []); // Empty dependency array means this effect runs once on mount

  // Render different content based on loading and error states
  return (
    // Outer Box: Container for the gallery section with elegant styling
    <Box
      sx={{
        p: { xs: 2, md: 4 }, // Responsive padding
        backgroundColor: '#f9f9f7', // Soft background consistent with other components
        borderRadius: '12px', // Rounded corners
        boxShadow: '0 4px 12px rgba(0,0,0,0.1)', // Softer, more prominent shadow
        maxWidth: '1000px', // Max width for the gallery container
        mx: 'auto', // Center the box horizontally
        mt: 4, // Margin top for spacing
        mb: 4, // Margin bottom
        textAlign: 'center', // Center the title and intro text
        minHeight: loading || error ? '300px' : 'auto', // Give container minimum height when loading/error
        display: 'flex', // Use flexbox for centering loading/error
        flexDirection: 'column', // Stack children vertically
        alignItems: 'center', // Center items horizontally
        justifyContent: loading || error ? 'center' : 'flex-start', // Center vertically when loading/error
      }}
    >
      {/* Conditional Rendering: Show loading, error, or content */}
      {loading ? (
        // Loading state display
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={60} sx={{ color: '#a7a7a3' }} /> {/* Elegant spinner color */}
          <Typography sx={{ mt: 2, color: '#666', fontFamily: "'Montserrat', sans-serif" }}>
            Loading beautiful moments...
          </Typography>
        </Box>
      ) : error ? (
        // Error state display
        <Alert severity="error" sx={{ width: '100%', maxWidth: '400px' }}> {/* Constrain alert width */}
          {error}
        </Alert>
      ) : (
        // Content state: Show title, intro, and photo grid
        <>
          {/* Title */}
          <Typography
            variant="h5" // Header variant
            sx={{
              mb: 2, // Margin bottom
              fontFamily: "'Playfair Display', serif", // Elegant font
              fontWeight: 400, // Font weight
              color: '#333', // Text color
            }}
          >
            Our Special Moments
          </Typography>

           {/* Optional: Introductory Text */}
           <Typography
             variant="body1"
             sx={{
               mb: 4, // Margin below text
               color: '#555', // Text color
               fontFamily: "'Montserrat', sans-serif", // Body font
               fontSize: '1rem',
             }}
           >
             Browse through some highlights from our journey and the wedding day!
           </Typography>

           {/* Check if there are photos to display */}
           {photos.length === 0 ? (
               <Typography sx={{ mt: 4, color: '#666', fontStyle: 'italic' }}>
                   No photos available yet.
               </Typography>
           ) : (
              // ImageList Component: Grid for photos
              <ImageList
                sx={{
                  width: '100%', // Take full width of parent container
                  // If you want a scrollable section with a fixed height:
                  // height: 450,
                  // overflowY: 'auto',
                  borderRadius: '8px', // Rounded corners for the list container
                  // Optional: add a border to the list container
                  // border: '1px solid #e0e0e0',
                }}
                cols={3} // Number of columns
                // Make columns responsive
                // cols={{ xs: 2, sm: 3, md: 4 }}
                rowHeight={180} // Height of each row
                gap={16} // Increased gap between images for more separation
              >
                {/* Mapping through photos data to render each image */}
                {photos.map((photo) => (
                  // ImageListItem: Container for a single image item
                  <ImageListItem key={photo.id}>
                    {/* The Image Element */}
                    <img
                      // srcSet for responsive image loading based on device pixel ratio
                      // Appending parameters for sizing/cropping
                      srcSet={`${photo.url}?w=180&h=180&fit=crop&auto=format&dpr=2 2x`}
                      // src for standard loading
                      src={`${photo.url}?w=180&h=180&fit=crop&auto=format`}
                      alt={photo.title || `Wedding Photo ${photo.id}`} // Alt text, fallback if title missing
                      loading="lazy" // Lazy loading for performance
                      style={{
                         borderRadius: '4px', // Optional: subtle rounded corners on individual images
                         display: 'block', // Ensure image is block level
                         width: '100%', // Make image take full width of parent
                         height: '100%', // Make image take full height of parent
                         objectFit: 'cover', // CRUCIAL: Crop image to cover the item area without distortion
                      }}
                    />
                     {/* Optional: Overlay or Info (e.g., likes, captions on hover) */}
                     {/* Add ImageListItemBar here if you need overlays */}
                  </ImageListItem>
                ))}
              </ImageList>
           )}
        </>
      )}
       {/* Optional: Button to view more photos if this is a limited selection */}
       {/* Consider adding this outside the conditional rendering for photos */}
       {/*
       {!loading && !error && photos.length > 0 && (
         <Button variant="outlined" sx={{ mt: 4, borderRadius: '8px' }}>
             View More Photos
         </Button>
       )}
       */}
    </Box>
  );
}
