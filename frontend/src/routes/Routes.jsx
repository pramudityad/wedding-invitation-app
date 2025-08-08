import { Routes, Route, Navigate } from 'react-router-dom';
import InvitationLanding from '../components/InvitationLanding';
import VenueMap from '../components/VenueMap';
import GuestComments from '../components/GuestComments';
import MusicPlayer from '../components/MusicPlayer';
import LoginPage from '../components/LoginPage';
import WeddingPhotoGallery from '../components/WeddingPhotoGallery';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login/:name" element={<LoginPage />} />
      <Route path="/login/*" element={<LoginPage />} />
      <Route path="/" element={<InvitationLanding />} />
      <Route path="/venue" element={<VenueMap />} />
      <Route path="/comments" element={<GuestComments />} />
      <Route path="/music" element={<MusicPlayer />} />
      <Route path="/gallery" element={<WeddingPhotoGallery />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
