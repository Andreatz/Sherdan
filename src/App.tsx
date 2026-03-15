import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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

// Player Pages
import { MyCharacterPage } from './pages/player/MyCharacter';
import { MissionsPage } from './pages/player/Missions';

// Admin Pages
import { DashboardPage } from './pages/admin/Dashboard';
import { CharactersPage as AdminCharactersPage } from './pages/admin/Characters';
import { SessionsPage as AdminSessionsPage } from './pages/admin/Sessions';
import { MissionsAdminPage } from './pages/admin/Missions';
import { LocationsPage } from './pages/admin/Locations';
import { GalleryPage as AdminGalleryPage } from './pages/admin/Gallery';
import { SettingsPage } from './pages/admin/Settings';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Auth Routes */}
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />

          {/* Home */}
          <Route
            path="/"
            element={
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
            }
          />

          {/* Sessioni — solo utenti loggati */}
          <Route
            path="/sessioni"
            element={
              <ProtectedRoute>
                <Navigation />
                <SessionsPage />
                <Footer />
              </ProtectedRoute>
            }
          />

          {/* Pagine regione */}
          <Route
            path="/mappa/:regionSlug"
            element={
              <>
                <Navigation />
                <RegionPage />
                <Footer />
            </>
            }
          />

          {/* Player Routes */}
          <Route
            path="/personaggio"
            element={
              <ProtectedRoute>
                <Navigation />
                <MyCharacterPage />
                <Footer />
              </ProtectedRoute>
            }
          />
          <Route
            path="/missioni"
            element={
              <ProtectedRoute>
                <MissionsPage />
              </ProtectedRoute>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin"            element={<ProtectedRoute requireAdmin><DashboardPage /></ProtectedRoute>} />
          <Route path="/admin/characters" element={<ProtectedRoute requireAdmin><AdminCharactersPage /></ProtectedRoute>} />
          <Route path="/admin/sessions"   element={<ProtectedRoute requireAdmin><AdminSessionsPage /></ProtectedRoute>} />
          <Route path="/admin/missions"   element={<ProtectedRoute requireAdmin><MissionsAdminPage /></ProtectedRoute>} />
          <Route path="/admin/locations"  element={<ProtectedRoute requireAdmin><LocationsPage /></ProtectedRoute>} />
          <Route path="/admin/gallery"    element={<ProtectedRoute requireAdmin><AdminGalleryPage /></ProtectedRoute>} />
          <Route path="/admin/settings"   element={<ProtectedRoute requireAdmin><SettingsPage /></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
