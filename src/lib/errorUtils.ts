import axios from 'axios';
import { AppError, AppErrorInput, AppErrorKind } from '../types/error';

const messageByKind: Record<AppErrorKind, { title: string; message: string; actionLabel?: string; retryable: boolean }> = {
  'empty-search': {
    title: 'Search needs a place',
    message: 'Type a city name first, then Cloudora can find the weather for you.',
    actionLabel: 'Search again',
    retryable: false,
  },
  'invalid-city': {
    title: 'No matching city found',
    message: 'Check the spelling or try a nearby city with a country name.',
    actionLabel: 'Try another city',
    retryable: false,
  },
  offline: {
    title: 'You are offline',
    message: 'Cloudora will reconnect as soon as your internet comes back.',
    actionLabel: 'Retry',
    retryable: true,
  },
  timeout: {
    title: 'Weather took too long',
    message: 'The weather service is slow right now. Please try again in a moment.',
    actionLabel: 'Retry',
    retryable: true,
  },
  'rate-limit': {
    title: 'Too many weather checks',
    message: 'The weather service is resting for a moment. Please wait a little and try again.',
    actionLabel: 'Retry later',
    retryable: true,
  },
  api: {
    title: 'Weather service paused',
    message: 'We could not reach fresh weather data right now. Your dashboard is still safe.',
    actionLabel: 'Retry',
    retryable: true,
  },
  'missing-data': {
    title: 'Weather data is incomplete',
    message: 'Some readings did not arrive clearly. Try again for a cleaner update.',
    actionLabel: 'Refresh',
    retryable: true,
  },
  'location-denied': {
    title: 'Location is off',
    message: 'Allow location access or search for a city manually.',
    actionLabel: 'Search city',
    retryable: false,
  },
  'forecast-unavailable': {
    title: 'Forecast is unavailable',
    message: 'The live forecast did not arrive. Current weather can still be shown.',
    actionLabel: 'Retry forecast',
    retryable: true,
  },
  'air-quality-unavailable': {
    title: 'Air quality is unavailable',
    message: 'AQI readings are missing for this location right now.',
    actionLabel: 'Retry',
    retryable: true,
  },
  'image-fallback': {
    title: 'Image changed',
    message: 'The photo could not load, so Cloudora used a clean fallback view.',
    retryable: false,
  },
  runtime: {
    title: 'Something went wrong',
    message: 'The dashboard hit a small issue. You can recover without losing your settings.',
    actionLabel: 'Reload view',
    retryable: true,
  },
  unknown: {
    title: 'Something needs attention',
    message: 'Cloudora could not finish that action. Please try again.',
    actionLabel: 'Retry',
    retryable: true,
  },
};

export const createErrorId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `error-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
};

export const createAppError = (input: AppErrorInput = {}): AppError => {
  const kind = input.kind || 'unknown';
  const fallback = messageByKind[kind];

  return {
    id: createErrorId(),
    kind,
    title: input.title || fallback.title,
    message: input.message || fallback.message,
    friendlyMessage: input.message || fallback.message,
    status: input.status,
    severity: input.severity || (kind === 'runtime' || kind === 'api' ? 'danger' : 'warning'),
    retryable: input.retryable ?? fallback.retryable,
    actionLabel: input.actionLabel || fallback.actionLabel,
    createdAt: new Date().toISOString(),
    source: input.source,
  };
};

export const isAppError = (error: unknown): error is AppError => {
  return Boolean(error && typeof error === 'object' && 'kind' in error && 'friendlyMessage' in error);
};

export const normalizeError = (error: unknown, fallback: AppErrorInput = {}): AppError => {
  if (isAppError(error)) return error;

  if (typeof navigator !== 'undefined' && !navigator.onLine) {
    return createAppError({ ...fallback, kind: 'offline' });
  }

  if (axios.isAxiosError(error)) {
    const status = error.response?.status;

    if (error.code === 'ECONNABORTED') {
      return createAppError({ ...fallback, kind: 'timeout', status });
    }

    if (status === 404) {
      return createAppError({ ...fallback, kind: 'invalid-city', status, retryable: false });
    }

    if (status === 429) {
      return createAppError({ ...fallback, kind: 'rate-limit', status });
    }

    if (status === 401 || status === 403) {
      return createAppError({
        ...fallback,
        kind: 'api',
        status,
        message: 'Weather access is not ready. Please check the app setup and try again.',
      });
    }

    if (!error.response) {
      return createAppError({ ...fallback, kind: 'offline' });
    }

    return createAppError({
      ...fallback,
      kind: fallback.kind || 'api',
      status,
      message: fallback.message,
    });
  }

  if (error instanceof Error) {
    return createAppError({ ...fallback, message: fallback.message || error.message });
  }

  return createAppError(fallback);
};

export const getErrorCopy = (kind: AppErrorKind) => messageByKind[kind];
