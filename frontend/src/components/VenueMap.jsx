import './fix-leaflet-icons'; // Keep this fix
import { Box, Typography, Button } from '@mui/material';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { MapContainer as Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css'; // Keep Leaflet CSS

export default function VenueMap() {
  // Parse venue position from environment variables, with defaults
  const venueLat = parseFloat(import.meta.env.VITE_APP_VENUE_LAT || '-6.1754');
  const venueLng = parseFloat(import.meta.env.VITE_APP_VENUE_LNG || '106.8272');
  const venuePosition = [venueLat, venueLng];

  // Combine into Google Maps directions URL
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${venueLat},${venueLng}&travelmode=driving`;

  return (
    // Outer Box styling: simpler height management, centered
    <Box sx={{
      p: { xs: 2, md: 4 }, // Responsive padding
      backgroundColor: '#f9f9f7',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
      maxWidth: '800px', // Max width for better look on large screens
      margin: 'auto', // Center the box
      mt: 4, // Margin top for spacing if not used at top of page
      mb: 4, // Margin bottom
    }}>
      {/* Title: Centered, slightly bolder font weight */}
      <Typography
        variant="h5"
        sx={{
          mb: 3, // Margin bottom for spacing below title
          fontFamily: "'Playfair Display', serif",
          fontWeight: 400, // Slightly bolder than 300
          color: '#333',
          textAlign: 'center', // Center the text
        }}
      >
        Wedding Venue Location
      </Typography>

      {/* Map Container */}
      <Map
        center={venuePosition}
        zoom={15}
        style={{
          height: '80vh', // Use viewport height for better responsiveness, adjust as needed (e.g., '500px')
          maxHeight: '600px', // Prevent it from becoming too tall on very large screens
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #e0e0e0',
        }}
      >
        <TileLayer
          url="https://tile.openstreetmap.de/{z}/{x}/{y}.png" // Using a different OSM tile provider, looks clean
          attribution="© OpenStreetMap contributors"
        />
        {/* Venue Marker */}
        <Marker position={venuePosition}>
          <Popup>Wedding Venue</Popup> {/* Simple popup */}
        </Marker>
      </Map>

      {/* Google Maps Button */}
      <Button
        variant="contained" // A filled button stands out
        color="primary" // Use the primary theme color or specify a custom one
        href={googleMapsUrl} // Link to the generated Google Maps URL
        target="_blank" // Open in a new tab
        rel="noopener noreferrer" // Recommended for security when using target="_blank"
        sx={{
          mt: 3, // Margin top to space it from the map
          display: 'block', // Make it a block element to use margin: auto
          mx: 'auto', // Center the button horizontally
          maxWidth: '300px', // Limit the button width for better appearance
        }}
        startIcon={<MapOutlinedIcon />} // Add a map icon
      >
        Get Directions on Google Maps
      </Button>
    </Box>
  );
}
