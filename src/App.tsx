import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SettingsProvider } from './context/SettingsContext';
import { UserProvider } from './context/UserContext';
import { WeatherProvider } from './context/WeatherContext';
import { NotificationProvider } from './context/NotificationContext';
import { ErrorProvider } from './context/ErrorContext';
import ErrorBoundary from './components/errors/ErrorBoundary';
import ErrorToasts from './components/errors/ErrorToasts';
import OfflineBanner from './components/errors/OfflineBanner';
import Layout from './components/layout/Layout';
import ScrollToTop from './components/layout/ScrollToTop';
import LivelyBackground from './components/layout/LivelyBackground';
import NotificationToasts from './components/notifications/NotificationToasts';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const ProfilePage = lazy(() => import('./pages/ProfilePage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const SavedCitiesPage = lazy(() => import('./pages/SavedCitiesPage'));
const AnalyticsPage = lazy(() => import('./pages/AnalyticsPage'));
const MapsPage = lazy(() => import('./pages/MapsPage'));
const TravelPlannerPage = lazy(() => import('./pages/TravelPlannerPage'));

const PageFallback = () => (
  <div className="premium-page">
    <div className="premium-page-inner flex min-h-[50vh] items-center justify-center">
      <div className="glass-panel h-20 w-20 animate-pulse rounded-[2rem] border border-[var(--border-color)]" />
    </div>
  </div>
);

export default function App() {
  return (
    <BrowserRouter>
      <SettingsProvider>
        <ErrorProvider>
          <ErrorBoundary>
            <UserProvider>
              <WeatherProvider>
                <NotificationProvider>
                  <ScrollToTop />
                  <LivelyBackground />
                  <OfflineBanner />
                  <NotificationToasts />
                  <ErrorToasts />
                  <Suspense fallback={<PageFallback />}>
                    <Routes>
                      <Route path="/" element={<Layout />}>
                        <Route index element={<DashboardPage />} />
                        <Route path="profile" element={<ProfilePage />} />
                        <Route path="settings" element={<SettingsPage />} />
                        <Route path="saved" element={<SavedCitiesPage />} />
                        <Route path="analytics" element={<AnalyticsPage />} />
                        <Route path="maps" element={<MapsPage />} />
                        <Route path="travel" element={<TravelPlannerPage />} />
                      </Route>
                    </Routes>
                  </Suspense>
                </NotificationProvider>
              </WeatherProvider>
            </UserProvider>
          </ErrorBoundary>
        </ErrorProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
