import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  ImageList,
  ImageListItem,
  CircularProgress,
  Alert,
  Dialog, // Import Dialog
  DialogContent, // Import DialogContent
  DialogTitle, // Import DialogTitle
  IconButton, // Import IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close'; // Import an icon for closing the dialog

// Mock photos data with captions/stories
const mockPhotos = [
  {
    id: 1,
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87', // Couple walking
    title: 'Walking into Forever',
    caption: 'This moment captured the feeling of stepping into a new chapter together. The sun was setting, painting the sky in our favorite colors, and it felt like the world was just for us. A perfect start to our forever.',
  },
  {
    id: 2,
    url: 'https://images.unsplash.com/photo-1522770179533-24471fcdba45', // Rings and bouquet
    title: 'Symbols of Commitment',
    caption: 'Our rings, simple yet profound symbols of our vows. Placed next to the bouquet filled with blooms that held special meaning, this photo reminds us of the promises we made and the beauty of starting a life bound by love.',
  },
  {
    id: 3,
    url: 'https://images.unsplash.com/photo-1558642452-9d2a7deb7f62', // Ceremony setup
    title: 'The Sacred Spot',
    caption: 'Where we officially became one. Surrounded by nature and our loved ones, this setup felt magical. Every detail, from the flowers to the view, made our ceremony feel deeply personal and incredibly special.',
  },
  {
    id: 4,
    url: 'https://images.unsplash.com/photo-1518756131217-31eb79b20e8f', // Wedding cake with flowers
    title: 'Sweet Beginnings',
    caption: 'Our wedding cake, a delicious masterpiece! More than just dessert, cutting the cake felt like our first collaborative task as a married couple, a sweet tradition marking the start of our shared journey.',
  },
  {
    id: 5,
    url: 'https://images.unsplash.com/photo-1597645587822-e99fa5d45d25', // First dance
    title: 'Our First Dance',
    caption: 'Lost in the music, lost in each other\'s eyes. The first dance was a whirlwind of emotions, a moment where nothing else mattered but holding each other close and celebrating the love that brought us here.',
  },
   {
    id: 6,
    url: 'https://images.unsplash.com/photo-1551782450-a2132b4ba21d', // Bouquet close-up
    title: 'Bridal Blooms',
    caption: 'The colors, the scents, the artistry - the bridal bouquet was stunning. It felt like carrying a piece of the garden with me, a fragrant reminder of the natural beauty surrounding our special day.',
  },
   {
    id: 7,
    url: 'https://images.unsplash.com/photo-1533827432537-70133748f5c8', // Table setting (from original mock)
    title: 'Feast & Fellowship',
    caption: 'Detail from one of our reception tables. We wanted our guests to feel welcomed and cherished. The elegant setting, candles flickering, promised an evening of great food, laughter, and shared happiness.',
  },
   {
    id: 8,
    url: 'https://images.unsplash.com/photo-1551963831-b3b1ca40c98e', // Dress details (from original mock)
    title: 'The Dress Details',
    caption: 'A glimpse of the intricate lace and fabric of the wedding dress. Each stitch felt like part of the story, a garment chosen with love for a day filled with love. It truly felt like a dream to wear.',
  },
];

// Define styles as constants (slightly updated for better appearance and hover effects)
const styles = {
  outerContainer: {
    p: { xs: 2, md: 4 },
    backgroundColor: '#ffffff', // Using white for a cleaner look
    borderRadius: '12px',
    boxShadow: '0 6px 16px rgba(0,0,0,0.15)', // Slightly stronger shadow
    maxWidth: '1000px',
    mx: 'auto',
    mt: 4,
    mb: 4,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    border: '1px solid #eee', // Subtle border
  },
  title: {
    mb: 2,
    fontFamily: "'Playfair Display', serif",
    fontWeight: 700, // Bolder title
    color: '#4a148c', // A deep purple accent color
    fontSize: { xs: '1.8rem', md: '2.5rem' } // Responsive font size
  },
  introText: {
    mb: 4,
    color: '#5a5a5a', // Slightly darker grey for readability
    fontFamily: "'Montserrat', sans-serif",
    fontSize: { xs: '0.95rem', md: '1.1rem' }, // Responsive font size
    maxWidth: '700px',
    lineHeight: 1.6,
  },
  imageList: {
    width: '100%',
    borderRadius: '8px',
    // Adding a subtle background or border to the image list if needed,
    // but keeping it simple works well too.
  },
  imageListItem: {
    cursor: 'pointer', // Indicate clickability
    overflow: 'hidden', // Hide overflow from scale transformation
    borderRadius: '8px', // Rounded corners for list items
    boxShadow: '0 2px 5px rgba(0,0,0,0.08)', // Small shadow per image
    transition: 'transform 0.3s ease-in-out', // Smooth transition for hover
    '&:hover': {
      transform: 'scale(1.03)', // Slight zoom on hover
      boxShadow: '0 5px 15px rgba(0,0,0,0.15)', // Enhance shadow on hover
    },
    // Target the img element inside for transition
    '& img': {
      transition: 'transform 0.3s ease-in-out',
    },
    // Example if you wanted hover zoom on image specifically
    // '&:hover img': {
    //   transform: 'scale(1.05)',
    // },
  },
  imageItem: {
    display: 'block',
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  },
  loadingContainer: {
    textAlign: 'center',
    py: 6, // Padding top/bottom
  },
  loadingText: {
    mt: 2,
    color: '#757575', // Muted grey
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1rem',
  },
  noPhotosText: {
    mt: 4,
    color: '#757575',
    fontStyle: 'italic',
    fontSize: '1.1rem',
  },
  dialogImage: {
    maxWidth: '100%',
    height: 'auto',
    maxHeight: '65vh', // Limit maximum height in the dialog
    borderRadius: '8px',
    objectFit: 'contain', // Ensure the whole image is visible
    margin: '0 auto', // Center the image
    display: 'block', // Required for auto margins
  },
  dialogCaption: {
    mt: 3,
    color: '#4a4a4a', // Darker grey for caption readability
    fontFamily: "'Montserrat', sans-serif",
    fontSize: '1rem',
    lineHeight: 1.7, // Increased line height for long text
    textAlign: 'justify', // Justify text for a block look (optional, can be 'left')
    px: { xs: 1, md: 3 } // Horizontal padding for caption inside dialog
  }
};

