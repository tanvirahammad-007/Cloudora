import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CloudoraNotification, NotificationCategory, NotificationSeverity } from '../types/notification';
import { useWeather } from './WeatherContext';
import { useSettings } from './SettingsContext';
import { useUser } from './UserContext';
import { weatherService } from '../services/weatherService';

interface NotificationContextType {
  notifications: CloudoraNotification[];
  toasts: CloudoraNotification[];
  unreadCount: number;
  isOpen: boolean;
  addNotification: (notification: Omit<CloudoraNotification, 'id' | 'createdAt' | 'read'> & { read?: boolean }) => void;
  markAsRead: (id: string) => void;
  markAsUnread: (id: string) => void;
  toggleRead: (id: string) => void;
  removeNotification: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  clearCategory: (category: NotificationCategory) => void;
  dismissToast: (id: string) => void;
  openCenter: () => void;
  closeCenter: () => void;
  toggleCenter: () => void;
}

const STORAGE_KEY = 'cloudora-notifications';
const TEMP_MEMORY_KEY = 'cloudora-temperature-memory';
const MAX_NOTIFICATIONS = 2;
const MAX_TOASTS = 2;
const TOAST_AUTO_DISMISS_MS = 2000;
const NOTIFICATION_COOLDOWN_MS = 10 * 60 * 1000;

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const getDayKey = () => new Date().toISOString().slice(0, 10);

