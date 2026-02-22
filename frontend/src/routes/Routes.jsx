import { Routes, Route, Navigate } from 'react-router-dom';
import InvitationLanding from '../components/InvitationLanding';
import GuestComments from '../components/GuestComments';
import WeddingPhotoGallery from '../components/WeddingPhotoGallery';
import LoginPage from '../components/LoginPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/invite/:name" element={<LoginPage />} />
      <Route path="/invite" element={<LoginPage />} />
      <Route path="/" element={<InvitationLanding />} />
      <Route path="/comments" element={<GuestComments />} />
      <Route path="/gallery" element={<WeddingPhotoGallery />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
