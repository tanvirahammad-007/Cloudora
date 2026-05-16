import { motion } from 'motion/react';
import {
  AlertTriangle,
  Bell,
  CheckCircle2,
  CloudRain,
  CloudSun,
  Eye,
  EyeOff,
  Leaf,
  MapPin,
  Thermometer,
  Trash2,
  X,
  Zap
} from 'lucide-react';
import { CloudoraNotification, NotificationCategory, NotificationSeverity } from '../../types/notification';
import { cn } from '../../lib/utils';

interface NotificationCardProps {
  notification: CloudoraNotification;
  onToggleRead: (id: string) => void;
  onRemove?: (id: string) => void;
  onClearCategory?: (category: NotificationCategory) => void;
  compact?: boolean;
}

const iconByCategory = {
  weather: Bell,
  rain: CloudRain,
  severe: Zap,
  temperature: Thermometer,
  aqi: Leaf,
  sun: CloudSun,
  daily: CheckCircle2,
  saved: MapPin,
};

const severityClass: Record<NotificationSeverity, string> = {
  info: 'text-sky-400 bg-sky-400/10 border-sky-400/20',
  success: 'text-emerald-400 bg-emerald-400/10 border-emerald-400/20',
  warning: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  danger: 'text-red-400 bg-red-400/10 border-red-400/20',
};

export const formatRelativeTime = (date: string) => {
  const diff = Date.now() - new Date(date).getTime();
  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) return 'Just now';
  if (diff < hour) return `${Math.max(1, Math.floor(diff / minute))}m ago`;
  if (diff < day) return `${Math.floor(diff / hour)}h ago`;
  return `${Math.floor(diff / day)}d ago`;
};

export default function NotificationCard({ notification, onToggleRead, onRemove, onClearCategory, compact }: NotificationCardProps) {
  const Icon = iconByCategory[notification.category] || AlertTriangle;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -8, scale: 0.96 }}
      transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'group relative overflow-hidden rounded-2xl border p-4 transition-all duration-300',
        notification.read
          ? 'border-[var(--border-color)] bg-[var(--text-main)]/[0.025] opacity-70 hover:opacity-100'
          : 'border-sky-400/20 bg-sky-400/[0.045] shadow-[0_14px_40px_-28px_rgba(56,189,248,0.9)]'
      )}
    >
      {!notification.read && (
        <div className="absolute left-0 top-5 h-10 w-1 rounded-r-full bg-sky-400 shadow-[0_0_18px_rgba(56,189,248,0.7)]" />
      )}

      <div className="flex items-start gap-3">
        <div className={cn('flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border', severityClass[notification.severity])}>
          <Icon size={17} strokeWidth={2.4} />
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="truncate text-sm font-black tracking-tight text-[var(--text-main)]">{notification.title}</p>
              <p className={cn('mt-1 text-xs font-semibold leading-relaxed text-[var(--text-muted)]', compact && 'line-clamp-2')}>
                {notification.message}
              </p>
            </div>
            <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-[var(--text-muted)] opacity-45">
              {formatRelativeTime(notification.createdAt)}
            </span>
          </div>

          <div className="mt-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <span className="rounded-full border border-[var(--border-color)] bg-[var(--text-main)]/[0.03] px-2.5 py-1 text-[9px] font-black uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {notification.category}
              </span>
              {notification.city && (
                <span className="truncate text-[10px] font-bold text-[var(--text-muted)] opacity-60">{notification.city}</span>
              )}
            </div>

            <div className="flex items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
              {onRemove && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onRemove(notification.id);
                  }}
                  className="rounded-lg p-2 text-[var(--text-muted)] transition-all hover:bg-red-500/10 hover:text-red-400"
                  title="Remove notification"
                >
                  <X size={13} />
                </button>
              )}
              {onClearCategory && (
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    onClearCategory(notification.category);
                  }}
                  className="rounded-lg p-2 text-[var(--text-muted)] transition-all hover:bg-red-500/10 hover:text-red-400"
                  title="Clear this category"
                >
                  <Trash2 size={13} />
                </button>
              )}
              <button
                type="button"
                onClick={(event) => {
                  event.stopPropagation();
                  onToggleRead(notification.id);
                }}
                className="rounded-lg p-2 text-[var(--text-muted)] transition-all hover:bg-[var(--text-main)]/10 hover:text-[var(--text-main)]"
                title={notification.read ? 'Mark unread' : 'Mark read'}
              >
                {notification.read ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
