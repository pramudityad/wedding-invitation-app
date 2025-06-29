import { Routes, Route } from 'react-router-dom';
import InvitationLanding from '../components/InvitationLanding';
import RSVPForm from '../components/RSVPForm';
import VenueMap from '../components/VenueMap';
import GuestComments from '../components/GuestComments';
import MusicPlayer from '../components/MusicPlayer';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<InvitationLanding />} />
      <Route path="/rsvp" element={<RSVPForm />} />
      <Route path="/venue" element={<VenueMap />} />
      <Route path="/comments" element={<GuestComments />} />
      <Route path="/music" element={<MusicPlayer />} />
    </Routes>
  );
}