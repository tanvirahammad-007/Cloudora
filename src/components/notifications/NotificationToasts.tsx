import { AnimatePresence, motion } from 'motion/react';
import { X } from 'lucide-react';
import { useNotifications } from '../../context/NotificationContext';
import NotificationCard from './NotificationCard';
import { memo } from 'react';

function NotificationToasts() {
  const { toasts, removeNotification, toggleRead } = useNotifications();

  return (
    <div className="pointer-events-none fixed bottom-[calc(6rem+env(safe-area-inset-bottom))] left-4 right-4 z-[250] flex flex-col gap-3 sm:bottom-auto sm:left-auto sm:right-6 sm:top-28 sm:w-[380px] lg:right-8 lg:top-32 xl:right-10" aria-live="polite" aria-relevant="additions removals">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout={false}
            initial={{ opacity: 0, x: 32, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 32, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto relative rounded-2xl border border-sky-400/10 bg-[var(--panel-bg)] p-1 shadow-[0_24px_70px_-35px_rgba(14,165,233,0.9)] backdrop-blur-3xl"
          >
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                removeNotification(toast.id);
              }}
              className="absolute right-3 top-3 z-10 rounded-full bg-[var(--text-main)]/[0.08] p-1.5 text-[var(--text-muted)] transition-all hover:text-[var(--text-main)]"
              aria-label="Remove notification"
            >
              <X size={12} />
            </button>
            <NotificationCard notification={toast} onToggleRead={toggleRead} compact />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export default memo(NotificationToasts);
