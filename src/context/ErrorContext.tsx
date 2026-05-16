import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { createAppError, normalizeError } from '../lib/errorUtils';
import { AppError, AppErrorInput } from '../types/error';

interface ErrorContextType {
  errors: AppError[];
  toasts: AppError[];
  isOffline: boolean;
  reportError: (error: unknown, fallback?: AppErrorInput) => AppError;
  dismissError: (id: string) => void;
  clearErrors: () => void;
}

const ERROR_STORAGE_KEY = 'cloudora-error-history';
const MAX_ERRORS = 8;
const MAX_TOASTS = 3;
const TOAST_DURATION = 4000;

const ErrorContext = createContext<ErrorContextType | undefined>(undefined);

const readStoredErrors = () => {
  if (typeof window === 'undefined') return [];

  try {
    const saved = localStorage.getItem(ERROR_STORAGE_KEY);
    return saved ? JSON.parse(saved).slice(0, MAX_ERRORS) as AppError[] : [];
  } catch {
    return [];
  }
};

export function ErrorProvider({ children }: { children: ReactNode }) {
  const [errors, setErrors] = useState<AppError[]>(readStoredErrors);
  const [toasts, setToasts] = useState<AppError[]>([]);
  const [isOffline, setIsOffline] = useState(() => typeof navigator !== 'undefined' ? !navigator.onLine : false);
  const lastToastRef = useRef<{ key: string; time: number } | null>(null);

  const reportError = useCallback((error: unknown, fallback: AppErrorInput = {}) => {
    const appError = normalizeError(error, fallback);
    const toastKey = `${appError.kind}-${appError.message}-${appError.source || ''}`;
    const now = Date.now();
    const isDuplicateBurst = lastToastRef.current?.key === toastKey && now - lastToastRef.current.time < 4500;

    setErrors((prev) => [appError, ...prev.filter((item) => item.kind !== appError.kind || item.message !== appError.message)].slice(0, MAX_ERRORS));

    if (!isDuplicateBurst) {
      lastToastRef.current = { key: toastKey, time: now };
      setToasts((prev) => [appError, ...prev.filter((item) => item.kind !== appError.kind || item.message !== appError.message)].slice(0, MAX_TOASTS));
    }

    return appError;
  }, []);

  const dismissError = useCallback((id: string) => {
    setErrors((prev) => prev.filter((error) => error.id !== id));
    setToasts((prev) => prev.filter((error) => error.id !== id));
  }, []);

  const clearErrors = useCallback(() => {
    setErrors([]);
    setToasts([]);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ERROR_STORAGE_KEY, JSON.stringify(errors));
  }, [errors]);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOffline = () => {
      setIsOffline(true);
      reportError(createAppError({ kind: 'offline', source: 'network' }));
    };

    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, [reportError]);

  useEffect(() => {
    if (toasts.length === 0) return;

    const timers = toasts.map((toast) => window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== toast.id));
    }, TOAST_DURATION));

    return () => timers.forEach(window.clearTimeout);
  }, [toasts]);

  const value = useMemo(() => ({
    errors,
    toasts,
    isOffline,
    reportError,
    dismissError,
    clearErrors,
  }), [clearErrors, dismissError, errors, isOffline, reportError, toasts]);

  return (
    <ErrorContext.Provider value={value}>
      {children}
    </ErrorContext.Provider>
  );
}

export const useErrors = () => {
  const context = useContext(ErrorContext);
  if (!context) throw new Error('useErrors must be used within ErrorProvider');
  return context;
};