export default function WeddingPhotoGallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // State for the dialog
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Simulate fetching data
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
    }, 800); // Simulate network delay
  }, []);

  // Handlers for the dialog
  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null); // Clear selected photo state on close
  };

  return (
    <Box
      sx={{
        ...styles.outerContainer,
        minHeight: loading || error ? '300px' : 'auto',
        justifyContent: loading || error ? 'center' : 'flex-start'
      }}
    >
      {/* Loading State */}
      {loading && (
        <Box sx={styles.loadingContainer}>
          <CircularProgress size={60} sx={{ color: styles.title.color }} /> {/* Use accent color */}
          <Typography sx={styles.loadingText}>
            Gathering the moments...
          </Typography>
        </Box>
      )}

      {/* Error State */}
      {error && !loading && ( // Only show error if not loading
        <Alert severity="error" sx={{ width: '100%', maxWidth: '400px' }}>
          {error}
        </Alert>
      )}

      {/* Content State (Loaded) */}
      {!loading && !error && (
        <>
          <Typography variant="h4" component="h2" sx={styles.title}> {/* Use h4 but render as h2 for semantics */}
            Our Cherished Moments
          </Typography>

          <Typography variant="body1" sx={styles.introText}>
            Every picture tells a story. Step into our wedding day and relive some of the moments that made it truly unforgettable. Click on any photo to read its story.
          </Typography>

          {photos.length === 0 ? (
            <Typography sx={styles.noPhotosText}>
              No photos available yet. Check back soon!
            </Typography>
          ) : (
            <ImageList
              sx={styles.imageList}
              cols={window.innerWidth > 900 ? 3 : window.innerWidth > 600 ? 2 : 1} // Responsive columns
              rowHeight={window.innerWidth > 600 ? 200 : 250} // Responsive row height
              gap={20} // Increased gap
            >
              {photos.map((photo) => (
                <ImageListItem
                  key={photo.id}
                  onClick={() => handlePhotoClick(photo)} // Add click handler
                  sx={styles.imageListItem} // Apply item styles
                >
                  <img
                    // srcSet can be optimized for responsive grid sizes if needed,
                    // but objectFit cover handles scaling well within the item.
                    src={`${photo.url}?w=${styles.imageList.rowHeight}&h=${styles.imageList.rowHeight}&fit=crop&auto=format`}
                    srcSet={`${photo.url}?w=${styles.imageList.rowHeight}&h=${styles.imageList.rowHeight}&fit=crop&auto=format&dpr=2 2x`}
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

      {/* Photo Dialog */}
      <Dialog
        open={isModalOpen}
        onClose={handleCloseModal}
        maxWidth="md" // Adjust max width as needed (sm, md, lg, xl)
        fullWidth // Dialog takes full width up to maxWidth
        TransitionProps={{ // Optional: Add transition effect
           timeout: 300
        }}
        PaperProps={{ // Optional: Style the dialog paper
          sx: { borderRadius: '12px', overflowY: 'visible' }
        }}
      >
        {selectedPhoto && ( // Only render content if a photo is selected
          <>
            <DialogTitle sx={{ m: 0, p: 2, textAlign: 'center', fontFamily: styles.title.fontFamily, color: styles.title.color, fontWeight: 700 }}>
               {selectedPhoto.title}
              <IconButton
                aria-label="close"
                onClick={handleCloseModal}
                sx={{
                  position: 'absolute',
                  right: 8,
                  top: 8,
                  color: (theme) => theme.palette.grey[500],
                }}
              >
                <CloseIcon />
              </IconButton>
            </DialogTitle>
            <DialogContent dividers sx={{ p: { xs: 2, md: 4 } }}> {/* Add padding */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <img
                  src={selectedPhoto.url}
                  alt={selectedPhoto.title || `Wedding Photo ${selectedPhoto.id}`}
                  style={styles.dialogImage} // Apply dialog image styles
                />
                <Typography variant="body1" component="p" sx={styles.dialogCaption}>
                  {selectedPhoto.caption}
                </Typography>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>
    </Box>
  );
}