const createNotificationId = (fingerprint: string) => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return `${fingerprint}-${crypto.randomUUID()}`;
  }

  return `${fingerprint}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
};

const dedupeNotifications = (items: CloudoraNotification[]) => {
  const seen = new Set<string>();

  return items.filter((item) => {
    const key = item.fingerprint || item.id;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

const readStoredNotifications = () => {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const parsed = JSON.parse(stored);
    return Array.isArray(parsed) ? dedupeNotifications(parsed as CloudoraNotification[]).slice(0, MAX_NOTIFICATIONS) : [];
  } catch {
    return [];
  }
};

const readTempMemory = (): Record<string, number> => {
  if (typeof window === 'undefined') return {};

  try {
    return JSON.parse(localStorage.getItem(TEMP_MEMORY_KEY) || '{}');
  } catch {
    return {};
  }
};

const estimateAqi = (aqi: number) => {
  const levels = [0, 50, 100, 150, 200, 300];
  return levels[aqi] ?? aqi;
};

const playSoftTone = () => {
  if (typeof window === 'undefined') return;
  if (navigator.userActivation && !navigator.userActivation.hasBeenActive) return;

  try {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    const context = new AudioContext();
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = 'sine';
    oscillator.frequency.setValueAtTime(740, context.currentTime);
    oscillator.frequency.exponentialRampToValueAtTime(520, context.currentTime + 0.16);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.045, context.currentTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 0.2);

    oscillator.connect(gain);
    gain.connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 0.22);
  } catch {
    // Sound is a nicety; silently ignore browser audio restrictions.
  }
};

const getCopy = (isBangla: boolean) => ({
  dailyTitle: isBangla ? 'আজকের আবহাওয়া' : 'Today’s weather',
  dailyMessage: (city: string, temp: number, condition: string) =>
    isBangla ? `${city}: ${temp}° এবং ${condition}।` : `${city}: ${temp}° and ${condition}.`,
  rainTitle: isBangla ? 'বৃষ্টির সম্ভাবনা' : 'Rain alert',
  rainMessage: (city: string) => isBangla ? `${city} এলাকায় বৃষ্টি হতে পারে।` : `Rain may affect ${city}.`,
  severeTitle: isBangla ? 'খারাপ আবহাওয়া' : 'Severe weather',
  severeMessage: (city: string) => isBangla ? `${city} এলাকায় সতর্ক থাকুন।` : `Be careful around ${city}.`,
  tempTitle: isBangla ? 'তাপমাত্রা বদলেছে' : 'Temperature changed',
  tempMessage: (city: string, delta: number) =>
    isBangla ? `${city} এ তাপমাত্রা ${Math.abs(delta)}° ${delta > 0 ? 'বেড়েছে' : 'কমেছে'}।` : `${city} is ${Math.abs(delta)}° ${delta > 0 ? 'warmer' : 'cooler'}.`,
  aqiTitle: isBangla ? 'বাতাসের মান সতর্কতা' : 'Air quality alert',
  aqiMessage: (city: string) => isBangla ? `${city} এর বাতাস ভালো নয়।` : `Air quality is not good in ${city}.`,
  sunriseTitle: isBangla ? 'সূর্যোদয় কাছাকাছি' : 'Sunrise soon',
  sunriseMessage: (city: string) => isBangla ? `${city} এ শিগগির সূর্য উঠবে।` : `Sunrise is coming soon in ${city}.`,
  sunsetTitle: isBangla ? 'সূর্যাস্ত কাছাকাছি' : 'Sunset soon',
  sunsetMessage: (city: string) => isBangla ? `${city} এ শিগগির সূর্য ডুববে।` : `Sunset is coming soon in ${city}.`,
  savedTitle: isBangla ? 'সেভ করা শহরের খবর' : 'Saved city alert',
  savedMessage: (city: string, condition: string, temp: number) =>
    isBangla ? `${city}: ${condition}, ${temp}°।` : `${city}: ${condition}, ${temp}°.`,
});

export function NotificationProvider({ children }: { children: ReactNode }) {
  const { weather } = useWeather();
  const { profile } = useUser();
  const { settings } = useSettings();
  const [notifications, setNotifications] = useState<CloudoraNotification[]>(readStoredNotifications);
  const [toasts, setToasts] = useState<CloudoraNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const savedCityScanRef = useRef('');

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications.slice(0, MAX_NOTIFICATIONS)));
  }, [notifications]);

  useEffect(() => {
    setNotifications((prev) => dedupeNotifications(prev).slice(0, MAX_NOTIFICATIONS));
  }, []);

  const addNotification = useCallback((notification: Omit<CloudoraNotification, 'id' | 'createdAt' | 'read'> & { read?: boolean }) => {
    if (!settings.notificationsEnabled) return;

    const nextNotification: CloudoraNotification = {
      ...notification,
      id: createNotificationId(notification.fingerprint),
      createdAt: new Date().toISOString(),
      read: notification.read ?? false,
    };

    setNotifications((prev) => {
      if (prev.some((item) => item.fingerprint === nextNotification.fingerprint)) return prev;

      const recentNotificationCount = prev.filter((item) => {
        const createdAt = new Date(item.createdAt).getTime();
        return Number.isFinite(createdAt) && Date.now() - createdAt < NOTIFICATION_COOLDOWN_MS;
      }).length;

      if (recentNotificationCount >= MAX_NOTIFICATIONS) return prev;

      setToasts((current) => [nextNotification, ...current.filter((item) => item.fingerprint !== nextNotification.fingerprint)].slice(0, MAX_TOASTS));
      if (settings.notificationSoundEnabled) playSoftTone();
      return [nextNotification, ...prev].slice(0, MAX_NOTIFICATIONS);
    });
  }, [settings.notificationSoundEnabled, settings.notificationsEnabled]);

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, read: true } : item));
    setToasts((prev) => prev.map((item) => item.id === id ? { ...item, read: true } : item));
  }, []);

  const markAsUnread = useCallback((id: string) => {
    setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, read: false } : item));
    setToasts((prev) => prev.map((item) => item.id === id ? { ...item, read: false } : item));
  }, []);

  const toggleRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((item) => item.id === id ? { ...item, read: !item.read } : item));
    setToasts((prev) => prev.map((item) => item.id === id ? { ...item, read: !item.read } : item));
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((item) => item.id !== id));
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => prev.map((item) => ({ ...item, read: true })));
    setToasts((prev) => prev.map((item) => ({ ...item, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
    setToasts([]);
  }, []);

  const clearCategory = useCallback((category: NotificationCategory) => {
    setNotifications((prev) => prev.filter((item) => item.category !== category));
    setToasts((prev) => prev.filter((item) => item.category !== category));
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const openCenter = useCallback(() => setIsOpen(true), []);
  const closeCenter = useCallback(() => setIsOpen(false), []);
  const toggleCenter = useCallback(() => setIsOpen((prev) => !prev), []);

  useEffect(() => {
    if (!weather || !settings.notificationsEnabled) return;

    const isBangla = settings.language === 'bn';
    const copy = getCopy(isBangla);
    const city = weather.location.name;
    const locationKey = `${weather.location.lat.toFixed(2)}-${weather.location.lon.toFixed(2)}`;
    const dayKey = getDayKey();
    const code = weather.current.weatherCode;

    const addWeatherNotification = (
      category: NotificationCategory,
      severity: NotificationSeverity,
      fingerprint: string,
      title: string,
      message: string
    ) => {
      addNotification({
        category,
        severity,
        fingerprint,
        title,
        message,
        city,
        source: 'weather',
      });
    };

    if (settings.dailySummaryAlerts) {
      addWeatherNotification(
        'daily',
        'info',
        `daily-${dayKey}-${locationKey}`,
        copy.dailyTitle,
        copy.dailyMessage(city, Math.round(weather.current.temp), weather.current.condition)
      );
    }

    if (settings.rainAlerts && (code >= 500 && code < 600 || weather.current.precipitation > 0)) {
      addWeatherNotification('rain', 'warning', `rain-${dayKey}-${locationKey}-${code}`, copy.rainTitle, copy.rainMessage(city));
    }

    if (settings.stormAlerts && (code >= 200 && code < 300 || weather.current.windSpeed >= settings.windThreshold)) {
      addWeatherNotification('severe', 'danger', `severe-${dayKey}-${locationKey}-${code}`, copy.severeTitle, copy.severeMessage(city));
    }

    if (settings.aqiAlerts && weather.aqi && estimateAqi(weather.aqi.us) >= settings.aqiThreshold) {
      addWeatherNotification('aqi', 'warning', `aqi-${dayKey}-${locationKey}-${weather.aqi.us}`, copy.aqiTitle, copy.aqiMessage(city));
    }

    if (settings.temperatureAlerts) {
      const memory = readTempMemory();
      const previousTemp = memory[locationKey];
      const nextTemp = Math.round(weather.current.temp);

      if (typeof previousTemp === 'number') {
        const delta = nextTemp - previousTemp;
        if (Math.abs(delta) >= 5) {
          addWeatherNotification(
            'temperature',
            'info',
            `temp-${dayKey}-${locationKey}-${nextTemp}`,
            copy.tempTitle,
            copy.tempMessage(city, delta)
          );
        }
      }

      memory[locationKey] = nextTemp;
      localStorage.setItem(TEMP_MEMORY_KEY, JSON.stringify(memory));
    }

    if (settings.sunReminderAlerts) {
      const now = Date.now() / 1000;
      const reminderWindow = 90 * 60;
      if (weather.current.sunrise > now && weather.current.sunrise - now <= reminderWindow) {
        addWeatherNotification('sun', 'success', `sunrise-${dayKey}-${locationKey}`, copy.sunriseTitle, copy.sunriseMessage(city));
      }
      if (weather.current.sunset > now && weather.current.sunset - now <= reminderWindow) {
        addWeatherNotification('sun', 'success', `sunset-${dayKey}-${locationKey}`, copy.sunsetTitle, copy.sunsetMessage(city));
      }
    }
  }, [addNotification, settings, weather]);

  useEffect(() => {
    if (!settings.notificationsEnabled || !settings.savedCityAlerts || profile.favorites.length === 0) return;

    let isCancelled = false;
    const scanKey = `${getDayKey()}-${profile.favorites.map((city) => `${city.lat.toFixed(1)}:${city.lon.toFixed(1)}`).join('|')}`;
    if (savedCityScanRef.current === scanKey) return;
    savedCityScanRef.current = scanKey;

    const scanSavedCities = async () => {
      const isBangla = settings.language === 'bn';
      const copy = getCopy(isBangla);

      await Promise.all(profile.favorites.slice(0, 5).map(async (city) => {
        try {
          const summary = await weatherService.getCurrentWeatherSummary(city.lat, city.lon);
          if (!summary || isCancelled) return;
          const condition = summary.condition.toLowerCase();
          const noteworthy = condition.includes('rain') || condition.includes('storm') || condition.includes('snow') || summary.temp >= settings.tempThreshold;
          if (!noteworthy) return;

          addNotification({
            category: 'saved',
            severity: condition.includes('storm') ? 'danger' : 'warning',
            fingerprint: `saved-${getDayKey()}-${city.lat.toFixed(2)}-${city.lon.toFixed(2)}-${summary.condition}-${summary.temp}`,
            title: copy.savedTitle,
            message: copy.savedMessage(city.name, summary.condition, summary.temp),
            city: city.name,
            source: 'saved-city',
          });
        } catch {
          // Saved-city scans should never interrupt the app.
        }
      }));
    };

    scanSavedCities();
    const timer = window.setInterval(scanSavedCities, 30 * 60 * 1000);

    return () => {
      isCancelled = true;
      window.clearInterval(timer);
    };
  }, [addNotification, profile.favorites, settings]);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) => {
      const createdAt = new Date(toast.createdAt).getTime();
      const elapsed = Number.isFinite(createdAt) ? Date.now() - createdAt : 0;
      const delay = Math.max(0, TOAST_AUTO_DISMISS_MS - elapsed);

      return window.setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== toast.id));
      }, delay);
    });

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [toasts]);

  const value = useMemo(() => ({
    notifications,
    toasts,
    unreadCount: notifications.filter((item) => !item.read).length,
    isOpen,
    addNotification,
    markAsRead,
    markAsUnread,
    toggleRead,
    removeNotification,
    markAllAsRead,
    clearAll,
    clearCategory,
    dismissToast,
    openCenter,
    closeCenter,
    toggleCenter,
  }), [
    notifications,
    toasts,
    isOpen,
    addNotification,
    markAsRead,
    markAsUnread,
    toggleRead,
    removeNotification,
    markAllAsRead,
    clearAll,
    clearCategory,
    dismissToast,
    openCenter,
    closeCenter,
    toggleCenter,
  ]);

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) throw new Error('useNotifications must be used within NotificationProvider');
  return context;
};
