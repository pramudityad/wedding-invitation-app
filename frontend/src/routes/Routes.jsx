import { Routes, Route, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import InvitationLanding from '../components/InvitationLanding';
import ErrorBoundary from '../components/ErrorBoundary';
import LoadingFallback from '../components/LoadingFallback';

// Lazy load heavy components
const GuestComments = lazy(() => import('../components/GuestComments'));
const WeddingPhotoGallery = lazy(() => import('../components/WeddingPhotoGallery'));
const LoginPage = lazy(() => import('../components/LoginPage'));

export default function AppRoutes() {
  return (
    <ErrorBoundary>
      <Routes>
        <Route
          path="/invite/:name"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route
          path="/invite"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <LoginPage />
            </Suspense>
          }
        />
        <Route path="/" element={<InvitationLanding />} />
        <Route
          path="/comments"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <GuestComments />
            </Suspense>
          }
        />
        <Route
          path="/gallery"
          element={
            <Suspense fallback={<LoadingFallback />}>
              <WeddingPhotoGallery />
            </Suspense>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ErrorBoundary>
  );
}
