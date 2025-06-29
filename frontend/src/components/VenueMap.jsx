import './fix-leaflet-icons';
import { Box, Typography } from '@mui/material';
import { MapContainer as Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function VenueMap() {
  const venuePosition = [-6.1754, 106.8272]; // Monas, Jakarta
  
  return (
    <Box sx={{
      height: '600px',
      p: 4,
      backgroundColor: '#f9f9f7',
      borderRadius: '12px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.08)'
    }}>
      <Typography
        variant="h5"
        sx={{
          mb: 3,
          fontFamily: "'Playfair Display', serif",
          fontWeight: 300,
          color: '#333'
        }}
      >
        Wedding Venue Location
      </Typography>
      <Map
        center={venuePosition}
        zoom={15}
        style={{
          height: '100%',
          width: '100%',
          borderRadius: '8px',
          border: '1px solid #e0e0e0'
        }}
      >
        <TileLayer
          url="https://tile.openstreetmap.de/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        <Marker position={venuePosition}>
          <Popup>Wedding Venue</Popup>
        </Marker>
      </Map>
    </Box>
  );
}