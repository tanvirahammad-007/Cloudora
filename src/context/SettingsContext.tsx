import { createContext, useContext, useEffect, useState, ReactNode, useCallback } from 'react';

export type TemperatureUnit = 'C' | 'F';
export type WindSpeedUnit = 'km/h' | 'mph' | 'm/s' | 'knots';
export type BlurIntensity = 'none' | 'low' | 'medium' | 'high';
export type Language = 'en' | 'es' | 'fr' | 'de' | 'it';

export interface AppSettings {
  theme: 'dark' | 'light';
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
  animationsEnabled: boolean;
  blurIntensity: BlurIntensity;
  dynamicBackground: boolean;
  compactMode: boolean;
  notificationsEnabled: boolean;
  language: Language;
  autoLocation: boolean;
  aqiThreshold: number;
  windThreshold: number;
  tempThreshold: number;
  uvThreshold: number;
  stormAlerts: boolean;
  rainAlerts: boolean;
}

interface SettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
  toggleTheme: () => void;
}

const defaultSettings: AppSettings = {
  theme: 'dark',
  tempUnit: 'C',
  windUnit: 'km/h',
  animationsEnabled: true,
  blurIntensity: 'medium',
  dynamicBackground: true,
  compactMode: false,
  notificationsEnabled: true,
  language: 'en',
  autoLocation: true,
  aqiThreshold: 100,
  windThreshold: 50,
  tempThreshold: 35,
  uvThreshold: 8,
  stormAlerts: true,
  rainAlerts: true,
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettingsState] = useState<AppSettings>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('cloudora-settings');
      if (saved) {
        try {
          return { ...defaultSettings, ...JSON.parse(saved) };
        } catch (e) {
          return defaultSettings;
        }
      }
      
      // Default theme based on system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      return { ...defaultSettings, theme: prefersDark ? 'dark' : 'light' };
    }
    return defaultSettings;
  });

  const updateSettings = useCallback((newSettings: Partial<AppSettings>) => {
    setSettingsState((prev) => {
      const updated = { ...prev, ...newSettings };
      localStorage.setItem('cloudora-settings', JSON.stringify(updated));
      return updated;
    });
  }, []);

  const toggleTheme = useCallback(() => {
    updateSettings({ theme: settings.theme === 'dark' ? 'light' : 'dark' });
  }, [settings.theme, updateSettings]);

  // Apply Theme
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('dark', 'light');
    root.classList.add(settings.theme);
    root.setAttribute('data-theme', settings.theme);
  }, [settings.theme]);

  // Apply Blur Intensity
  useEffect(() => {
    const root = window.document.documentElement;
    const intensities = {
      none: '0px',
      low: '4px',
      medium: '12px',
      high: '24px',
    };
    root.style.setProperty('--blur-intensity', intensities[settings.blurIntensity]);
  }, [settings.blurIntensity]);

  // Apply Compact Mode
  useEffect(() => {
    const root = window.document.documentElement;
    if (settings.compactMode) {
      root.classList.add('compact-mode');
      root.style.setProperty('--spacing-gap-sm', '0.5rem');
      root.style.setProperty('--spacing-gap-md', '1rem');
      root.style.setProperty('--spacing-gap-lg', '1.5rem');
      root.style.setProperty('--spacing-gap-xl', '2.5rem');
    } else {
      root.classList.remove('compact-mode');
      // Reset is handled by the base CSS or we could revert to defaults
      // But better to just toggle a class and let CSS handle it
    }
  }, [settings.compactMode]);

  return (
    <SettingsContext.Provider value={{ settings, updateSettings, toggleTheme }}>
      {children}
    </SettingsContext.Provider>
  );
}

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) throw new Error('useSettings must be used within a SettingsProvider');
  return context;
};
