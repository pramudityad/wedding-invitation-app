import { Box, Typography } from '@mui/material';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function VenueMap() {
  const venuePosition = [51.505, -0.09]; // Example coordinates
  
  return (
    <Box sx={{ height: '400px', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Wedding Venue Location
      </Typography>
      <MapContainer 
        center={venuePosition} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <Marker position={venuePosition}>
          <Popup>Wedding Venue</Popup>
        </Marker>
      </MapContainer>
    </Box>
  );
}