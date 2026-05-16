import { AlertTriangle, CloudOff, RefreshCw, SearchX, WifiOff } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';
import { AppError, AppErrorKind } from '../../types/error';

interface ErrorStateCardProps {
  error?: AppError | null;
  kind?: AppErrorKind;
  title?: string;
  message?: string;
  actionLabel?: string;
  onRetry?: () => void;
  compact?: boolean;
  className?: string;
}

const iconByKind: Partial<Record<AppErrorKind, typeof AlertTriangle>> = {
  offline: WifiOff,
  'invalid-city': SearchX,
  'empty-search': SearchX,
  'forecast-unavailable': CloudOff,
  'air-quality-unavailable': CloudOff,
  timeout: RefreshCw,
};

export default function ErrorStateCard({
  error,
  kind = error?.kind || 'unknown',
  title,
  message,
  actionLabel,
  onRetry,
  compact,
  className,
}: ErrorStateCardProps) {
  const Icon = iconByKind[kind] || AlertTriangle;
  const resolvedTitle = title || error?.title || 'Something needs attention';
  const resolvedMessage = message || error?.friendlyMessage || 'Please try again in a moment.';
  const resolvedAction = actionLabel || error?.actionLabel || 'Try again';

  return (
    <motion.div
      initial={{ opacity: 0, y: 14, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        'glass-panel flex flex-col items-center justify-center rounded-[2.5rem] border border-[var(--border-color)] bg-[var(--panel-bg)]/90 text-center shadow-[0_30px_90px_-50px_rgba(14,165,233,0.7)]',
        compact ? 'min-h-[220px] gap-4 p-6' : 'min-h-[340px] gap-6 p-8 lg:p-12',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className={cn(
        'flex items-center justify-center rounded-3xl border border-sky-400/15 bg-sky-400/10 text-sky-300 shadow-[0_20px_60px_-35px_rgba(56,189,248,0.9)]',
        compact ? 'h-14 w-14' : 'h-20 w-20'
      )}>
        <Icon size={compact ? 24 : 34} strokeWidth={1.8} />
      </div>

      <div className="max-w-md space-y-2">
        <h3 className={cn('font-black tracking-tight text-[var(--text-main)]', compact ? 'text-lg' : 'text-2xl lg:text-3xl')}>
          {resolvedTitle}
        </h3>
        <p className="text-sm font-semibold leading-relaxed text-[var(--text-muted)]">
          {resolvedMessage}
        </p>
      </div>

      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex items-center gap-2 rounded-2xl bg-[var(--text-main)] px-6 py-3 text-xs font-black uppercase tracking-[0.18em] text-[var(--bg-color)] shadow-xl transition-all hover:scale-[1.02] active:scale-95"
        >
          <RefreshCw size={14} />
          {resolvedAction}
        </button>
      )}
    </motion.div>
  );
}
