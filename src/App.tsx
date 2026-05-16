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
import DashboardPage from './pages/DashboardPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import SavedCitiesPage from './pages/SavedCitiesPage';
import AnalyticsPage from './pages/AnalyticsPage';
import MapsPage from './pages/MapsPage';
import TravelPlannerPage from './pages/TravelPlannerPage';

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
                </NotificationProvider>
              </WeatherProvider>
            </UserProvider>
          </ErrorBoundary>
        </ErrorProvider>
      </SettingsProvider>
    </BrowserRouter>
  );
}
