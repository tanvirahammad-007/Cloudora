import { createContext, useContext, useState, useEffect, ReactNode, useCallback, useMemo } from 'react';
import { WeatherData, CitySuggestion } from '../types/weather';
import { weatherService } from '../services/weatherService';
import { useSettings } from './SettingsContext';

interface WeatherContextType {
  weather: WeatherData | null;
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  searchHistory: CitySuggestion[];
  fetchWeather: (lat: number, lon: number, cityName: string) => Promise<void>;
  addToHistory: (city: CitySuggestion) => void;
  removeFromHistory: (lat: number, lon: number) => void;
  clearHistory: () => void;
}

const WeatherContext = createContext<WeatherContextType | undefined>(undefined);

export function WeatherProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings();
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [currentParams, setCurrentParams] = useState<{ lat: number; lon: number; cityName: string } | null>(null);

  const [searchHistory, setSearchHistory] = useState<CitySuggestion[]>(() => {
    const saved = localStorage.getItem('search_history');
    return saved ? JSON.parse(saved) : [];
  });

  const fetchWeather = useCallback(async (lat: number, lon: number, cityName: string) => {
    setLoading(true);
    setError(null);
    try {
      const data = await weatherService.getWeatherData(lat, lon, cityName);
      setWeather(data);
      setLastUpdated(new Date());
      setCurrentParams({ lat, lon, cityName });
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Failed to fetch weather data. Please check your API key.');
    } finally {
      setLoading(false);
    }
  }, []);

  // Polling for real-time updates every 30 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      if (currentParams) {
        fetchWeather(currentParams.lat, currentParams.lon, currentParams.cityName);
      }
    }, 30 * 60 * 1000);

    return () => clearInterval(interval);
  }, [currentParams, fetchWeather]);

  const addToHistory = useCallback((city: CitySuggestion) => {
    setSearchHistory((prev) => {
      const filtered = prev.filter((item) => item.lat !== city.lat || item.lon !== city.lon);
      const updated = [city, ...filtered].slice(0, 10);
      localStorage.setItem('search_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const removeFromHistory = useCallback((lat: number, lon: number) => {
    setSearchHistory((prev) => {
      const updated = prev.filter((item) => item.lat !== lat || item.lon !== lon);
      localStorage.setItem('search_history', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const clearHistory = useCallback(() => {
    setSearchHistory([]);
    localStorage.removeItem('search_history');
  }, []);

  // Initial load
  useEffect(() => {
    const init = async () => {
      if (settings.autoLocation && navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            await fetchWeather(position.coords.latitude, position.coords.longitude, 'Current Location');
          },
          async () => {
            // Default to London
            await fetchWeather(51.5074, -0.1278, 'London');
          }
        );
      } else {
        await fetchWeather(51.5074, -0.1278, 'London');
      }
    };
    init();
  }, [fetchWeather, settings.autoLocation]);

  const value = useMemo(() => ({
    weather, 
    loading, 
    error, 
    lastUpdated, 
    searchHistory, 
    fetchWeather, 
    addToHistory,
    removeFromHistory,
    clearHistory
  }), [
    weather, 
    loading, 
    error, 
    lastUpdated, 
    searchHistory, 
    fetchWeather, 
    addToHistory,
    removeFromHistory,
    clearHistory
  ]);

  return (
    <WeatherContext.Provider value={value}>
      {children}
    </WeatherContext.Provider>
  );
}

export const useWeather = () => {
  const context = useContext(WeatherContext);
  if (!context) throw new Error('useWeather must be used within a WeatherProvider');
  return context;
};
