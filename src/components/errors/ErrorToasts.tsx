import { AnimatePresence, motion } from 'motion/react';
import { AlertTriangle, X } from 'lucide-react';
import { useErrors } from '../../context/ErrorContext';
import { cn } from '../../lib/utils';

const severityClass = {
  info: 'border-sky-400/15 bg-sky-400/[0.06] text-sky-300',
  warning: 'border-amber-400/15 bg-amber-400/[0.07] text-amber-300',
  danger: 'border-red-400/15 bg-red-400/[0.07] text-red-300',
};

export default function ErrorToasts() {
  const { toasts, dismissError } = useErrors();

  return (
    <div className="pointer-events-none fixed bottom-6 left-4 right-4 z-[260] flex flex-col gap-3 sm:bottom-auto sm:left-auto sm:right-6 sm:top-52 sm:w-[390px] lg:right-8 lg:top-56 xl:right-10" aria-live="assertive" aria-relevant="additions removals">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.article
            key={toast.id}
            layout
            initial={{ opacity: 0, x: 28, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 28, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative overflow-hidden rounded-3xl border border-[var(--border-color)] bg-[var(--panel-bg)]/95 p-4 shadow-[0_24px_80px_-45px_rgba(14,165,233,0.9)] backdrop-blur-3xl"
          >
            <div className="flex items-start gap-3 pr-8">
              <div className={cn('flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border', severityClass[toast.severity])}>
                <AlertTriangle size={18} strokeWidth={2.2} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-black tracking-tight text-[var(--text-main)]">{toast.title}</p>
                <p className="mt-1 text-xs font-semibold leading-relaxed text-[var(--text-muted)]">{toast.friendlyMessage}</p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => dismissError(toast.id)}
              className="absolute right-4 top-4 rounded-full bg-[var(--text-main)]/[0.08] p-1.5 text-[var(--text-muted)] transition-all hover:text-[var(--text-main)]"
              aria-label="Close error message"
            >
              <X size={13} />
            </button>
          </motion.article>
        ))}
      </AnimatePresence>
    </div>
  );
}
