import './fix-leaflet-icons';
import { Box, Typography } from '@mui/material';
import { MapContainer as Map, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export default function VenueMap() {
  const venuePosition = [-6.1754, 106.8272]; // Monas, Jakarta
  
  return (
    <Box sx={{ height: '500px', p: 2 }}>
      <Typography variant="h5" gutterBottom>
        Wedding Venue Location
      </Typography>
      <Map
        center={venuePosition}
        zoom={15}
        style={{ height: '100%', width: '100%' }}
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