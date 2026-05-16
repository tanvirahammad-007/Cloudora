export type AppErrorKind =
  | 'empty-search'
  | 'invalid-city'
  | 'offline'
  | 'timeout'
  | 'rate-limit'
  | 'api'
  | 'missing-data'
  | 'location-denied'
  | 'forecast-unavailable'
  | 'air-quality-unavailable'
  | 'image-fallback'
  | 'runtime'
  | 'unknown';

export type AppErrorSeverity = 'info' | 'warning' | 'danger';

export interface AppError {
  id: string;
  kind: AppErrorKind;
  title: string;
  message: string;
  friendlyMessage: string;
  status?: number;
  severity: AppErrorSeverity;
  retryable: boolean;
  actionLabel?: string;
  createdAt: string;
  source?: string;
}

export interface AppErrorInput {
  kind?: AppErrorKind;
  title?: string;
  message?: string;
  status?: number;
  severity?: AppErrorSeverity;
  retryable?: boolean;
  actionLabel?: string;
  source?: string;
}
