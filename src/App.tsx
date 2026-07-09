import type { ReactNode } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { AuthLoadingScreen } from './components/AuthLoadingScreen';
import BrewApp from './components/BrewApp';
import { LandingPage } from './components/landing/LandingPage';
import { LoginView } from './components/LoginView';

/** Rutas de la app autenticada: sin sesión → /login. */
function ProtectedRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (!user) return <Navigate to="/login" replace />;
  return children;
}

/**
 * Login / register: si ya hay sesión, ir al dashboard.
 * No se usa en "/" — la landing es siempre pública.
 */
function GuestRoute({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();

  if (loading) return <AuthLoadingScreen />;
  if (user) return <Navigate to="/dashboard" replace />;
  return children;
}

export default function App() {
  return (
    <Routes>
      {/* Landing siempre pública: con o sin sesión, sin redirect a dashboard */}
      <Route path="/" element={<LandingPage />} />

      <Route
        path="/login"
        element={
          <GuestRoute>
            <LoginView mode="login" />
          </GuestRoute>
        }
      />
      <Route
        path="/register"
        element={
          <GuestRoute>
            <LoginView mode="register" />
          </GuestRoute>
        }
      />

      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <BrewApp />
          </ProtectedRoute>
        }
      />

      {/* Compatibilidad con URLs anteriores */}
      <Route path="/app" element={<Navigate to="/dashboard" replace />} />
      <Route path="/app/*" element={<Navigate to="/dashboard" replace />} />
      <Route path="/landing.html" element={<Navigate to="/" replace />} />
      <Route path="/landing" element={<Navigate to="/" replace />} />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
