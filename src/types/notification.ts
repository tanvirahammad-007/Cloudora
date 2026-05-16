export type NotificationCategory =
  | 'weather'
  | 'rain'
  | 'severe'
  | 'temperature'
  | 'aqi'
  | 'sun'
  | 'daily'
  | 'saved';

export type NotificationSeverity = 'info' | 'success' | 'warning' | 'danger';

export interface CloudoraNotification {
  id: string;
  fingerprint: string;
  category: NotificationCategory;
  severity: NotificationSeverity;
  title: string;
  message: string;
  city?: string;
  createdAt: string;
  read: boolean;
  source: 'system' | 'weather' | 'saved-city';
}
