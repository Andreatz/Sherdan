import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navigation } from './components/shared/Navigation';
import { Footer } from './components/shared/Footer';

// Auth Pages
import { Login } from './pages/auth/Login';
import { Signup } from './pages/auth/Signup';

// Public Pages
import { Home } from './pages/public/Home';
import { CampaignPage } from './pages/public/Campaign';
import { CharactersPage } from './pages/public/Characters';
import { SessionsPreview } from './pages/public/SessionsPreview';
import { SessionsPage } from './pages/public/Sessions';
import { MapPage } from './pages/public/Map';
import { GalleryPage } from './pages/public/Gallery';
import { RegionPage } from './pages/public/RegionPage';
import { LocationsPage } from './pages/public/Locations';
import { BestiaryPage } from './pages/public/Bestiary';

// Player Pages
import { MyCharacterPage } from './pages/player/MyCharacter';
import { MissionsPage } from './pages/player/Missions';
import { SessionNotesPage } from './pages/player/SessionNotes';

// Admin Pages
import { DashboardPage } from './pages/admin/Dashboard';
import { CharactersPage as AdminCharactersPage } from './pages/admin/Characters';
import { SessionsPage as AdminSessionsPage } from './pages/admin/Sessions';
import { MissionsAdminPage } from './pages/admin/Missions';
import { LocationsPage as AdminLocationsPage } from './pages/admin/Locations';
import { GalleryPage as AdminGalleryPage } from './pages/admin/Gallery';
import { SettingsPage } from './pages/admin/Settings';
import { BestiaryAdminPage } from './pages/admin/Bestiary';

const ScrollToSection: React.FC = () => {
  const location = useLocation();
  useEffect(() => {
    const state = location.state as { scrollTo?: string } | null;
    if (state?.scrollTo) {
      const tryScroll = (attempts = 0) => {
        const el = document.getElementById(state.scrollTo!);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          window.history.replaceState({}, '');
        } else if (attempts < 10) {
          setTimeout(() => tryScroll(attempts + 1), 150);
        }
      };
      tryScroll();
    }
  }, [location.state]);
  return null;
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <ScrollToSection />
        <Routes>
          {/* Auth */}
          <Route path="/auth/login"  element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

          {/* Home */}
          <Route path="/" element={
            <>
              <Navigation />
              <div className="bg-slate-900">
                <Home />
                <CampaignPage />
                <CharactersPage />
                <SessionsPreview />
                <MapPage />
                <GalleryPage />
              </div>
              <Footer />
            </>
          } />

          {/* Sessioni */}
          <Route path="/sessioni" element={
            <ProtectedRoute><Navigation /><SessionsPage /><Footer /></ProtectedRoute>
          } />

          {/* Luoghi */}
          <Route path="/luoghi" element={
            <><Navigation /><LocationsPage /><Footer /></>
          } />

          {/* Regioni */}
          <Route path="/mappa/:regionSlug" element={
            <><Navigation /><RegionPage /><Footer /></>
          } />

          {/* Bestiario */}
          <Route path="/bestiario" element={
            <><Navigation /><BestiaryPage /><Footer /></>
          } />

          {/* Player */}
          <Route path="/personaggio" element={
            <ProtectedRoute><Navigation /><MyCharacterPage /><Footer /></ProtectedRoute>
          } />
          <Route path="/missioni" element={
            <ProtectedRoute><MissionsPage /></ProtectedRoute>
          } />
          <Route path="/note" element={
            <ProtectedRoute><SessionNotesPage /></ProtectedRoute>
          } />

          {/* Admin */}
          <Route path="/admin"            element={<ProtectedRoute requireAdmin><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/characters" element={<ProtectedRoute requireAdmin><AdminCharactersPage /></ProtectedRoute>} />
          <Route path="/admin/sessions"   element={<ProtectedRoute requireAdmin><AdminSessionsPage /></ProtectedRoute>} />
          <Route path="/admin/missions"   element={<ProtectedRoute requireAdmin><MissionsAdminPage /></ProtectedRoute>} />
          <Route path="/admin/locations"  element={<ProtectedRoute requireAdmin><AdminLocationsPage /></ProtectedRoute>} />
          <Route path="/admin/gallery"    element={<ProtectedRoute requireAdmin><AdminGalleryPage /></ProtectedRoute>} />
          <Route path="/admin/settings"   element={<ProtectedRoute requireAdmin><SettingsPage /></ProtectedRoute>} />
          <Route path="/admin/bestiary"   element={<ProtectedRoute requireAdmin><BestiaryAdminPage /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
